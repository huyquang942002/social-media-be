import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Users } from 'src/entities/Users';
import { PageMetaDto } from 'src/shared/pagination/page-meta.dto';
import { PaginationDto } from 'src/shared/pagination/pagination.dto';
import {
  getS3Presigned,
  getSkip,
  randomCharacter,
  randomNumber,
  randomString,
} from 'src/shared/utils';
import { Between, In, IsNull, Not, Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { addYears } from 'date-fns';
import { AuthService } from 'src/auth/service/auth.service';
import {
  CreateUserDto,
  DeleteUsersDto,
  ForgotPasswordDto,
  RegisterDto,
  ResetPasswordDto,
  SetPasswordDto,
  UpdatePasswordDto,
  UpdateProfileUser,
  UpdateUserDto,
  UsersFilter,
  VerifyMailCodeDto,
} from 'src/cms-users/dto/users.dto';
import { UserCodes } from 'src/entities/UserCodes';
import { UserCodeType } from 'src/mailer/dto/type-noti.enum';
import { SendMailService } from 'src/mailer/send-mail.service';
import { URLPROFILE } from 'src/constant/user.constant';

export const AfterDate = (date: Date) => Between(date, addYears(date, 100));

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(UserCodes)
    private userCodesRepository: Repository<UserCodes>,
    private authService: AuthService,
    private readonly configService: ConfigService,
    private readonly sendMailService: SendMailService,
  ) {}

  async create(dto: CreateUserDto, createdBy: string) {
    const {
      username,
      email,
      phoneNumber,
      password,
      gender,
      firstName,
      lastName,
      dob,
      isUpdateAva,
    } = dto;

    if (!username || !password) {
      throw new HttpException(
        'Username or password can not empty.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (username?.length < 8) {
      throw new HttpException(
        'Username must be at least 8 characters.',
        HttpStatus.BAD_REQUEST,
      );
    }

    //validate username
    const existedUserName = await this.usersRepository.findOne({
      username,
      deletedAt: IsNull(),
    });
    if (existedUserName) {
      throw new HttpException('Username is existed.', HttpStatus.BAD_REQUEST);
    }
    //validate email
    if (email) {
      const existedEmail = await this.usersRepository.findOne({
        email,
        deletedAt: IsNull(),
      });
      if (existedEmail) {
        throw new HttpException(
          'Email is linked with other account.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    //validate phone
    if (phoneNumber) {
      const existedPhone = await this.usersRepository.findOne({
        phoneNumber,
        deletedAt: IsNull(),
      });
      if (existedPhone) {
        throw new HttpException(
          'Phone is linked with other account.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    //format password.
    const formatedPassword = await this.hashPassword(password);

    //generate link profile
    let s3Profile = '';
    if (isUpdateAva?.toString() === 'true') {
      s3Profile = `profilePic_${new Date().getTime().toString()}`;
    }

    //insert to user.
    const newUser = await this.usersRepository.save(
      this.usersRepository.create({
        email,
        password: formatedPassword,
        s3Profile,
        firstName,
        lastName,
        phoneNumber,
        gender,
        dob,
        username,
        createdBy,
      }),
    );

    //insert to userAgents.
    const { id: userId } = newUser;

    let uploadProfileLink = '';
    if (isUpdateAva?.toString() === 'true') {
      uploadProfileLink = await this.presignedUrlAvatar(s3Profile, userId);
    }

    return {
      userId,
      uploadProfileLink,
    };
  }

  async findAll(input: UsersFilter) {
    const { freeText, page, take, isOnlyUserName } = input;

    let builder = this.usersRepository.createQueryBuilder('u');
    if (isOnlyUserName?.toString() === 'true') {
      builder = builder.select(['u.id', 'u.username']);
    }

    builder = builder.where(
      `u.deletedAt is null
      ${
        freeText
          ? ' and ( LOWER(u.email) like :freeText or LOWER(u.username) like :freeText or LOWER(u.phone_number) like :freeText or LOWER(u.first_name) like :freeText or LOWER(u.last_name) like :freeText)'
          : ''
      }
      `,
      {
        ...(freeText ? { freeText: `%${freeText.toLowerCase()}%` } : {}),
      },
    );

    const [users, count] = await builder
      .orderBy('u.id', 'DESC')
      .take(take)
      .skip(getSkip({ page, take }))
      .getManyAndCount();

    if (isOnlyUserName?.toString() === 'true') {
    }

    return new PaginationDto(users, <PageMetaDto>{
      page,
      take,
      totalCount: count,
    });
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
  }

  async update(id: string, dto: UpdateUserDto, updatedBy: string) {
    const { username, email, phoneNumber, password, isUpdateAva, isDeleteAva } =
      dto;

    const user = await this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!user)
      throw new HttpException(`Cannot find this user`, HttpStatus.BAD_REQUEST);

    if (username?.length < 8) {
      throw new HttpException(
        'Username must be at least 8 characters.',
        HttpStatus.BAD_REQUEST,
      );
    }

    //validate username
    const existedUserName = await this.usersRepository.findOne({
      username,
      deletedAt: IsNull(),
      id: Not(id),
    });
    if (existedUserName) {
      throw new HttpException('Username is existed.', HttpStatus.BAD_REQUEST);
    }
    //validate email
    if (email) {
      const existedEmail = await this.usersRepository.findOne({
        email,
        deletedAt: IsNull(),
        id: Not(id),
      });
      if (existedEmail) {
        throw new HttpException(
          'Email is linked with other account.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    //validate phone
    if (phoneNumber) {
      const existedPhone = await this.usersRepository.findOne({
        phoneNumber,
        deletedAt: IsNull(),
        id: Not(id),
      });
      if (existedPhone) {
        throw new HttpException(
          'Phone is linked with other account.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    //format password.
    let formatedPassword = user?.password;
    if (password) {
      formatedPassword = await this.hashPassword(password);
    }

    const currentTime = new Date().getTime().toString();

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...dto,
      password: formatedPassword,
      ...(isDeleteAva?.toString() === 'true'
        ? { s3Profile: '' }
        : isUpdateAva?.toString() === 'true'
        ? { s3Profile: `profilePic_${currentTime}` }
        : {}),
      updatedAt: moment().format(),
      updatedBy,
    });

    if (isUpdateAva?.toString() === 'true') {
      //get link
      const uploadLink = await this.presignedUrlAvatar(
        `profilePic_${currentTime}`,
        id,
      );
      return { id: updatedUser?.id, uploadLink };
    }
    return { id: updatedUser?.id };
  }

  async remove(dto: DeleteUsersDto, deletedBy: string) {
    const { ids } = dto;
    if (ids?.length > 0) {
      await this.usersRepository.update(
        {
          id: In(ids),
          deletedAt: IsNull(),
        },
        {
          deletedAt: moment().format(),
          deletedBy,
        },
      );
    }
  }

  async registerAccount(dto: RegisterDto) {
    const { username, password, email } = dto;

    if (!email || !password) {
      throw new HttpException(
        'email or password can not empty.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (password.length < 6) {
      throw new HttpException(
        'Password must be greater than 6 characters.',
        HttpStatus.BAD_REQUEST,
      );
    }

    //validate username
    const existedEmail = await this.usersRepository.findOne({
      email,
      deletedAt: IsNull(),
    });
    if (existedEmail) {
      throw new HttpException('Email is existed.', HttpStatus.BAD_REQUEST);
    }

    //format password.
    const formatedPassword = await this.hashPassword(password);

    //insert to user.
    const newUser = await this.usersRepository.save(
      this.usersRepository.create({
        password: formatedPassword,
        email,
        username,
      }),
    );

    const { id: userId } = newUser;

    return {
      userId,
    };
  }

  async sendForgotPassword(dto: ForgotPasswordDto): Promise<boolean> {
    const { email } = dto;
    const user = await this.usersRepository.findOne({
      where: {
        email,
        deletedAt: IsNull(),
      },
    });
    if (!user) {
      throw new HttpException('User is not existed', HttpStatus.BAD_REQUEST);
    }
    const { id, phoneNumber } = user;
    if (!email && !phoneNumber) {
      throw new HttpException(
        'User did not verify email or phone before.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.generateCodeAndPush(
      id,
      UserCodeType.FORGOT_PASSWORD_MAIL,
      email,
    );

    return true;
  }

  async sendVerifyMail(userId: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: IsNull(),
    });
    if (!user) {
      throw new HttpException('User is not existed', HttpStatus.BAD_REQUEST);
    }

    const { id, email } = user;
    if (!email) {
      throw new HttpException(
        'User did not update email.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.generateCodeAndPush(id, UserCodeType.VERIFY_MAIL, email);

    return true;
  }

  async verifyUserCode(dto: VerifyMailCodeDto): Promise<string> {
    const { code: value, type } = dto;
    const currentAccountCode = await this.userCodesRepository.findOne({
      type,
      value,
      deletedAt: IsNull(),
    });
    if (!currentAccountCode)
      throw new HttpException('Code is not valid', HttpStatus.BAD_REQUEST);

    const { expiredTime } = currentAccountCode;
    if (expiredTime < new Date())
      throw new HttpException('Code is expired', HttpStatus.BAD_REQUEST);

    //return user information
    const { userId: id } = currentAccountCode;
    const currentUser = await this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!currentUser)
      throw new HttpException('User is not existed', HttpStatus.BAD_REQUEST);

    //update is actived email
    switch (type) {
      case UserCodeType.VERIFY_MAIL:
        await this.usersRepository.save({
          ...currentUser,
          isActiveEmail: true,
          updatedBy: id,
          updatedAt: moment().format(),
        });
        break;

      case UserCodeType.FORGOT_PASSWORD_MAIL:
        await this.usersRepository.save({
          ...currentUser,
          updatedBy: id,
          updatedAt: moment().format(),
        });
        break;
    }

    //delete accountcode.
    await this.userCodesRepository.save({
      ...currentAccountCode,
      deletedAt: moment().format(), // updated fields
      deletedBy: id,
    });
    return id;
  }

  async updatePassword(dto: UpdatePasswordDto, userId: string) {
    const { oldPassword, newPassword } = dto;

    const existedUser = await this.usersRepository.findOne({
      id: userId,
      deletedAt: IsNull(),
    });
    if (!existedUser)
      throw new HttpException('User is not existed', HttpStatus.BAD_REQUEST);

    const checkPwd = await this.authService.comparePasswords(
      oldPassword,
      existedUser.password,
    );

    if (!checkPwd) {
      throw new HttpException(
        'Old password is not correct',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await this.hashPassword(newPassword);

    //update password
    await this.usersRepository.save({
      ...existedUser,
      password: hashPassword,
      updatedBy: userId,
      updatedAt: moment().format(),
    });
  }

  async resetPassword(resetDto: ResetPasswordDto): Promise<boolean> {
    const { password, email } = resetDto;

    const user = await this.usersRepository.findOne({
      email,
      deletedAt: IsNull(),
    });
    if (!user)
      throw new HttpException('User is not existed', HttpStatus.BAD_REQUEST);

    const hashPassword = await this.hashPassword(password);

    //update password
    await this.usersRepository.save({
      ...user,
      password: hashPassword,
      updatedBy: user.id,
      updatedAt: moment().format(),
    });

    return true;
  }

  async presignAvatar(userId: string) {
    const user = await this.usersRepository.findOne({
      id: userId,
      deletedAt: IsNull(),
    });
    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.BAD_REQUEST);
    }
    const s3Profile = `profilePic_${new Date().getTime().toString()}`;

    await this.usersRepository.save({
      ...user,
      s3Profile,
      updatedAt: moment().format(),
      updatedBy: userId,
    });
    const s3NewLinks = await this.presignedUrlAvatar(s3Profile, userId);
    return {
      userId,
      s3NewLinks,
    };
  }

  async removeAvatar(id: string) {
    const user = await this.usersRepository.findOne({
      id,
      deletedAt: IsNull(),
    });
    if (!user) {
      throw new HttpException('User is not existed', HttpStatus.BAD_REQUEST);
    }
    await this.usersRepository.save({
      ...user,
      s3Profile: null,
      updatedAt: moment().format(),
      updatedBy: id,
    });
  }

  //check account code is correct
  async setPassword(userId: string, dto: SetPasswordDto, updatedBy: string) {
    const { password } = dto;

    const existedUser = await this.usersRepository.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });
    if (!existedUser)
      throw new HttpException('User not existed', HttpStatus.BAD_REQUEST);

    const hashedPassword = await this.hashPassword(password);

    await this.usersRepository.save({
      ...existedUser,
      password: hashedPassword,
      updatedAt: moment().format(),
      updatedBy,
    });
  }

  async presignedUrlAvatar(link, userId) {
    const url = await getS3Presigned(
      link,
      `${URLPROFILE}_${userId}`,
      this.configService,
    );
    return url;
  }

  private async hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  private async generateCodeAndPush(userId, type, email) {
    const realCode = await this.generateUserCode(userId, type);

    switch (type) {
      case UserCodeType.FORGOT_PASSWORD_MAIL: {
        const linkSendMail = `OTP lấy lại mật khẩu của bạn là : ${realCode}`;
        //send mail
        if (email) {
          this.sendMailService.sendMail(email, 'Forgot Password', linkSendMail);
          return;
        }
        break;
      }
      case UserCodeType.VERIFY_MAIL: {
        const linkSendMail = `OTP xác thực email của bạn là : ${realCode}`;
        //send mail
        if (email) {
          await this.sendMailService.sendMail(
            email,
            'Verify Email',
            `Please click on link to verify mail.
            ${linkSendMail}`,
          );
          return;
        }
        break;
      }
    }
  }
  //generate code
  private async generateUserCode(userId: string, type) {
    const currentCode = await this.userCodesRepository.findOne({
      userId,
      type,
      expiredTime: AfterDate(new Date()),
      deletedAt: IsNull(),
    });

    let realCode = '';
    if (!currentCode) {
      const newCode = await this.userCodesRepository.create({
        userId,
        type,
        expiredTime: moment.utc().add(30, 'minute'),
        value: randomNumber({ length: 4 }),
      });
      await this.userCodesRepository.save(newCode);

      //send mail verification
      realCode = newCode?.value;
    } else {
      realCode = currentCode?.value;
    }
    return realCode;
  }

  async updateProfileUser(id: string, dto: UpdateProfileUser) {
    const { email, phoneNumber } = dto;

    //validate email
    if (email) {
      const existedEmail = await this.usersRepository.findOne({
        email,
        id: Not(id),
      });
      if (existedEmail)
        throw new HttpException(
          'Email already exists in the system, please choose another email',
          HttpStatus.BAD_REQUEST,
        );
    }

    //validate phone
    if (phoneNumber) {
      const existedPhone = await this.usersRepository.findOne({
        phoneNumber,
        id: Not(id),
      });
      if (existedPhone) {
        throw new HttpException(
          'Phone is linked with other account.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const currentUser = await this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!currentUser) {
      throw new HttpException('User is not existed.', HttpStatus.BAD_REQUEST);
    }

    const { email: currentEmail, isActiveEmail } = currentUser;

    return this.usersRepository.save({
      ...currentUser, // existing fields
      ...dto,
      isActiveEmail: currentEmail === email ? isActiveEmail : false,
      updatedBy: id,
      updatedAt: moment().format(),
    });
  }
}
