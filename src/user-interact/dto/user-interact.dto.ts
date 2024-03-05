import { AutoMap } from '@automapper/classes';
import { OmitType, PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IFullAuditDto } from 'src/shared/full-audit.dto';
import { IObjectKeyDto } from 'src/shared/object-key.dto';
import { PageOptionsDto } from 'src/shared/pagination/page-option.dto';

export class UserInteractDto implements IFullAuditDto, IObjectKeyDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  entityId: string | null;

  @AutoMap()
  @ApiProperty()
  entityName: string | null;

  @AutoMap()
  @ApiProperty()
  interactId: string | null;

  @AutoMap()
  @ApiProperty()
  userId: string | null;

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
}

export class CreateUserInteractDto {
  userId: string;

  @ApiProperty()
  entityId: string | null;
}

export class UpdateUserInteractDto extends PartialType(CreateUserInteractDto) {}

export class UserInteractFilterDto extends OmitType(PageOptionsDto, [
  'order',
] as const) {}

export class ViewUserInteractDto extends UserInteractDto {}
