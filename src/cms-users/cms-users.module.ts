import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { UsersService } from 'src/services/users.service';
import { CmsUsersController } from './cms-users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SendMailService } from 'src/mailer/send-mail.service';
import { UserCodes } from 'src/entities/UserCodes';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserCodes]), AuthModule],
  controllers: [CmsUsersController],
  providers: [UsersService, SendMailService],
})
export class CmsUsersModule {}
