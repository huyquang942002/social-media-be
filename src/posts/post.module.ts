import { Module } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post';
import { PostGalleries } from 'src/entities/PostGalleries';
import { UserInteractService } from 'src/services/user-interact.service';
import { UserInteracts } from 'src/entities/UserInteracts';
import { Interacts } from 'src/entities/interacts';
import { Users } from 'src/entities/Users';
import { Comments } from 'src/entities/comment';
import { Notifications } from 'src/entities/Notifications';
import { NotificationService } from 'src/services/notification.service';
import { SendMailService } from 'src/mailer/send-mail.service';
import { UserDevices } from 'src/entities/UserDevices';
import { FirebaseNotificationService } from 'src/firebase-notifcation/firebase-notification.service';
import { FriendService } from 'src/services/friend.service';
import { Friend } from 'src/entities/friend';
import { FriendRequest } from 'src/entities/friendRequest';
import { Conversations } from 'src/entities/conversation';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostGalleries,
      UserInteracts,
      Interacts,
      Users,
      Comments,
      Notifications,
      UserDevices,
      Friend,
      FriendRequest,
      Conversations,
    ]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    UserInteractService,
    NotificationService,
    SendMailService,
    FirebaseNotificationService,
    FriendService,
  ],
})
export class PostModule {}
