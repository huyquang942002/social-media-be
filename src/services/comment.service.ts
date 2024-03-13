import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import {
  CommentChildFilterDto,
  CommentFilterDto,
  CreateCommentDto,
  DeleteCommentDto,
  UpdateCommentDto,
  UpdateCommentDtoCms,
} from 'src/comment/dto/comment.dto';
import { Post } from 'src/entities/post';
import { Comments } from 'src/entities/comment';
import * as moment from 'moment';
import { getS3Presigned, getSkip } from 'src/shared/utils';
import { PageMetaDto } from 'src/shared/pagination/page-meta.dto';
import { PaginationDto } from 'src/shared/pagination/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { COMMENT_USER_ID } from 'src/constant/upload.constant';
import {
  CreateNotificationDto,
  TypeNotification,
} from 'src/notification/dto/create-notification.dto';
import { Users } from 'src/entities/Users';
import { NotificationService } from 'src/services/notification.service';
import { UserInteractService } from 'src/services/user-interact.service';
import { InteractType } from 'src/shared/interacts.enum';
import { findAllPostFilter } from 'src/posts/dto/post.dto';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comments)
    private commentRespository: Repository<Comments>,
    @InjectRepository(Users)
    private userRespository: Repository<Users>,
    private configService: ConfigService,
    private userInteractService: UserInteractService,
    private notificationService: NotificationService,
  ) { }

  public async presignedUrlCommentMedia(fileName: string, userId: string) {
    return getS3Presigned(
      fileName,
      `${COMMENT_USER_ID}_${userId}`,
      this.configService,
    );
  }

  async increateTotalCommentByPost(post: Post, increase: number) {
    if (!post) {
      throw new UnauthorizedException('Post not found');
    }
    // increase total comment post
    const { totalComment } = post;
    await this.postRepository.save({
      ...post,
      totalComment: (+totalComment + increase).toString(),
    });
  }

  async increateTotalCommentByComment(
    commentParent: Comments,
    increase: number,
  ) {
    if (!commentParent) {
      throw new HttpException(`Comment not found`, HttpStatus.BAD_REQUEST);
    }
    const { totalComment: totalCommentParent } = commentParent;

    return await this.commentRespository.save({
      ...commentParent,
      totalComment: (+totalCommentParent + increase).toString(),
    });
  }

  async validateComment(commentId: string) {
    const commentParent = await this.commentRespository.findOne({
      where: {
        id: commentId,
        deletedAt: IsNull(),
      },
    });
    if (!commentParent) {
      throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
    }
    return commentParent;
  }

  async validateUser(userId: string) {
    const user = await this.userRespository.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async create(dto: CreateCommentDto, createdBy: string) {
    const { postId, commentId, commentImageName } = dto;

    const post = await this.postRepository.findOne({
      where: { id: postId, deletedAt: IsNull() },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.validateUser(createdBy);

    const s3Link = commentImageName
      ? await this.presignedUrlCommentMedia(commentImageName, createdBy)
      : '';

    await this.increateTotalCommentByPost(post, +1);

    const comment = await this.commentRespository.save(
      await this.commentRespository.create({
        ...dto,
        createdBy,
      }),
    );

    if (commentId) {
      // commentParent.id = 10
      const commentParent = await this.validateComment(commentId);
      if (commentParent.commentId) {
        comment.commentId = commentParent.commentId;
        await this.commentRespository.save(comment);
      }

      const childComment = await this.increateTotalCommentByComment(
        commentParent,
        1,
      );

      if (commentParent.createdBy != comment.createdBy) {
        try {
          const notification = new CreateNotificationDto({
            type: TypeNotification.ReplyComment,
            data: `${user.username} vừa phản hồi bình luận của bạn`,
            createdBy,
            actionUserId: createdBy,
            userId: comment.createdBy,
            additionalData: { post, user, comment },
          });
          const updatedNotification =
            await this.notificationService.createAndReturn(notification);
          this.notificationService.prepareSendNotiForPerson(
            childComment.createdBy,
            updatedNotification,
            'Thông Báo',
            `${user.username} vừa phản hồi bình luận của bạn`,
          );
        } catch (ex) { }
      }
    } else {
      try {
        const notification = new CreateNotificationDto({
          type: TypeNotification.CommentInPost,
          data: `${user.username} vừa bình luận bài viết của bạn`,
          createdBy,
          actionUserId: createdBy,
          userId: post.createdBy,
          additionalData: { post, user, comment },
        });
        const updatedNotification =
          await this.notificationService.createAndReturn(notification);
        this.notificationService.prepareSendNotiForPerson(
          post.createdBy,
          updatedNotification,
          'Thông Báo',
          `${user.username} vừa bình luận bài viết của bạn`,
        );
      } catch (ex) { }
    }

    //update comment interacts
    try {
      await this.userInteractService.commentThread({
        entityId: postId,
        userId: user.id,
        isReply: !!commentId,
      });
    } catch (ex) { }

    return {
      ...comment,
      s3Link,
    };
  }

  async update(
    id: string,
    dto: UpdateCommentDto,
    updatedBy: string,
    isAdmin: boolean,
  ) {
    const { isRemoveImage, commentImageName } = dto;

    const comment = await this.commentRespository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!comment) {
      throw new NotFoundException('This comment is not exist!');
    }

    if (isRemoveImage?.toString() === 'true') {
      comment.commentImageName = '';
    }

    const s3Link = commentImageName
      ? await this.presignedUrlCommentMedia(commentImageName, updatedBy)
      : '';

    comment.commentImageName = commentImageName ?? comment?.commentImageName;

    if (!isAdmin) {
      if (comment.createdBy !== updatedBy) {
        throw new UnauthorizedException('Not authorized');
      }
    }

    const updateComment = await this.commentRespository.save({
      ...comment,
      ...dto,
      updatedAt: moment().format(),
      updatedBy,
    });
    console.log('s3Link', s3Link);
    return {
      updateComment,
      s3Link,
    };
  }

  async getCommentByParentComment(
    input: CommentChildFilterDto,
    userId: string,
  ) {
    const { page, take, commentId } = input;

    const [list, count] = await this.commentRespository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.createdUser', 'u', 'u.deletedAt is null')
      .where('c.commentId = :commentId', {
        commentId,
      })
      .orderBy('c.id', 'DESC')
      .take(take)
      .skip(getSkip({ page, take }))
      .getManyAndCount();

    //handle isLiked and isDisliked
    const actionIds = await this.userInteractService.getInteractIdsByActions([
      InteractType.LOVE,
      InteractType.DISLOVE,
    ]);

    const comments =
      await this.userInteractService.handleIsLikeAndDislikeForComments(
        list,
        actionIds,
        userId,
      );

    //return
    return new PaginationDto(comments, <PageMetaDto>{
      page,
      take,
      totalCount: count,
    });
  }

  async getAllCommentByPost(
    postId: string,
    input: findAllPostFilter,
    userId: string,
  ) {
    const { page = 1, take = 10 } = input;
    const skip = (page - 1) * take;

    const [comments, count] = await this.commentRespository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.comments', 'childComments')
      .leftJoinAndSelect('comment.createdUser', 'createdUser')
      .where('comment.postId = :postId AND comment.deletedAt IS NULL', { postId })
      .orderBy('comment.id', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    //handle isLiked and isDisliked
    const actionIds = await this.userInteractService.getInteractIdsByActions([
      InteractType.LOVE,
      InteractType.DISLOVE,
    ]);

    const listCommentParent =
      await this.userInteractService.handleIsLikeAndDislikeForComments(
        comments,
        actionIds,
        userId,
      );

    return new PaginationDto(listCommentParent, <PageMetaDto>{
      page,
      take,
      totalCount: count,
    });
  }

  // async findOne(id: string) {
  //   return await this.commentRespository.findOne({
  //     where: {
  //       id,
  //       deletedAt: IsNull(),
  //     },
  //     relations: ['post', 'createdUser', 'updatedUser'],
  //   });
  // }

  // CMS CMS CMS CMS CMS CMS CMS CMS CMS CMS CMS CMS
  async findAll(input: CommentFilterDto) {
    const { freeText, postId, userId, page, take } = input;

    const [comments, count] = await this.commentRespository
      .createQueryBuilder('c')
      .where(
        `c.deletedAt is null ${freeText
          ? ' and LOWER(c.content) like :freeText and c.createdBy = :userId and c.postId = :postId'
          : ''
        }
      `,
        {
          ...(freeText ? { freeText: `%${freeText.toLowerCase()}%` } : {}),
          ...(userId ? { userId } : {}),
          ...(postId ? { postId } : {}),
        },
      )
      .orderBy('c.id', 'DESC')
      .take(take)
      .skip(getSkip({ page, take }))
      .getManyAndCount();

    return new PaginationDto(comments, <PageMetaDto>{
      page,
      take,
      totalCount: count,
    });
  }

  async deleteByUser(id: string, deletedBy: string) {
    try {
      const comment = await this.commentRespository.findOne({
        where: {
          id,
          deletedAt: IsNull(),
        },
      });

      if (comment?.createdBy !== deletedBy) {
        throw new UnauthorizedException('Not authorized');
      }

      const { commentId, postId } = comment;
      if (commentId) {
        const parentComment = await this.commentRespository.findOne({
          where: {
            id: commentId,
            deletedAt: IsNull(),
          },
        });
        await this.increateTotalCommentByComment(parentComment, -1);
      }
      if (postId) {
        const post = await this.postRepository.findOne({
          where: {
            id: postId,
            deletedAt: IsNull(),
          },
        });
        await this.increateTotalCommentByPost(post, -1);
      }

      return await this.commentRespository.update(
        {
          id,
          deletedAt: IsNull(),
        },
        {
          deletedBy,
          deletedAt: moment().format(),
        },
      );
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  // // cms  cms cms cms
  // async deleteByAdmin(dto: DeleteCommentDto, deletedBy: string) {
  //   try {
  //     const { ids } = dto;
  //     if (ids.length > 0) {
  //       return await this.commentRespository.update(
  //         {
  //           id: In(ids),
  //           deletedAt: IsNull(),
  //         },
  //         {
  //           deletedBy,
  //           deletedAt: moment().format(),
  //         },
  //       );
  //     }
  //   } catch (error) {
  //     throw new UnauthorizedException(error);
  //   }
  // }
}
