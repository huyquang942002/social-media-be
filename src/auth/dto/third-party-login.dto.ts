import { RegisByEnum } from '../../shared/regis-by.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ThirdPartyLoginDto {
  @ApiProperty()
  type: RegisByEnum;

  @ApiProperty()
  uid: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ required: false })
  deviceId: string;

  @ApiProperty({ required: false })
  platform: string;
}

export class RegisterThirdPartyDto {
  @ApiProperty({ required: true })
  type: RegisByEnum;

  @ApiProperty({ required: true })
  uid: string;

  @ApiProperty({ required: true })
  email: string;
  @ApiProperty({ required: true })
  uniqueUrl: string;

  @ApiProperty({ required: false })
  phoneNumber: string;

  @ApiProperty({ required: false })
  fullName: string;

  @ApiProperty({ required: false })
  deviceId: string;

  @ApiProperty({ required: false })
  platform: string;
}
