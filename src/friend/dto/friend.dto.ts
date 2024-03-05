import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/shared/pagination/page-option.dto';

export class CreateFriendDto {
  @ApiProperty({
    required: true,
  })
  otherUserId: string;
}
export class FriendsFilter extends OmitType(PageOptionsDto, [
  'order',
] as const) {}

export class deleteFriendDto {
  @ApiProperty({ required: true })
  ids: string[];
}

export class ProposeFriendFilterDto extends PageOptionsDto {
  // @ApiProperty({ required: false, enum: TagEnum, default: 'PET' })
  // filterByType: TagEnum = TagEnum.PET;
}
