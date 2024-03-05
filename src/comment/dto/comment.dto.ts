import { AutoMap } from '@automapper/classes';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UserDto } from 'src/cms-users/dto/users.dto';
import { Users } from 'src/entities/Users';
import { IFullAuditDto } from 'src/shared/full-audit.dto';
import { IObjectKeyDto } from 'src/shared/object-key.dto';
import { PageOptionsDto } from 'src/shared/pagination/page-option.dto';

export class CreateCommentDto {
  @AutoMap()
  @ApiProperty({ required: true, default: '1' })
  postId: string;

  @AutoMap()
  @ApiProperty({ required: true })
  content: string;

  @AutoMap()
  @ApiProperty({ required: false, description: 'Parent comment', default: '1' })
  commentId: string;

  @AutoMap()
  @ApiProperty({ required: false, description: 'Images Comment' })
  commentImageName: string;
}

export class CommentChildFilterDto extends PageOptionsDto {
  @AutoMap()
  @ApiProperty({ required: false, description: 'Comment Id' })
  commentId: string;
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @AutoMap()
  @ApiProperty({ required: false, default: false })
  isRemoveImage: boolean;
}

export class UpdateCommentDtoCms extends PartialType(CreateCommentDto) {
  @AutoMap()
  @ApiProperty({ required: false })
  love: string | null;

  @AutoMap()
  @ApiProperty({ required: false })
  disLove: string | null;
}

export class CommentFilterDto extends OmitType(PageOptionsDto, [
  'order',
] as const) {
  @AutoMap()
  @ApiProperty({ required: false })
  freeText: string | null;

  @AutoMap()
  @ApiProperty({ required: false })
  postId: string | null;

  @AutoMap()
  @ApiProperty({ required: false })
  userId: string | null;
}

export class DeleteCommentDto {
  @ApiProperty({ required: true })
  ids: string[];
}

export class CommentDto implements IFullAuditDto, IObjectKeyDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  commentId: string | null;

  @AutoMap()
  @ApiProperty()
  commentImageName: string | null;

  @AutoMap()
  @ApiProperty()
  content: string;

  @AutoMap()
  @ApiProperty()
  totalLove: string | null;

  @AutoMap()
  @ApiProperty()
  totalDisLove: string | null;

  @AutoMap()
  @ApiProperty()
  totalComment: string | null;

  @AutoMap()
  @ApiProperty()
  postId: string | null;

  @AutoMap()
  @ApiProperty()
  createdAt: Date;

  @AutoMap()
  @ApiProperty()
  createdBy: string | null;

  @AutoMap()
  @ApiProperty()
  updatedAt: Date | null;

  @AutoMap()
  @ApiProperty()
  updatedBy: string | null;

  @AutoMap()
  @ApiProperty()
  deletedAt: Date | null;

  @AutoMap()
  @ApiProperty()
  deletedBy: string | null;

  @AutoMap()
  @ApiProperty()
  createdUser: Users | null;
}

export class ViewCommentDto extends CommentDto {}
