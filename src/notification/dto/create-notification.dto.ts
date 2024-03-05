import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { NotificationDto } from './notification.dto';

export enum TypeNotification {
  'LoginAlerts' = 'LoginAlerts', //Loggin Alerts
  'LovedPost' = 'LovedPost', // User Love your thread
  'LoveComment' = 'LoveComment', //User Love your comment
  'LoveConversation' = 'LoveConversation', //User Love your comment
  'CommentInPost' = 'CommentInPost', //User comment in your thread
  'ReplyComment' = 'ReplyComment', //User reply your comment
  'MetionInComment' = 'MetionInComment', // User mentioned u in comment
  'ShareThread' = 'ShareThread', //User share ur thread
  'NewThread' = 'NewThread', //Your group has new Thread (the other user post thread)
  'UpdateRule' = 'UpdateRule', //Group updated rule
  'AdminSendMessage' = 'AdminSendMessage', //Group send message to u
  'Restricted' = 'Restricted', //U was restricted in group
  'UserJoinGroup' = 'UserJoinGroup', //new user joined your group
  'UserPostedThread' = 'UserPostedThread', //User posted new Thread in ur group
  'UserSendMessage' = 'UserSendMessage', //User has sent message to ur group
  'Report' = 'Report', // Notice admin has report
  'FeaturedArticleInWeek' = 'FeaturedArticleInWeek', //Remind User
  'FeaturedArticleInMonth' = 'FeaturedArticleInMonth', //Remind User
  'RemindUser' = 'RemindUser', //Remind user not loggin a long time
}

export class CreateNotificationDto extends OmitType(NotificationDto, [
  'id',
  'isReaded',
  'createdAt',
  'updatedAt',
  'updatedBy',
  'deletedAt',
  'deletedBy',
  'actionUser',
] as const) {
  constructor({ type, data, createdBy, actionUserId, userId, additionalData }) {
    super();
    this.type = type;
    this.data = data;
    this.createdBy = createdBy;
    this.actionUserId = actionUserId;
    this.userId = userId;
    this.additionalData = additionalData;
  }
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
