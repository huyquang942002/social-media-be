/*
https://docs.nestjs.com/providers#services
*/

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(emails, title, content) {
    await this.mailerService.sendMail({
      to: emails, // list of receivers
      from: 'huywocker92016@gmail.com', // sender address
      subject: `${title}.`, // Subject line
      text: `${title}.`, // plaintext body
      html: content, // HTML body content
    });
  }
}
