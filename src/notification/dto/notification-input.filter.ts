import { PageOptionsDto } from '../../shared/pagination/page-option.dto';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationInputFilter extends PageOptionsDto {
  @ApiProperty({ required: false, description: 'True = is filter unread' })
  isFilterUnread: boolean;
}

export class NotificationGroupFilter extends PageOptionsDto {
  @ApiProperty({ required: false, description: 'True = is filter unread' })
  isFilterUnread: boolean;

  @ApiProperty({ required: false, description: 'GroupId' })
  groupId: string | null;

  @ApiProperty({ required: false, description: 'Group uniqueName' })
  groupUniqueName: string;
}

export class ReadAllGroupNotifications extends PageOptionsDto {
  @ApiProperty({ required: false, description: 'GroupId' })
  groupId: string | null;
}
