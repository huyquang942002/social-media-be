import { Module } from '@nestjs/common';
import { ConversationService } from '../services/conversation.service';
import { ConversationGateway } from './conversation.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversations } from 'src/entities/conversation';
import { Users } from 'src/entities/Users';
import { Post } from 'src/entities/post';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'src/upload/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conversations, Users, Post])],
  providers: [
    ConversationGateway,
    ConversationService,
    JwtService,
    UploadService,
  ],
  exports: [ConversationService],
})
export class ConversationModule {}
