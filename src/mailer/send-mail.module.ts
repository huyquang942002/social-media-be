import { SendMailService } from './send-mail.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [SendMailService],
})
export class SendMailModule {}
