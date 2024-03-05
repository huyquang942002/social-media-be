import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/cms-users/dto/users.dto';

export class NotificationDto {
  @ApiProperty()
  @AutoMap()
  id: string;

  @ApiProperty()
  @AutoMap()
  type: string;

  @ApiProperty()
  @AutoMap()
  data: string | null;

  @ApiProperty()
  @AutoMap()
  isReaded: boolean | null;

  @ApiProperty()
  @AutoMap()
  createdAt: Date;

  @ApiProperty()
  @AutoMap()
  createdBy: string | null;

  @ApiProperty()
  @AutoMap()
  updatedAt: Date | null;

  @ApiProperty()
  @AutoMap()
  updatedBy: string | null;

  @ApiProperty()
  @AutoMap()
  deletedAt: Date | null;

  @ApiProperty()
  @AutoMap()
  deletedBy: string | null;

  @ApiProperty()
  @AutoMap()
  userId: string | null;

  @ApiProperty()
  @AutoMap()
  actionUserId: string | null;

  @ApiProperty()
  @AutoMap()
  actionUser: UserDto | null;

  @AutoMap()
  @ApiProperty()
  additionalData: string | null;

  // @AutoMap()
  // groupId: string;
}

export class ViewNotificationDto extends NotificationDto {}
