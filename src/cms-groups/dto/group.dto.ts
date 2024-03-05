import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/shared/pagination/page-option.dto';

export class CreateGroupDto {
  @ApiProperty({ description: 'name' })
  name: string;

  @ApiProperty({ required: false, description: 'image_group' })
  imageGroup: string;

  @ApiProperty({ required: false, description: 'groupRole' })
  groupRole: string | null;
}

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}

export class GroupFilterDto extends OmitType(PageOptionsDto, [
  'order',
] as const) {
  @ApiProperty({ required: false })
  freeText: string | null;

  @ApiProperty({ required: false })
  groupId: string | null;
}
