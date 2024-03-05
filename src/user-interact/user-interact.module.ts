import { UserInteractController } from './user-interact.controller';
import { UserInteractService } from '../services/user-interact.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from 'src/entities/Notifications';
import { UserDevices } from 'src/entities/UserDevices';
import { UserInteracts } from 'src/entities/UserInteracts';
import { Users } from 'src/entities/Users';
import { FirebaseNotificationService } from 'src/firebase-notifcation/firebase-notification.service';
import { NotificationService } from 'src/services/notification.service';
import { Interacts } from 'src/entities/interacts';
import { Post } from 'src/entities/post';
import { PostGalleries } from 'src/entities/PostGalleries';
import { Comments } from 'src/entities/comment';
import { Conversations } from 'src/entities/conversation';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserInteracts,
      Interacts,
      Users,
      Post,
      PostGalleries,
      Comments,
      Notifications,
      UserDevices,
      Conversations,
    ]),
  ],
  controllers: [UserInteractController],
  providers: [
    UserInteractService,
    NotificationService,
    FirebaseNotificationService,
  ],
})
export class UserInteractModule {}
