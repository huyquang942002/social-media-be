import { Users } from 'src/entities/Users';
import { getSkip } from 'src/shared/utils';
import { Any, In, IsNull, Repository } from 'typeorm';
/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { mapper } from 'src/configuration/mapper';
import { UserInteracts } from 'src/entities/UserInteracts';
import {
  CreateNotificationDto,
  TypeNotification,
} from 'src/notification/dto/create-notification.dto';
import { NotificationService } from 'src/services/notification.service';
import { Interacts } from 'src/entities/interacts';
import { Post } from 'src/entities/post';
import { Comments } from 'src/entities/comment';
import { EntityInteractType, InteractType } from 'src/shared/interacts.enum';
import { ViewPostDto } from 'src/posts/dto/post.dto';
import { ViewCommentDto } from 'src/comment/dto/comment.dto';
import { Conversations } from 'src/entities/conversation';

@Injectable()
export class UserInteractService {
  constructor(
    @InjectRepository(UserInteracts)
    private userInteractRepository: Repository<UserInteracts>,
    @InjectRepository(Interacts)
    private interactRepository: Repository<Interacts>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Comments)
    private commentRepository: Repository<Comments>,
    @InjectRepository(Conversations)
    private conversationRepository: Repository<Conversations>,
    private notificationService: NotificationService,
  ) { }

  /*core functions*/
  async getInteractIdByAction(action: string): Promise<string> {
    const currentInteract = await this.interactRepository.findOne({
      where: { type: action, deletedAt: IsNull() },
    });
    if (!currentInteract) {
      throw new HttpException(
        'Interact does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return currentInteract?.id;
  }

  async getInteractIdsByActions(actions: string[]) {
    const currentInteracts = await this.interactRepository.find({
      where: { type: Any(actions) },
    });

    const loveId = currentInteracts.find(
      (x) => x.type == InteractType.LOVE,
    )?.id;
    const disLoveId = currentInteracts.find(
      (x) => x.type == InteractType.DISLOVE,
    )?.id;

    return {
      LOVE: loveId,
      DISLOVE: disLoveId,
    };
  }

  async getUserInteraction({ interactId, userId, entityId }) {
    const userInteract = await this.userInteractRepository.findOne({
      where: {
        userId,
        interactId,
        entityId,
        entityName: EntityInteractType.POST,
        deletedAt: IsNull(),
      },
    });
    return userInteract;
  }

  async getUserInteractionComment({ interactId, userId, entityId }) {
    const userInteract = await this.userInteractRepository.findOne({
      where: {
        userId,
        interactId,
        entityId,
        entityName: EntityInteractType.COMMENT,
        deletedAt: IsNull(),
      },
    });
    return userInteract;
  }

  async getUserInteractionConversation({ interactId, userId, entityId }) {
    const userInteract = await this.userInteractRepository.findOne({
      where: {
        userId,
        interactId,
        entityId,
        entityName: EntityInteractType.CONVERSATION,
        deletedAt: IsNull(),
      },
    });
    return userInteract;
  }

  async createUserInteraction({ interactId, entityId, entityName, userId }) {
    const create = await this.userInteractRepository.create({
      interactId,
      entityId,
      entityName,
      userId,
      createdBy: userId,
    });
    await this.userInteractRepository.save(create);
  }

  async updateTotalViews({ thread, total }) {
    return await this.postRepository.save({
      ...thread,
      totalViews: (+total + 1).toString(),
    });
  }

  async updateLikeOrDislike({ thread, total, isLike, isIncrease }) {
    return await this.postRepository.save({
      ...thread,
      ...(isLike
        ? isIncrease
          ? { totalLove: (+total + 1).toString() }
          : { totalLove: +total - 1 < 0 ? 0 : (+total - 1).toString() }
        : isIncrease
          ? { totalDisLove: (+total + 1).toString() }
          : { totalDisLove: +total - 1 < 0 ? 0 : (+total - 1).toString() }),
    });
  }

  async updateLikeOrDislikeComment({ comment, total, isLike, isIncrease }) {
    return await this.commentRepository.save({
      ...comment,
      ...(isLike
        ? isIncrease
          ? { totalLove: (+total + 1).toString() }
          : { totalLove: +total - 1 < 0 ? 0 : (+total - 1).toString() }
        : isIncrease
          ? { totalDisLove: (+total + 1).toString() }
          : { totalDisLove: +total - 1 < 0 ? 0 : (+total - 1).toString() }),
    });
  }

  async updateLoveOrDisLoveConversation({
    conversation,
    total,
    isLike,
    isIncrease,
  }) {
    return await this.conversationRepository.save({
      ...conversation,
      ...(isLike
        ? isIncrease
          ? { totalLove: (+total + 1).toString() }
          : { totalLove: +total - 1 < 0 ? 0 : (+total - 1).toString() }
        : isIncrease
          ? { totalDisLove: (+total + 1).toString() }
          : { totalDisLove: +total - 1 < 0 ? 0 : (+total - 1).toString() }),
    });
  }

  async deleteCurrentUserInteraction({ item, userId }) {
    await this.userInteractRepository.save({
      ...item,
      deletedAt: moment().format(),
      deletedBy: userId,
    });
  }

  ///dynamic function

  async love({ entityId, userId }: { entityId: string; userId: string }) {
    const interactId = await this.getInteractIdByAction(InteractType.LOVE);

    //validation
    const thread = await this.postRepository.findOne({
      id: entityId,
      deletedAt: IsNull(),
    });
    if (!thread) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    const userInteract = await this.getUserInteraction({
      userId,
      entityId,
      interactId,
    });

    if (userInteract) {
      throw new HttpException('User loved already.', HttpStatus.BAD_REQUEST);
    }

    const userSend = await this.userRepository.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });

    if (!userSend) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }

    //create user interact
    await this.createUserInteraction({
      entityId,
      interactId,
      userId,
      entityName: EntityInteractType.POST,
    });

    try {
      const notification = new CreateNotificationDto({
        type: TypeNotification.LovedPost,
        data: `${userSend?.username} vừa thích bài viết của bạn`,
        createdBy: userId,
        actionUserId: userId,
        userId: thread.createdBy,
        additionalData: { thread, user: userSend },
      });
      const updatedNotification =
        await this.notificationService.createAndReturn(notification);
      this.notificationService.prepareSendNotiForPerson(
        thread.createdBy,
        updatedNotification,
        'Thông Báo',
        `${userSend?.username} vừa thích bài viết của bạn`,
      );
    } catch (ex) { }

    //save total Like
    const { totalLove, totalDisLove } = thread;
    const newThread = await this.updateLikeOrDislike({
      thread,
      total: totalLove,
      isLike: true,
      isIncrease: true,
    });

    //find does user has dislike in db?
    try {
      const interactId = await this.getInteractIdByAction(InteractType.DISLOVE);
      const userDislike = await this.getUserInteraction({
        interactId,
        userId,
        entityId,
      });
      //check if has record and remove it
      if (userDislike) {
        await this.deleteCurrentUserInteraction({
          item: userDislike,
          userId,
        });

        //count total Dislike at this time
        await this.updateLikeOrDislike({
          thread: newThread,
          total: totalDisLove,
          isLike: false,
          isIncrease: false,
        });
      }
    } catch (ex) { }
  }

  async dislove({ entityId, userId }: { entityId: string; userId: string }) {
    const interactId = await this.getInteractIdByAction(InteractType.DISLOVE);

    //validation
    const thread = await this.postRepository.findOne({
      id: entityId,
      deletedAt: IsNull(),
    });

    if (!thread) {
      throw new HttpException('Thread  does not exist', HttpStatus.BAD_REQUEST);
    }

    const userInteract = await this.getUserInteraction({
      userId,
      entityId,
      interactId,
    });

    if (userInteract) {
      throw new HttpException('User disliked already.', HttpStatus.BAD_REQUEST);
    }
    const { totalLove, totalDisLove } = thread;

    await this.createUserInteraction({
      entityId,
      interactId,
      userId,
      entityName: EntityInteractType.POST,
    });

    //save total Like
    const newThread = await this.updateLikeOrDislike({
      thread,
      total: totalDisLove,
      isLike: false,
      isIncrease: true,
    });

    //find does user has like in db?

    try {
      const likeActionId = await this.getInteractIdByAction(InteractType.LOVE);
      const userLike = await this.getUserInteraction({
        interactId: likeActionId,
        userId,
        entityId,
      });
      //check if has record and remove it
      if (userLike) {
        await this.deleteCurrentUserInteraction({ item: userLike, userId });

        //count total Dislike at this time
        await this.updateLikeOrDislike({
          thread: newThread,
          total: totalLove,
          isLike: true,
          isIncrease: false,
        });
      }
    } catch (ex) { }
  }

  async commentThread({
    entityId,
    userId,
    isReply,
  }: {
    entityId: string;
    userId: string;
    isReply: boolean;
  }) {
    const actionId = await this.getInteractIdByAction(
      isReply ? InteractType.COMMENT : InteractType.REPLYCOMMENT,
    );

    //validation
    const thread = await this.postRepository.findOne({
      where: {
        id: entityId,
        deletedAt: IsNull,
      },
    });

    await this.createUserInteraction({
      entityId,
      interactId: actionId,
      userId,
      entityName: EntityInteractType.POST,
    });
    return thread;
  }

  async removeLove({ entityId, userId }: { entityId: string; userId: string }) {
    const thread = await this.postRepository.findOne({ id: entityId });
    if (!thread) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }
    const { totalLove } = thread;
    const actionId = await this.getInteractIdByAction(InteractType.LOVE);

    const userLike = await this.getUserInteraction({
      interactId: actionId,
      userId,
      entityId,
    });

    if (!userLike) {
      throw new HttpException('Record Not Found', HttpStatus.BAD_REQUEST);
    }

    await this.deleteCurrentUserInteraction({ item: userLike, userId });
    //count total Dislike at this time
    await this.updateLikeOrDislike({
      thread,
      total: totalLove,
      isLike: true,
      isIncrease: false,
    });
  }

  async removeDislike({
    entityId,
    userId,
  }: {
    entityId: string;
    userId: string;
  }) {
    const thread = await this.postRepository.findOne({ id: entityId });
    if (!thread) {
      throw new HttpException('Thread  does not exist', HttpStatus.BAD_REQUEST);
    }

    const actionId = await this.getInteractIdByAction(InteractType.DISLOVE);
    const { totalDisLove } = thread;

    const userDisLike = await this.getUserInteraction({
      interactId: actionId,
      userId,
      entityId,
    });

    if (!userDisLike) {
      throw new HttpException('Record Not Found', HttpStatus.BAD_REQUEST);
    }

    await this.deleteCurrentUserInteraction({ item: userDisLike, userId });
    //count total Dislike at this time
    await this.updateLikeOrDislike({
      thread,
      total: totalDisLove,
      isLike: false,
      isIncrease: false,
    });
  }

  async handleIsLikeAndDislikeForThreads(
    threads: Post[],
    actionIds,
    userId: string,
  ) {
    //count isLike and DisLike
    const threadIds = threads?.map((thread) => thread?.id);

    const actionLikeId = actionIds[InteractType.LOVE];
    const actionDisLikeId = actionIds[InteractType.DISLOVE];

    const threadsWithLikeAndDisLike = await this.userInteractRepository.find({
      where: [
        {
          deletedAt: IsNull(),
          userId,
          entityId: Any(threadIds),
          entityName: EntityInteractType.POST,
          interactId: actionLikeId,
        },
        {
          deletedAt: IsNull(),
          userId,
          entityId: Any(threadIds),
          entityName: EntityInteractType.POST,
          interactId: actionDisLikeId,
        },
      ],
    });

    const viewThreads = mapper
      .mapArray(threads, Post, ViewPostDto)
      .map((thread) => {
        const isLovedThread = threadsWithLikeAndDisLike.find(
          (x) => x.entityId == thread.id && x.interactId == actionLikeId,
        );
        const isDisLovedThread = threadsWithLikeAndDisLike.find(
          (x) => x.entityId == thread.id && x.interactId == actionDisLikeId,
        );
        return {
          ...thread,
          isLoved: isLovedThread ? true : false,
          isDisLoved: isDisLovedThread ? true : false,
        };
      });

    return viewThreads;
  }

  async likeComment({
    entityId,
    userId,
  }: {
    entityId: string;
    userId: string;
  }) {
    const actionId = await this.getInteractIdByAction(InteractType.LOVE);

    //validation
    const comment = await this.commentRepository.findOne({ id: entityId });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
    }

    const userInteract = await this.getUserInteractionComment({
      userId,
      entityId,
      interactId: actionId,
    });

    if (userInteract) {
      throw new HttpException('User already loved.', HttpStatus.BAD_REQUEST);
    }

    //create user interact
    await this.createUserInteraction({
      entityId,
      interactId: actionId,
      userId,
      entityName: EntityInteractType.COMMENT,
    });
    const thread = await this.postRepository.findOne({
      where: { id: comment.postId, deletedAt: IsNull() },
    });

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });
    try {
      const notification = new CreateNotificationDto({
        type: TypeNotification.LoveComment,
        data: `${user.username} vừa thích bình luận của bạn `,
        createdBy: userId,
        actionUserId: userId,
        userId: comment.createdBy,
        additionalData: { thread, user },
      });
      const updatedNotification =
        await this.notificationService.createAndReturn(notification);
      this.notificationService.prepareSendNotiForPerson(
        comment.createdBy,
        updatedNotification,
        'Thông Báo',
        `${user.username} vừa thích bình luận của bạn `,
      );
    } catch (ex) { }

    //save total Like
    const { totalLove, totalDisLove } = comment;
    const newComment = await this.updateLikeOrDislikeComment({
      comment,
      total: totalLove,
      isLike: true,
      isIncrease: true,
    });

    //find does user has dislike in db?
    try {
      const dislikeActionId = await this.getInteractIdByAction(
        InteractType.DISLOVE,
      );
      const userDislike = await this.getUserInteractionComment({
        interactId: dislikeActionId,
        userId,
        entityId,
      });
      //check if has record and remove it
      if (userDislike) {
        await this.deleteCurrentUserInteraction({ item: userDislike, userId });

        //count total Dislike at this time
        await this.updateLikeOrDislikeComment({
          comment: newComment,
          total: totalDisLove,
          isLike: false,
          isIncrease: false,
        });
      }
    } catch (ex) { }
  }

  async dislikeComment({
    entityId,
    userId,
  }: {
    entityId: string;
    userId: string;
  }) {
    const actionId = await this.getInteractIdByAction(InteractType.DISLOVE);

    //validation
    const comment = await this.commentRepository.findOne({ id: entityId });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
    }

    const userInteract = await this.getUserInteractionComment({
      userId,
      entityId,
      interactId: actionId,
    });

    if (userInteract) {
      throw new HttpException('User already dis love', HttpStatus.BAD_REQUEST);
    }
    const { totalLove, totalDisLove } = comment;

    await this.createUserInteraction({
      entityId,
      interactId: actionId,
      userId,
      entityName: EntityInteractType.COMMENT,
    });

    //save total Like
    const newComment = await this.updateLikeOrDislikeComment({
      comment,
      total: totalDisLove,
      isLike: false,
      isIncrease: true,
    });

    //find does user has like in db?

    try {
      const likeActionId = await this.getInteractIdByAction(InteractType.LOVE);
      const userLike = await this.getUserInteractionComment({
        interactId: likeActionId,
        userId,
        entityId,
      });
      //check if has record and remove it
      if (userLike) {
        await this.deleteCurrentUserInteraction({ item: userLike, userId });

        //count total Dislike at this time
        await this.updateLikeOrDislikeComment({
          comment: newComment,
          total: totalLove,
          isLike: true,
          isIncrease: false,
        });
      }
    } catch (ex) { }
  }

  async removeLikeComment({
    entityId,
    userId,
  }: {
    entityId: string;
    userId: string;
  }) {
    const comment = await this.commentRepository.findOne({ id: entityId });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
    }
    const { totalLove } = comment;
    const actionId = await this.getInteractIdByAction(InteractType.LOVE);

    const userLike = await this.getUserInteractionComment({
      interactId: actionId,
      userId,
      entityId,
    });

    if (!userLike) {
      throw new HttpException('Record Not Found', HttpStatus.BAD_REQUEST);
    }

    await this.deleteCurrentUserInteraction({ item: userLike, userId });
    //count total Dislike at this time
    await this.updateLikeOrDislikeComment({
      comment,
      total: totalLove,
      isLike: true,
      isIncrease: false,
    });
  }

  async removeDislikeComment({
    entityId,
    userId,
  }: {
    entityId: string;
    userId: string;
  }) {
    const comment = await this.commentRepository.findOne({ id: entityId });
    if (!comment) {
      throw new HttpException('Thread not exist', HttpStatus.BAD_REQUEST);
    }

    const actionId = await this.getInteractIdByAction(InteractType.DISLOVE);
    const { totalDisLove } = comment;

    const userDisLike = await this.getUserInteractionComment({
      interactId: actionId,
      userId,
      entityId,
    });

    if (!userDisLike) {
      throw new HttpException('Record Not Found', HttpStatus.BAD_REQUEST);
    }

    await this.deleteCurrentUserInteraction({ item: userDisLike, userId });
    //count total Dislike at this time
    await this.updateLikeOrDislikeComment({
      comment,
      total: totalDisLove,
      isLike: false,
      isIncrease: false,
    });
  }

  async handleIsLikeAndDislikeForComments(
    comments: Comments[],
    actionIds,
    userId: string,
  ) {
    //count isLike and DisLike
    const commentIds = comments.map((comment) => comment.id);

    const actionLikeId = actionIds[InteractType.LOVE];
    const actionDisLikeId = actionIds[InteractType.DISLOVE];

    const commentsWithLikeAndDisLike = await this.userInteractRepository.find({
      where: [
        {
          deletedAt: IsNull(),
          userId,
          entityId: Any(commentIds),
          entityName: EntityInteractType.COMMENT,
          interactId: actionLikeId,
        },
        {
          deletedAt: IsNull(),
          userId,
          entityId: Any(commentIds),
          entityName: EntityInteractType.COMMENT,
          interactId: actionDisLikeId,
        },
      ],
    });

    const viewComments = mapper
      .mapArray(comments, Comments, ViewCommentDto)
      .map((comment) => {
        const isLikedComment = commentsWithLikeAndDisLike.find(
          (x) => x.entityId == comment.id && x.interactId == actionLikeId,
        );
        console.log('isLikedComment', isLikedComment);
        const isDisLikedComment = commentsWithLikeAndDisLike.find(
          (x) => x.entityId == comment.id && x.interactId == actionDisLikeId,
        );
        return {
          ...comment,
          isLoved: isLikedComment ? true : false,
          isDisloved: isDisLikedComment ? true : false,
        };
      });

    return viewComments;
  }

  async handleIsLikeAndDislikeAndSavedForThreads(
    posts: Post[],
    actionIds,
    userId: string,
  ) {
    //count isLike and DisLike
    const postIds = posts?.map((thread) => thread?.id);

    const actionLoveId = actionIds[InteractType.LOVE];
    const actionDisLoveId = actionIds[InteractType.DISLOVE];

    const interactions = await this.userInteractRepository.find({
      where: {
        deletedAt: IsNull(),
        userId,
        entityId: Any(postIds),
        entityName: EntityInteractType.POST,
        interactId: In([actionLoveId, actionDisLoveId]),
      },
    });

    const interactionMap = new Map();
    interactions.forEach(interaction => {
      const key = `${interaction.entityId}-${interaction.interactId}`;
      interactionMap.set(key, true);
    });

    const viewThreads = posts.map(post => {
      const loveKey = `${post.id}-${actionLoveId}`;
      const disLoveKey = `${post.id}-${actionDisLoveId}`;
      return {
        ...post,
        isLoved: interactionMap.has(loveKey),
        isDisLoved: interactionMap.has(disLoveKey),
      };
    });

    return viewThreads;
  }

  async loveConversation({
    entityId,
    userId,
  }: {
    entityId: string;
    userId: string;
  }) {
    // 'LOVE'
    const actionId = await this.getInteractIdByAction(InteractType.LOVE);

    // Check if conversation exist
    const conversation = await this.conversationRepository.findOne({
      id: entityId,
    });
    if (!conversation) {
      throw new HttpException('conversation not found', HttpStatus.BAD_REQUEST);
    }
    // Check if user interact exist
    const userInteract = await this.getUserInteractionConversation({
      userId,
      entityId,
      interactId: actionId,
    });

    if (userInteract) {
      throw new HttpException('User already loved.', HttpStatus.BAD_REQUEST);
    }

    //  Create user interact
    await this.createUserInteraction({
      entityId,
      interactId: actionId,
      userId,
      entityName: EntityInteractType.CONVERSATION,
    });

    // Find user to get username
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
      select: ['username'],
    });
    try {
      const notification = new CreateNotificationDto({
        type: TypeNotification.LoveConversation,
        data: `${user?.username} vừa thích bình tin nhắn của bạn `,
        createdBy: userId,
        actionUserId: userId,
        userId,
        additionalData: { conversation, user },
      });
      // Create notification
      const updatedNotification =
        await this.notificationService.createAndReturn(notification);

      // Send notification
      this.notificationService.prepareSendNotiForPerson(
        conversation.createdBy,
        updatedNotification,
        'Thông Báo',
        `${user.username} vừa thích bình tin nhắn của bạn  `,
      );
    } catch (ex) { }

    //save total Like
    const { totalLove, totalDisLove } = conversation;
    const newConversation = await this.updateLoveOrDisLoveConversation({
      conversation,
      total: totalLove,
      isLike: true,
      isIncrease: true,
    });

    //find does user has dislike in db?
    try {
      const dislikeActionId = await this.getInteractIdByAction(
        InteractType.DISLOVE,
      );
      const userDislike = await this.getUserInteractionConversation({
        interactId: dislikeActionId,
        userId,
        entityId,
      });
      //check if has record and remove it
      if (userDislike) {
        await this.deleteCurrentUserInteraction({ item: userDislike, userId });

        //count total Dislike at this time
        await this.updateLoveOrDisLoveConversation({
          conversation: newConversation,
          total: totalDisLove,
          isLike: false,
          isIncrease: false,
        });
      }
    } catch (ex) { }
  }

  async removeLoveConversation({
    entityId,
    userId,
  }: {
    entityId: string;
    userId: string;
  }) {
    const conversation = await this.conversationRepository.findOne({
      id: entityId,
    });
    if (!conversation) {
      throw new HttpException('conversation not found', HttpStatus.BAD_REQUEST);
    }
    const { totalLove } = conversation;
    const actionId = await this.getInteractIdByAction(InteractType.LOVE);

    const userLike = await this.getUserInteractionConversation({
      interactId: actionId,
      userId,
      entityId,
    });

    if (!userLike) {
      throw new HttpException('Record Not Found', HttpStatus.BAD_REQUEST);
    }

    await this.deleteCurrentUserInteraction({ item: userLike, userId });
    //count total Dislike at this time
    await this.updateLoveOrDisLoveConversation({
      conversation,
      total: totalLove,
      isLike: true,
      isIncrease: false,
    });
  }

  async disLoveConversation({
    entityId,
    userId,
  }: {
    entityId: string;
    userId: string;
  }) {
    const actionId = await this.getInteractIdByAction(InteractType.DISLOVE);

    //validation
    const conversation = await this.conversationRepository.findOne({
      id: entityId,
    });
    if (!conversation) {
      throw new HttpException('conversation not found', HttpStatus.BAD_REQUEST);
    }

    const userInteract = await this.getUserInteractionConversation({
      userId,
      entityId,
      interactId: actionId,
    });

    if (userInteract) {
      throw new HttpException('User already dis love', HttpStatus.BAD_REQUEST);
    }
    const { totalLove, totalDisLove } = conversation;

    await this.createUserInteraction({
      entityId,
      interactId: actionId,
      userId,
      entityName: EntityInteractType.CONVERSATION,
    });

    //save total Like
    const newConversation = await this.updateLoveOrDisLoveConversation({
      conversation,
      total: totalDisLove,
      isLike: false,
      isIncrease: true,
    });

    //find does user has like in db?

    try {
      const likeActionId = await this.getInteractIdByAction(InteractType.LOVE);
      const userLike = await this.getUserInteractionComment({
        interactId: likeActionId,
        userId,
        entityId,
      });
      //check if has record and remove it
      if (userLike) {
        await this.deleteCurrentUserInteraction({ item: userLike, userId });

        //count total Dislike at this time
        await this.updateLoveOrDisLoveConversation({
          conversation: newConversation,
          total: totalLove,
          isLike: true,
          isIncrease: false,
        });
      }
    } catch (ex) { }
  }

  async removeDisLoveConversation({
    entityId,
    userId,
  }: {
    entityId: string;
    userId: string;
  }) {
    const conversation = await this.conversationRepository.findOne({
      id: entityId,
    });
    if (!conversation) {
      throw new HttpException('Conversation not exist', HttpStatus.BAD_REQUEST);
    }

    const actionId = await this.getInteractIdByAction(InteractType.DISLOVE);

    const { totalDisLove } = conversation;

    const userDisLike = await this.getUserInteractionConversation({
      interactId: actionId,
      userId,
      entityId,
    });

    if (!userDisLike) {
      throw new HttpException('Record Not Found', HttpStatus.BAD_REQUEST);
    }

    await this.deleteCurrentUserInteraction({ item: userDisLike, userId });
    //count total Dislike at this time
    await this.updateLoveOrDisLoveConversation({
      conversation,
      total: totalDisLove,
      isLike: false,
      isIncrease: false,
    });
  }
}
