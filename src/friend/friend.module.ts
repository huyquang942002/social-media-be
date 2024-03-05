import { Module } from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/entities/friend';
import { FriendRequest } from 'src/entities/friendRequest';
import { Users } from 'src/entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Friend, FriendRequest])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
