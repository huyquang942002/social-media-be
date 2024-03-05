import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Users } from 'src/entities/Users';
import { UsersService } from 'src/services/users.service';
import { UsersController } from './users.controller';
import { SendMailService } from 'src/mailer/send-mail.service';
import { UserCodes } from 'src/entities/UserCodes';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserCodes]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, SendMailService],
})
export class UsersModule {}
