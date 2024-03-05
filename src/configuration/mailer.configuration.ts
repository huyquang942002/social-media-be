import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Injectable()
export class MailerConfiguration implements MailerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMailerOptions(): Promise<MailerOptions> | MailerOptions {
    return {
      transport: {
        host: this.configService.get<string>('SMTP_HOST'),
        secure: true,
        port: this.configService.get<string>('SMTP_PORT'),
        auth: {
          user: this.configService.get<string>('SMTP_EMAIL'),
          pass: this.configService.get<string>('SMTP_KEY'),
        },
      },
      defaults: {
        from: this.configService.get<string>('SMTP_DEFAULT'),
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // Sử dụng HandlebarsAdapter để đọc template
        options: {
          strict: true,
        },
      },
    };
  }
}
