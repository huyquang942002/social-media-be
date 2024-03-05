import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostgresDbConfiguration } from './configuration/postgres-db.configuration';
import { MailerConfiguration } from './configuration/mailer.configuration';
import { UsersModule } from './users/users.module';
import { PostModule } from './posts/post.module';
// import { GroupModule } from './group/group.module';
import { FriendModule } from './friend/friend.module';
// import { CmsUsersModule } from './cms-users/cms-users.module';
import { PublicApiModule } from './public-api/public-api.module';
import { PetModule } from './pet/pet.module';
import { FcmModule } from 'nestjs-fcm';
import * as path from 'path';
import { UserInteractModule } from './user-interact/user-interact.module';
import { ConversationModule } from './conversation/conversation.module';
import { CommentModule } from './comment/comment.module';
import { NotificationModule } from './notification/notification.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FcmModule.forRoot({
      firebaseSpecsPath: path.join(
        __dirname,
        './social-media-bcbb8-firebase-adminsdk-j8z7p-a9c1f67733.json',
      ),
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresDbConfiguration,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    MailerModule.forRootAsync({
      useClass: MailerConfiguration,
      imports: [ConfigModule],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    PostModule,
    // GroupModule,
    FriendModule,
    // CmsUsersModule,
    PublicApiModule,
    PetModule,
    UserInteractModule,
    ConversationModule,
    CommentModule,
    NotificationModule,
    UploadModule,
  ],
  providers: [AppService, PostgresDbConfiguration],
})
export class AppModule {}
