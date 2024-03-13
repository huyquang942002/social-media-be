import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Friend } from 'src/entities/friend';
import { FriendRequest } from 'src/entities/friendRequest';
import { CreateFriendDto } from 'src/friend/dto/friend.dto';
import { In, IsNull, Repository } from 'typeorm';
@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async create(dto: CreateFriendDto, userId: string) {
    const { otherUserId } = dto;
    // EXIST REQUEST OF ORTHER USER
    const existingRequest = await this.friendRequestRepository.findOne({
      where: {
        senderId: otherUserId,
        receiverId: userId,
      },
    });

    if (existingRequest) {
      await this.friendRequestRepository.remove(existingRequest);
      // make friend
      const friend = await this.friendRepository.save(
        await this.friendRepository.create({
          senderId: otherUserId,
          receiverId: userId,
          createdBy: userId,
        }),
      );
      return {
        message: 'Was become friend',
        friend,
      };
    } else {
      const friendRequest = await this.friendRequestRepository.save(
        await this.friendRequestRepository.create({
          senderId: userId,
          receiverId: otherUserId,
        }),
      );
      return {
        message: 'Sent request make friend success',
        friendRequest,
      };
    }
  }

  async remove(id: string, userId: string) {
    const friend = await this.friendRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
    if (!friend) {
      throw new HttpException('Friend not found', HttpStatus.BAD_REQUEST);
    }
    await this.friendRepository.remove(friend);
    return {
      message: 'remove success',
    };
  }

  async getAllFriendByUserId(userId: string) {
    const [listFriend, count] = await this.friendRepository.createQueryBuilder("friend")
    .leftJoinAndSelect("friend.senderUser", "sender")
    .leftJoinAndSelect("friend.receiverUser", "receiver")
    .where("friend.senderId = :userId AND friend.deletedAt IS NULL", { userId })
    .orWhere("friend.receiverId = :userId AND friend.deletedAt IS NULL", { userId })
    .getManyAndCount();
    return { listFriend, count };
  }

  async getListRequestmakeFriend(userId: string) {
    const [totalFollower, count] = await this.friendRequestRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.senderUser', 'sder', 'sder.deletedAt is null')
      .leftJoinAndSelect('f.receiverUser', 'rder', 'rder.deletedAt is null')
      .where('f.receiverId = :userId', { userId })
      .getManyAndCount();
    return { totalFollower, count };
  }

  async getUsersNotFriends(createdBy: string) {
    const nonFriendIds = await this.userRepository.createQueryBuilder('user')
    .where('user.id != :createdBy', { createdBy })
    .andWhere(qb => {
      const subQuery = qb.subQuery()
        .select('friend.receiverId')
        .from(Friend, 'friend')
        .where('friend.senderId = :createdBy', { createdBy })
        .getQuery();
      return 'user.id NOT IN ' + subQuery;
    })
    .andWhere(qb => {
      const subQuery = qb.subQuery()
        .select('friend.senderId')
        .from(Friend, 'friend')
        .where('friend.receiverId = :createdBy', { createdBy })
        .getQuery();
      return 'user.id NOT IN ' + subQuery;
    })
    .andWhere(qb => {
      const subQuery = qb.subQuery()
        .select('request.senderId')
        .from(FriendRequest, 'request')
        .where('request.receiverId = :createdBy', { createdBy })
        .getQuery();
      return 'user.id NOT IN ' + subQuery;
    })
    .andWhere(qb => {
      const subQuery = qb.subQuery()
        .select('request.receiverId')
        .from(FriendRequest, 'request')
        .where('request.senderId = :createdBy', { createdBy })
        .getQuery();
      return 'user.id NOT IN ' + subQuery;
    })
    .getMany();

  // Sử dụng danh sách ID vừa lấy được để lọc ra người dùng theo điều kiện tiếp theo
  const userSameZipcodes = nonFriendIds.map(user => user.zipcode);

  // Lấy người dùng có cùng zipcode và không bị xóa
  const users = await this.userRepository.find({
    where: {
      zipcode: In(userSameZipcodes),
      deletedAt: IsNull(),
    },
  });

  return users;
  }

  // async getAllLinkPost(userId: string, otherUserId: string) {
  //   const conversation = await this.conversationRepository.find({
  //     where: [
  //       {
  //         senderId: userId,
  //         receiverId: otherUserId,
  //         isHide: false,
  //         linkPost: Raw((alias) => `${alias} != '{}'`),
  //       },
  //       {
  //         senderId: otherUserId,
  //         receiverId: userId,
  //         isHide: false,
  //         linkPost: Raw((alias) => `${alias} != '{}'`),
  //       },
  //     ],
  //   });

  //   if (!conversation) {
  //     throw new BadGatewayException('Conversation not found');
  //   }
  //   const linkPosts = conversation.map((item) => item.linkPost);
  //   return Array.from(new Set(linkPosts.flat()));
  // }
}
