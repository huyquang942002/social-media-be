import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversations } from 'src/entities/conversation';
import { IsNull, Repository } from 'typeorm';
import {
  CreateConversationDto,
  DeleteConversationDto,
  DetailConversationFilter,
  GhimMessageDto,
  ListConversationFilter,
} from '../conversation/dto/conversation.dto';
import { Users } from 'src/entities/Users';
import { ConfigService } from '@nestjs/config';
import { getS3Presigned, getSkip } from 'src/shared/utils';
import { CONVERSATION_USER_ID } from 'src/constant/upload.constant';
import * as moment from 'moment';
import { TypeGhim } from 'src/shared/conversation.enum';
import { PageMetaDto } from 'src/shared/pagination/page-meta.dto';
import { PaginationDto } from 'src/shared/pagination/pagination.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversations)
    private conversationRepository: Repository<Conversations>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private uploadService: UploadService,
  ) {}

  public async presignedUrlConversationMedia(
    fileNames: string[],
    userId: string,
  ) {
    return fileNames.map((name) => {
      return getS3Presigned(
        name,
        `${CONVERSATION_USER_ID}_${userId}`,
        this.configService,
      );
    });
  }

  async createChat(dto: CreateConversationDto, accessToken: string) {
    const senderId = await this.getToken(accessToken);
    const { receiverId, file, conversationId } = dto;

    const newS3Links = file ? await this.uploadService.uploadFile(file) : '';

    const oldConversation = await this.conversationRepository.findOne({
      where: [
        { senderId, receiverId, deletedAt: IsNull() },
        { senderId: receiverId, receiverId: senderId, deletedAt: IsNull() },
      ],
      order: { id: 'DESC' },
    });

    if (oldConversation) {
      await this.conversationRepository.update(
        {
          id: oldConversation?.id,
          deletedAt: IsNull(),
        },
        {
          isMark: false,
          updatedAt: moment().format(),
          updatedBy: senderId,
        },
      );
    }

    const newConversation = await this.conversationRepository.save(
      await this.conversationRepository.create({
        ...dto,
        senderId,
        isMark: true,
        createdBy: senderId,
        conversationsGalleries: newS3Links,
      }),
    );

    let conversationParent;
    if (conversationId) {
      conversationParent = await this.conversationRepository.findOne({
        where: {
          id: conversationId,
          deletedAt: IsNull(),
        },
        relations: ['senderUser'],
      });
      if (!conversationParent) {
        throw new HttpException('Message not found', HttpStatus.BAD_REQUEST);
      }
    }

    return {
      ...newConversation,
      contentReply: conversationParent?.content,
      replyTo: conversationParent?.senderUser?.username,
      newS3Links,
    };
  }

  async deleteChat(dto: DeleteConversationDto, accessToken: string) {
    const { id } = dto;
    const deletedBy = await this.getToken(accessToken);
    const conversation = await this.conversationRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
    if (!conversation) {
      throw new HttpException('message not found', HttpStatus.BAD_REQUEST);
    }
    if (conversation?.senderId != deletedBy) {
      throw new HttpException('Not authorized', HttpStatus.BAD_REQUEST);
    }

    await this.conversationRepository.save({
      ...conversation,
      deletedBy,
      deletedAt: moment().format(),
      isMark: false,
    });

    return { id: conversation?.id };
  }

  async ghimMessage(dto: GhimMessageDto, accessToken: string) {
    const updatedBy = await this.getToken(accessToken);
    const { id, typeGhim, isGhim } = dto;
    const conversation = await this.conversationRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
    if (!conversation) {
      throw new HttpException('message not found', HttpStatus.BAD_REQUEST);
    }

    if (typeGhim !== TypeGhim.IMAGE && typeGhim !== TypeGhim.TEXT) {
      throw new HttpException('Type Ghim is not valid', HttpStatus.BAD_REQUEST);
    }
    switch (typeGhim) {
      case TypeGhim.TEXT:
        await this.conversationRepository.save({
          ...conversation,
          isGhim,
          updatedAt: moment().format(),
          updatedBy,
        });
        break;
      case TypeGhim.IMAGE:
        break;
    }
  }

  // async listGhimMessasge(receiverId: string, accessToken: string) {
  //   const senderId = await this.getToken(accessToken);
  //   const conversations = await this.conversationRepository.find({
  //     where: {
  //       senderId,
  //       receiverId,
  //       deletedAt: IsNull(),
  //     },
  //   });

  //   const result = await Promise.all(
  //     conversations?.map(async (conversation) => {
  //       if (conversation?.isGhim?.toString() === 'true') {
  //         const conversationGalleries =
  //           await this.conversationGalleriesRepository.findOne({
  //             where: {
  //               conversationId: conversation?.id,
  //               deletedAt: IsNull(),
  //             },
  //           });
  //         return {
  //           conversation,
  //           conversationGalleries,
  //         };
  //       }
  //     }),
  //   );
  //   return result;
  // }

  async detailConversation(dto: DetailConversationFilter, accessToken: string) {
    const senderId = await this.getToken(accessToken);
    const { receiverId, page, take } = dto;
    const [conversations, count] = await this.conversationRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.senderUser', 'sder', 'sder.deletedAt is null')
      .leftJoinAndSelect('c.receiverUser', 'rver', 'rver.deletedAt is null')
      .where(
        '((c.senderId = :senderId AND c.receiverId = :receiverId) OR (c.senderId = :receiverId AND c.receiverId = :senderId))  AND c.deletedBy is null AND c.isHide = :isHide',
        {
          senderId,
          receiverId,
          isHide: false,
        },
      )
      .orderBy('c.id', 'DESC')
      .take(take)
      .skip(getSkip({ page, take }))
      .getManyAndCount();

    const conversationHaveParent = await Promise.all(
      // Update isRead = true
      conversations.map(async (item) => {
        await this.conversationRepository.update(
          {
            id: item?.id,
            deletedAt: IsNull(),
          },
          {
            isRead: true,
          },
        );

        // Get parent message
        let parentMessage;
        if (item?.conversationId) {
          parentMessage = await this.conversationRepository.findOne({
            where: {
              id: item?.conversationId,
              deletedAt: IsNull(),
            },
            relations: ['senderUser'],
          });
        }
        return {
          ...item,
          contentReply: parentMessage?.content,
          replyTo: parentMessage?.senderUser?.username,
        };
      }),
    );
    return new PaginationDto(conversationHaveParent, <PageMetaDto>{
      page,
      take,
      totalCount: count,
    });
  }

  async listConversation(dto: ListConversationFilter, accessToken: string) {
    const senderId = await this.getToken(accessToken);
    const { page, take } = dto;
    const [conversations, count] = await this.conversationRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.senderUser', 'u', 'u.deletedAt is null')
      .leftJoinAndSelect('c.receiverUser', 'us', 'us.deletedAt is null')
      .where(
        '(c.senderId = :senderId OR c.receiverId = :senderId)  AND c.isHide = false',
        {
          senderId,
        },
      )
      .andWhere('c.isMark = true')
      .orderBy('c.id', 'DESC')
      .take(take)
      .skip(getSkip({ page, take }))
      .getManyAndCount();

    return new PaginationDto(conversations, <PageMetaDto>{
      page,
      take,
      totalCount: count,
    });
  }

  async getToken(accessToken: string) {
    const jwtToken = accessToken.split(' ')[1];
    const payload = await this.jwtService.verifyAsync(jwtToken, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
    if (!payload) {
      throw new BadGatewayException('Token not found');
    }
    const { id: userId } = payload.user;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    return userId;
  }
}
