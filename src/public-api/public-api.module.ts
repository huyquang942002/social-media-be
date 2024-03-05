import { Module } from '@nestjs/common';
import { PublicApiService } from '../services/public-api.service';
import { PublicApiController } from './public-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Post } from 'src/entities/post';
import { PostGalleries } from 'src/entities/PostGalleries';
// import { Groups } from 'src/entities/group';
import { PostService } from 'src/services/post.service';
import { FriendService } from 'src/services/friend.service';
import { Friend } from 'src/entities/friend';
import { FriendRequest } from 'src/entities/friendRequest';
import { UserInteractService } from 'src/services/user-interact.service';
import { UserInteracts } from 'src/entities/UserInteracts';
import { Interacts } from 'src/entities/interacts';
import { Comments } from 'src/entities/comment';
import { NotificationService } from 'src/services/notification.service';
import { SendMailService } from 'src/mailer/send-mail.service';
import { Notifications } from 'src/entities/Notifications';
import { UserDevices } from 'src/entities/UserDevices';
import { FirebaseNotificationService } from 'src/firebase-notifcation/firebase-notification.service';
import { Conversations } from 'src/entities/conversation';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      Users,
      PostGalleries,
      // Groups,
      Friend,
      Users,
      FriendRequest,
      UserInteracts,
      Interacts,
      Comments,
      Notifications,
      UserDevices,
      Conversations,
    ]),
  ],
  controllers: [PublicApiController],
  providers: [
    PublicApiService,
    PostService,
    FriendService,
    UserInteractService,
    NotificationService,
    SendMailService,
    FirebaseNotificationService,
  ],
})
export class PublicApiModule {}
