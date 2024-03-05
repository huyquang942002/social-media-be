import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDevices } from 'src/entities/UserDevices';
import { FirebaseNotificationService } from 'src/firebase-notifcation/firebase-notification.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from '../services/notification.service';
import { Notifications } from 'src/entities/Notifications';

@Module({
  imports: [TypeOrmModule.forFeature([Notifications, UserDevices])],
  controllers: [NotificationController],
  providers: [NotificationService, FirebaseNotificationService],
})
export class NotificationModule {}
