import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/cms-users/dto/users.dto';
import { Users } from 'src/entities/Users';
import { PLATFORM_CMS } from 'src/shared/const.global';
import { IsNull, Repository } from 'typeorm';
import { mapper } from '../../configuration/mapper';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserInHeaderResponseDto } from '../dto/user-in-header-response.dto';
import { UserDevices } from 'src/entities/UserDevices';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(UserDevices)
    private readonly userDevicesRepository: Repository<UserDevices>,
  ) {}

  async login(dto: LoginDto) {
    const { email, password, platform, deviceId, isRememberMe } = dto;

    if (!email)
      throw new HttpException(`email can not empty`, HttpStatus.BAD_REQUEST);
    if (!password)
      throw new HttpException(`Password can not empty`, HttpStatus.BAD_REQUEST);

    const user = await this.usersRepository.findOne({
      where: [
        {
          email,
          deletedAt: IsNull(),
        },
      ],
    });

    if (!user) {
      throw new HttpException(`User is not existed`, HttpStatus.BAD_REQUEST);
    }

    if (platform === PLATFORM_CMS && !user?.isAccessCms) {
      throw new HttpException(
        `User can not access this page!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { password: currentPassword } = user;

    const comparedResult = await bcrypt.compare(password, currentPassword);

    if (!comparedResult) {
      throw new HttpException(
        `email or password is not correct!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Insert new record in user_device
    if (platform && deviceId) {
      const userDevice = await this.userDevicesRepository.findOne({
        where: {
          userId: user?.id,
          type: platform,
          token: deviceId,
        },
      });

      if (!userDevice) {
        await this.userDevicesRepository.save(
          await this.userDevicesRepository.create({
            userId: user?.id,
            platform,
            deviceId,
          }),
        );
      }
    }

    const token = await this.getAccessToken(user, isRememberMe);
    return {
      token,
      userId: user?.id,
    };
  }

  async getAccessToken(user: Users, isRememberMe): Promise<LoginResponseDto> {
    const expiresIn = this.configService.get<string>(
      isRememberMe?.toString() === 'true'
        ? 'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
        : 'JWT_ACCESS_TOKEN_EXPIRATION_NO_REMEMBER_TIME',
    );

    const accessToken = await this.jwtService.signAsync(
      { user: mapper.map(user, Users, UserInHeaderResponseDto) },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${expiresIn}`,
      },
    );

    return new LoginResponseDto({
      accessToken: accessToken,
      expiresIn: expiresIn,
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, storedPasswordHash);
  }

  verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }
}
