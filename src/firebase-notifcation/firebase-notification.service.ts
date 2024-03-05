import { Injectable } from '@nestjs/common';
import { FcmService } from 'nestjs-fcm';

@Injectable()
export class FirebaseNotificationService {
  constructor(private readonly fcmService: FcmService) {}

  async sendNotificationToDevice(
    body: any,
    deviceIds: string[],
    title: string,
    message: string,
  ) {
    try {
      const payload = {
        notification: {
          title,
          body: message,
        },

        data: {
          // url: '<url of media image>',
          additional: JSON.stringify(body),
          title,
          body: message,
        },
      };
      const sendNoti = await this.fcmService.sendNotification(
        deviceIds,
        // [
        //   'ehnV3G47oE85sMFTAmYJQf:APA91bFrcUnsFR-txe1wpHJQyzsYjk3RRiCZUWg6oa7Ydb0NOOY1JXRa6kA6TxtMgGz7Q_bEWauEZnZ9cS8UoAPegGXELuUUAnNOiQUnaBLbbp9nTQbUfJN4_R9Y5FujoSYRQ3WoP6TW',
        // ],
        payload,
        false,
      );
      // console.log('sendNoti', sendNoti);
    } catch (ex) {}
  }
}
