// import {
//   HttpException,
//   HttpStatus,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { InjectRepository } from '@nestjs/typeorm';
// import * as moment from 'moment';
// import {
//   CreateGroupDto,
//   GroupFilterDto,
//   UpdateGroupDto,
// } from 'src/cms-groups/dto/group.dto';
// import { GroupUsers } from 'src/entities/GroupUsers';
// import { Groups } from 'src/entities/group';
// import { PageMetaDto } from 'src/shared/pagination/page-meta.dto';
// import { PaginationDto } from 'src/shared/pagination/pagination.dto';
// import { getS3Presigned, getSkip } from 'src/shared/utils';
// import { IsNull, Repository } from 'typeorm';

// @Injectable()
// export class GroupService {
//   constructor(
//     @InjectRepository(Groups) private groupRepository: Repository<Groups>,
//     @InjectRepository(GroupUsers)
//     private groupUsersRepository: Repository<GroupUsers>,
//     private readonly configService: ConfigService,
//   ) {}

//   async create(dto: CreateGroupDto, createdBy: string) {
//     const currentTimestamp = new Date().getTime().toString();

//     const newGroup = await this.groupRepository.save(
//       await this.groupRepository.create({
//         ...dto,
//         createdBy,
//         imageGroup: `wallpaperGroup_${currentTimestamp}`,
//       }),
//     );

//     const { id: groupId } = newGroup;

//     await this.groupUsersRepository.save(
//       await this.groupUsersRepository.create({
//         groupId,
//         userId: createdBy,
//         createdBy,
//       }),
//     );
//     return newGroup;
//   }

//   async update(
//     id: string,
//     dto: UpdateGroupDto,
//     updatedBy: string,
//     isAdmin: boolean,
//   ) {
//     const currentGroup = await this.groupRepository.findOne({
//       where: { id, deletedAt: IsNull() },
//     });
//     if (!isAdmin) {
//       if (currentGroup.createdBy !== updatedBy) {
//         throw new HttpException('Not Authorized', HttpStatus.BAD_REQUEST);
//       }
//     }
//     if (currentGroup) {
//       return this.groupRepository.save({
//         ...currentGroup,
//         ...dto,
//         updatedBy,
//         updatedAt: moment().format(),
//       });
//     } else {
//       throw new NotFoundException();
//     }
//   }

//   async delete(id: string, deletedBy: string, isAdmin: boolean) {
//     const currentGroup = await this.groupRepository.findOne({
//       where: { id, deletedAt: IsNull() },
//     });
//     if (!isAdmin) {
//       if (currentGroup.createdBy !== deletedBy) {
//         throw new HttpException('Not Authorized', HttpStatus.BAD_REQUEST);
//       }
//     }
//     if (currentGroup) {
//       return this.groupRepository.save({
//         ...currentGroup,
//         deletedAt: moment().format(),
//         deletedBy,
//       });
//     } else {
//       throw new NotFoundException();
//     }
//   }

//   async getAllPostInGroup(input: GroupFilterDto) {
//     const { page, take, freeText, groupId } = input;

//     const builder = this.groupRepository
//       .createQueryBuilder('gr')
//       .leftJoinAndSelect('gr.post', 'post', 'post.deletedAt is null')
//       .leftJoinAndSelect('gr.groupUsers', 'groupUsers')
//       .leftJoinAndSelect('groupUsers.user', 'user')
//       .where(
//         `gr.deletedAt is null
//         ${
//           freeText
//             ? ' and LOWER(post.tag) LIKE :freeText and LOWER(post.content) LIKE :freeText'
//             : ''
//         }
//         ${groupId ? ' and s.groupId = :groupId' : ''}
//         `,
//         {
//           ...(freeText ? { freeText: `%${freeText.toLowerCase()}%` } : {}),
//           groupId,
//         },
//       );

//     const [posts, count] = await builder
//       .orderBy('s.id', 'DESC')
//       .take(take)
//       .skip(getSkip({ page, take }))
//       .getManyAndCount();

//     return new PaginationDto(posts, <PageMetaDto>{
//       page,
//       take,
//       totalCount: count,
//     });
//   }

//   async findAll(input: GroupFilterDto) {
//     const { page, take } = input;

//     const builder = this.groupRepository
//       .createQueryBuilder('gr')
//       .where(`gr.deletedAt is null`);

//     const [posts, count] = await builder
//       .orderBy('gr.id', 'DESC')
//       .take(take)
//       .skip(getSkip({ page, take }))
//       .getManyAndCount();

//     return new PaginationDto(posts, <PageMetaDto>{
//       page,
//       take,
//       totalCount: count,
//     });
//   }

//   async findOne(id: string) {
//     return await this.groupRepository
//       .createQueryBuilder('gr')
//       .where(`gr.id = :id and gr.deletedAt is null`, {
//         id,
//       })
//       .getOne();
//   }

//   public async presignedUrlAvatar(groupId: string) {
//     const group = await this.groupRepository.findOne({
//       where: { id: groupId, deletedAt: IsNull() },
//     });
//     if (group) {
//       const { imageGroup } = group;
//       const url = await getS3Presigned(
//         imageGroup,
//         `gid_avt_${groupId}`,
//         this.configService,
//       );
//       return url;
//     } else {
//       throw new NotFoundException();
//     }
//   }
// }
