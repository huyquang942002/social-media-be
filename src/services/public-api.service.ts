import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post';
import { PostFilterDto } from 'src/posts/dto/post.dto';
import { PageMetaDto } from 'src/shared/pagination/page-meta.dto';
import { PaginationDto } from 'src/shared/pagination/pagination.dto';
import { getSkip } from 'src/shared/utils';
import { IsNull, Repository } from 'typeorm';
import { PostService } from './post.service';
import { FriendService } from './friend.service';
import { FriendRequest } from 'src/entities/friendRequest';
import { Friend } from 'src/entities/friend';
import { Users } from 'src/entities/Users';
import { ProfileFilterDto } from 'src/public-api/dto/public-api.dto';
import * as moment from 'moment';
import { TypeDetailProfile } from 'src/constant/type-detail-profile';

@Injectable()
export class PublicApiService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    private readonly postService: PostService,
    private readonly friendService: FriendService,
  ) {}
  async findAll(input: PostFilterDto) {
    const { page, take, tag, startDate, endDate } = input;
    const [post, count] = await this.postRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.comment', 'c', 'c.deletedAt is null')
      .leftJoinAndSelect(
        'p.postGalleries',
        'postGalleries',
        'postGalleries.deletedAt is null',
      )
      .leftJoinAndSelect('p.createdUser', 'u', 'u.deletedAt is null')
      .leftJoinAndSelect('p.updatedUser', 'user', 'user.deletedAt is null')
      .where(
        `p.deletedAt is null and p.tag = :tag ${
          startDate ? ' and p.createdAt >= :startDate' : ''
        }
      ${endDate ? ' and p.createdAt <= :endDate' : ''} 
`,
        {
          ...(tag ? { tag } : {}),
          ...(startDate ? { startDate: moment().format() } : {}),
          ...(endDate ? { endDate: moment().format() } : {}),
        },
      )
      .orderBy('p.id', 'DESC')
      .take(take)
      .skip(getSkip({ page, take }))
      .getManyAndCount();

    return new PaginationDto(post, <PageMetaDto>{
      page,
      take,
      totalCount: count,
    });
  }

  async findTypeRequestFriend(ortherId: string, userId: string): Promise<any> {
    if (ortherId == userId) {
      return {
        type: TypeDetailProfile.MYSELF,
      };
    }
    const reqMakeFriend = await this.friendRequestRepository.findOne({
      where: {
        senderId: userId,
        receiverId: ortherId,
      },
    });
    if (reqMakeFriend) {
      return {
        type: TypeDetailProfile.SENT,
      };
    }
    const acpReqMakeFriend = await this.friendRequestRepository.findOne({
      where: {
        senderId: ortherId,
        receiverId: userId,
      },
    });
    if (acpReqMakeFriend) {
      return {
        type: TypeDetailProfile.ACCEPT,
      };
    }
    const friend = await this.friendRepository.findOne({
      where: [
        {
          senderId: ortherId,
          receiverId: userId,
          deletedAt: IsNull(),
        },
        {
          senderId: userId,
          receiverId: ortherId,
          deletedAt: IsNull(),
        },
      ],
    });
    if (friend) {
      return {
        type: TypeDetailProfile.FRIEND,
      };
    }
    return {
      type: TypeDetailProfile.ADD_FRIEND,
    };
  }

  async detailProfile(userId: string, input: ProfileFilterDto) {
    const { otherId } = input;
    const user = await this.usersRepository.findOne({
      where: {
        id: otherId,
        deletedAt: IsNull(),
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_GATEWAY);
    }

    const totalPost = await this.postService.totalPostByUser(otherId);

    const totalFriend = await this.friendService.getAllFriendByUserId(otherId);

    const totalFollower = await this.friendService.getListRequestmakeFriend(
      otherId,
    );

    const typeFriend = await this.findTypeRequestFriend(otherId, userId);

    const detailUser = {
      totalPost: totalPost,
      totalFriend: totalFriend.count,
      totalFollower: totalFollower.count,
      typeFriend,
    };

    const profileUser = await this.postService.getAllPostByUser(
      otherId,
      input,
      userId,
    );

    return {
      detailUser,
      profileUser,
      user,
    };
  }
}
