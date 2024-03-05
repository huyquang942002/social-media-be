import { Module } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/entities/comment';
import { Post } from 'src/entities/post';
import { Users } from 'src/entities/Users';
import { NotificationService } from 'src/services/notification.service';
import { UserInteractService } from 'src/services/user-interact.service';
import { Notifications } from 'src/entities/Notifications';
import { UserDevices } from 'src/entities/UserDevices';
import { FirebaseNotificationService } from 'src/firebase-notifcation/firebase-notification.service';
import { UserInteracts } from 'src/entities/UserInteracts';
import { Interacts } from 'src/entities/interacts';
import { SendMailService } from 'src/mailer/send-mail.service';
import { Conversations } from 'src/entities/conversation';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comments,
      Post,
      Users,
      Notifications,
      UserDevices,
      UserInteracts,
      Interacts,
      Conversations,
    ]),
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    NotificationService,
    UserInteractService,
    FirebaseNotificationService,
    SendMailService,
  ],
})
export class CommentModule {}
