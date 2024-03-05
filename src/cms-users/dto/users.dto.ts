import { AutoMap } from '@automapper/classes';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserCodeType } from 'src/mailer/dto/type-noti.enum';
import { GenderEnum } from 'src/shared/gender.enum';
import { PageOptionsDto } from 'src/shared/pagination/page-option.dto';

export class UsersFilter extends OmitType(PageOptionsDto, ['order'] as const) {
  @ApiProperty({ required: false })
  freeText: string;
  @ApiProperty({ required: false, default: false })
  isOnlyUserName: string;
}

export class CreateUserDto {
  @ApiProperty({ required: false })
  username: string | null;

  @ApiProperty({ required: false })
  email: string | null;

  @ApiProperty({ required: false })
  password: string | null;

  @ApiProperty({ required: false })
  firstName: string | null;

  @ApiProperty({ required: false })
  lastName: string | null;

  @ApiProperty({ required: false })
  phoneNumber: string | null;

  @ApiProperty({ required: false })
  dob: string | null;

  @ApiProperty({
    required: false,
    description: 'MALE/FEMALE/OTHER',
    enum: GenderEnum,
    default: 'MALE',
  })
  gender: GenderEnum | null;

  @ApiProperty({ default: false })
  isUpdateAva: boolean | null;

  @ApiProperty({ default: '700000' })
  zipcode: string | null;

  @ApiProperty({ default: 'Thủ Đức , Hồ Chí Minh' })
  address: string | null;
}

export class RegisterDto {
  @ApiProperty({ required: false })
  email: string | null;

  @ApiProperty({ required: true })
  password: string | null;

  @ApiProperty({ required: true })
  username: string | null;
}

export class UpdateProfileUser extends CreateUserDto {}

export class UpdatePasswordDto {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  email: string | null;
}

export class VerifyMailCodeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: UserCodeType, default: 'VERIFY_EMAIL' })
  type: UserCodeType;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ default: false })
  isDeleteAva: boolean | null;
}

export class DeleteUsersDto {
  @ApiProperty({ required: true })
  ids: string[];
}

export class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false })
  deviceId: string;

  @ApiProperty({ required: false })
  platform: string;

  @ApiProperty({ required: false, default: false })
  isRememberMe: boolean;
}

export class LogoutDto {
  @ApiProperty({ required: false })
  type: string;
}

export class SetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserDto {
  @AutoMap()
  id: string;

  @AutoMap()
  email: string | null;

  @AutoMap()
  gender: string | null;

  @AutoMap()
  s3Profile: string | null;

  @AutoMap()
  fullName: string | null;

  @AutoMap()
  phoneNumber: string | null;

  @AutoMap()
  dateOfBirth: string | null;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  isUpdatedProfile: boolean | null;

  @AutoMap()
  isActiveEmail: boolean;

  @AutoMap()
  wallImg: string | null;

  // @AutoMap()
  // totalThreads: string | null;
}
