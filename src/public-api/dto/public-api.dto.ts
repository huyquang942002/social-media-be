import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/shared/pagination/page-option.dto';

export class ProfileFilterDto extends OmitType(PageOptionsDto, [
  'order',
] as const) {
  @ApiProperty()
  otherId: string;
}
