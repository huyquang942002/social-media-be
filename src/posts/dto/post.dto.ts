import { AutoMap } from '@automapper/classes';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PostGalleries } from 'src/entities/PostGalleries';
import { Users } from 'src/entities/Users';
import { FilterFeedType } from 'src/shared/filter-feed-type.enum';
import { IFullAuditDto } from 'src/shared/full-audit.dto';
import { PostType } from 'src/shared/interact.enum';
import { IObjectKeyDto } from 'src/shared/object-key.dto';
import { PageOptionsDto } from 'src/shared/pagination/page-option.dto';
import { TagEnum } from 'src/shared/tag-enum';

export class CreatePostGalleriesDto {
  @AutoMap()
  @ApiProperty()
  link: string | null;

  @AutoMap()
  @ApiProperty()
  name: string | null;

  @AutoMap()
  @ApiProperty()
  description: string | null;

  createBy: string;
}

export class CreatePostDto {
  @ApiProperty()
  content: string | null;

  @ApiProperty()
  address: string | null;

  @ApiProperty({ required: false, type: [CreatePostGalleriesDto] })
  postGalleries: CreatePostGalleriesDto[] | null;

  @ApiProperty({ required: false, enum: TagEnum, default: TagEnum.PET })
  tag: TagEnum | null;
}

export class CreatePostDtoCms extends PartialType(CreatePostDto) {
  @ApiProperty()
  love: string | null;

  @ApiProperty()
  disLove: string | null;
}

export class UpdatePostDto extends CreatePostDto {
  @ApiProperty()
  deleteGalleryIds: string | null;
}

export class UpdatePostDtoCms extends CreatePostDto {
  @ApiProperty()
  deleteGalleryIds: string | null;

  @ApiProperty()
  love: string | null;

  @ApiProperty()
  disLove: string | null;
}

export class PostFilterDto extends OmitType(PageOptionsDto, [
  'order',
] as const) {
  @ApiProperty({ required: false, enum: TagEnum, default: TagEnum.PET })
  @IsEnum(TagEnum)
  tag?: TagEnum = TagEnum.PET;

  @ApiProperty({ required: false, description: 'YYYY-MM-DD' })
  startDate: Date | null;

  @ApiProperty({ required: false, description: 'YYYY-MM-DD' })
  endDate: Date | null;
}

export class findAllPostFilter extends OmitType(PageOptionsDto, [
  'order',
] as const) {}

export class PostHavePostFilterDto extends PageOptionsDto {}

export class PostGalleriesDto extends CreatePostGalleriesDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  postId: string;
}

export class PostDto implements IFullAuditDto, IObjectKeyDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  totalLove: string | null;

  @AutoMap()
  @ApiProperty()
  totalDislove: string | null;

  @AutoMap()
  @ApiProperty()
  totalComment: string | null;

  @AutoMap()
  @ApiProperty()
  content: string | null;

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
  postGalleries: PostGalleries[];

  @AutoMap()
  @ApiProperty()
  createdUser: Users;

  @AutoMap()
  @ApiProperty()
  updatedUser: Users;
}

export class ViewPostDto extends PostDto {
  @AutoMap()
  @ApiProperty()
  tagId: string;

  @AutoMap()
  @ApiProperty()
  username: string;

  @AutoMap()
  @ApiProperty()
  s3Profile: string;

  @AutoMap()
  @ApiProperty()
  isLoved = false;

  @AutoMap()
  @ApiProperty()
  isDisLoved = false;
}

export class HomePagePostFilterDto extends PageOptionsDto {
  @ApiProperty({ required: false, description: 'content' })
  content: string;

  @ApiProperty({ required: false, enum: TagEnum, default: 'PET' })
  filterByType: TagEnum = TagEnum.PET;
}

export class HomePageUserPostFilterDto extends PageOptionsDto {}

export class ViewPostForPublicDto extends ViewPostDto {
  @AutoMap()
  @ApiProperty()
  createdAt: Date;
}
