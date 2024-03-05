import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  ForgotPasswordDto,
  LogoutDto,
  RegisterDto,
  ResetPasswordDto,
  UpdatePasswordDto,
  UpdateProfileUser,
  VerifyMailCodeDto,
} from 'src/cms-users/dto/users.dto';
import { UsersService } from 'src/services/users.service';
import { successMessage } from 'src/shared/utils';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register-account')
  async registerAccount(@Body() dto: RegisterDto) {
    const data = await this.usersService.registerAccount(dto);
    return successMessage({
      message: 'Register new account success',
      data,
    });
  }

  @Post('/send-forgot-password')
  async sendForgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.usersService.sendForgotPassword(dto);
    return successMessage({ message: 'Sent Successfully' });
  }

  @Post('/verify-user-code')
  async verifyUserCode(@Body() dto: VerifyMailCodeDto) {
    const userId = await this.usersService.verifyUserCode(dto);
    return successMessage({
      message: 'Verify Successfully',
      data: { userId },
    });
  }

  @Post('/reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.usersService.resetPassword(dto);
    return successMessage({
      message: 'success',
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('send-verify-mail')
  async sendVerifyMail(@Req() req) {
    const { id: userId } = req.user;
    await this.usersService.sendVerifyMail(userId);
    return successMessage({
      message: 'Verify Mail successfully',
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findOne(@Req() req) {
    const { id: userId } = req.user;
    return await this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Use for change password in user profile screen',
  })
  @Post('/update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Body() dto: UpdatePasswordDto, @Req() req) {
    const { id: currentUserId } = req.user;
    await this.usersService.updatePassword(dto, currentUserId);
    return successMessage({
      message: 'Change password completed',
    });
  }

  @ApiOperation({
    summary: 'Presigned Url picture profile',
  })
  @Get('presigned-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async presignAvatar(@Req() req) {
    const { id: userId } = req.user;
    return await this.usersService.presignAvatar(userId);
  }

  @ApiOperation({
    summary: 'Delete profile picture for user',
  })
  @Delete('/delete-profile-picture')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async removeAvatar(@Req() req) {
    const { id: userId } = req.user;
    await this.usersService.removeAvatar(userId);
    return successMessage({
      message: 'Delete completed',
    });
  }

  // @ApiOperation({
  //   summary: 'Logout',
  // })
  // @Post('logout')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async logout(@Body() dto: LogoutDto, @Req() req) {
  //   const { id: userId } = req.user;
  //   const { type } = dto;
  //   await this.usersService.removeTokensWithType(userId, type);
  //   return successMessage({
  //     message: 'Logout success',
  //   });
  // }

  @ApiOperation({ summary: 'Update profile user' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/update-profile-user')
  async updateProfileUser(@Body() dto: UpdateProfileUser, @Req() req) {
    const { id: userId } = req.user;
    await this.usersService.updateProfileUser(userId, dto);
    return successMessage({ message: 'Updated Successfully' });
  }
}
