import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/cms-users/dto/users.dto';
import { ReturnMessage } from 'src/shared/utils';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './service/auth.service';

@ApiTags('authentication')
@Controller('authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req,
  ): Promise<LoginResponseDto | ReturnMessage> {
    const data = await this.authService.login(dto);

    //setting session
    req.loggingUser = data?.userId;

    return data?.token;
  }
}
