import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreatePostDto,
  HomePagePostFilterDto,
  HomePageUserPostFilterDto,
  UpdatePostDto,
  ViewPostDto,
} from '../posts/dto/post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Post } from 'src/entities/post';
import { getS3Presigned, getSkip } from 'src/shared/utils';
import { ConfigService } from '@nestjs/config';
import { PostGalleries } from 'src/entities/PostGalleries';
import * as moment from 'moment';
import { PaginationDto } from 'src/shared/pagination/pagination.dto';
import { PageMetaDto } from 'src/shared/pagination/page-meta.dto';
import { POST_USER_ID } from 'src/constant/upload.constant';
import { UserInteractService } from 'src/services/user-interact.service';

import { InteractType } from 'src/shared/interacts.enum';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostGalleries)
    private postGalleriesRepository: Repository<PostGalleries>,
    private readonly configService: ConfigService,
    private userInteractService: UserInteractService,
  ) { }

  public async presignedUrlPostMultiMedia(fileNames: string[], userId: string) {
    return fileNames?.map((name) => {
      return getS3Presigned(
        name,
        `${POST_USER_ID}_${userId}`,
        this.configService,
      );
    });
  }

  async create(dto: CreatePostDto, createdBy: string) {
    const { postGalleries } = dto;

    const newPost = await this.postRepository.save(
      this.postRepository.create({
        ...dto,
        createdBy,
      }),
    );

    let newS3Links;

    if (postGalleries?.length > 0) {
      const getListImg = postGalleries?.map((x) => x.name);

      postGalleries.map(async (item) => {
        const { link, name, description } = item;
        const postGallerie = await this.postGalleriesRepository.create({
          link,
          name,
          description,
          postId: newPost?.id,
          createdBy,
        });
        await this.postGalleriesRepository.save(postGallerie);
      });
      newS3Links = await this.presignedUrlPostMultiMedia(getListImg, createdBy);
    }

    newPost.newS3Links = newS3Links;
    await this.postRepository.save(newPost);

    return {
      newPost,
      newS3Links: newS3Links ?? null,
    };
  }

  async update(
    id: string,
    dto: UpdatePostDto,
    updatedBy: string,
    isAdmin: boolean,
  ) {
    const post = await this.postRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!isAdmin) {
      if (post.createdBy !== updatedBy) {
        throw new HttpException('Not authorized!', HttpStatus.BAD_REQUEST);
      }
    }
    if (!post) {
      throw new HttpException(
        'Bài viết không tồn tại!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { postGalleries, deleteGalleryIds } = dto;
    if (deleteGalleryIds?.length > 0) {
      const listDeletedGalleries = deleteGalleryIds.split(',');
      await this.postGalleriesRepository.update(
        { id: In(listDeletedGalleries) },
        { deletedAt: moment().format(), deletedBy: updatedBy }
      );
    }

    //update basic information.
    const newPost = await this.postRepository.save({
      ...post,
      ...dto,
      updatedBy,
      updatedAt: moment().format(),
    });
    let newS3Link;

    if (postGalleries?.length > 0) {
      postGalleries.map(async (item) => {
        const { link, name, description } = item;
        const postGallerie = await this.postGalleriesRepository.create({
          link,
          name,
          description,
          postId: newPost?.id,
          createdBy: updatedBy,
        });
        await this.postGalleriesRepository.save(postGallerie);
      });

      const getListImg = postGalleries.map((x) => x?.name);

      if (getListImg?.length > 0) {
        newS3Link = await this.presignedUrlPostMultiMedia(
          getListImg,
          updatedBy,
        );
      }

      console.log('newS3Link', newS3Link);
      return { newPost, newS3Link };
    } else {
      return { newPost };
    }
  }

  async delete(id: string, deletedBy: string, isAdmin: boolean) {
    const post = await this.postRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!isAdmin) {
      if (post.createdBy !== deletedBy) {
        throw new HttpException('Not authorized!', HttpStatus.BAD_REQUEST);
      }
    }

    await this.postGalleriesRepository.update(
      {
        postId: id.toString(),
      },
      {
        deletedAt: moment().format(),
        deletedBy,
      },
    );

    await this.postRepository.save({
      ...post,
      deletedAt: moment().format(),
      deletedBy,
    });
  }

  async totalPostByUser(userId: string) {
    const posts = await this.postRepository.find({
      where: {
        createdBy: userId,
        deletedAt: IsNull(),
      },
    });
    return posts.length;
  }

  async getAllPostByUser(
    userId: string,
    input: HomePageUserPostFilterDto,
    otherUserId: string,
  ) {
    const { page, take } = input;
    const [posts, count] = await this.postRepository.findAndCount({
      where: {
        createdBy: userId,
        deletedAt: IsNull(),
      },
      order: {
        id: 'DESC',
      },
      relations: ['postGalleries', 'comment', 'createdUser'],
    });

    //query
    const actionIds = await this.userInteractService.getInteractIdsByActions([
      InteractType.LOVE,
      InteractType.DISLOVE,
    ]);

    const threads = posts.filter((x) => x);
    if (otherUserId && threads?.length > 0) {
      const viewThreadsOtherUser =
        await this.userInteractService.handleIsLikeAndDislikeAndSavedForThreads(
          threads,
          actionIds,
          otherUserId,
        );

      //return
      return new PaginationDto(viewThreadsOtherUser, <PageMetaDto>{
        page,
        take,
        totalCount: count,
      });
    }

    if (threads?.length > 0) {
      const viewThreads =
        await this.userInteractService.handleIsLikeAndDislikeAndSavedForThreads(
          threads,
          actionIds,
          userId,
        );

      //return
      return new PaginationDto(viewThreads, <PageMetaDto>{
        page,
        take,
        totalCount: count,
      });
    }

    return new PaginationDto([], <PageMetaDto>{
      page,
      take,
      totalCount: count,
    });
  }

  // async findOne(id: string) {
  //   const post = await this.postRepository
  //     .createQueryBuilder('p')
  //     .leftJoinAndSelect(
  //       'p.postGalleries',
  //       'postGalleries',
  //       'postGalleries.deletedAt is null',
  //     )
  //     .leftJoinAndSelect('p.createdUser', 'u', 'u.deletedAt is null')
  //     .leftJoinAndSelect('p.updatedUser', 'user', 'user.deletedAt is null')
  //     .where(
  //       `p.id = :id and p.deletedAt is null
  //   `,
  //       { id },
  //     )
  //     .getOne();

  //   // //query
  //   // const actionIds = await this.userInteractService.getInteractIdsByActions([
  //   //   InteractType.LOVE,
  //   //   InteractType.DISLOVE,
  //   // ]);
  //   // const viewThreads =
  //   //   await this.userInteractService.handleIsLikeAndDislikeAndSavedForThreads(
  //   //     post,
  //   //     actionIds,
  //   //     userId,
  //   //   );
  // }

  private async prepareQueryBuilderForPosts(
    builder,
    content,
    take,
    page,
    filterByType,
  ) {
    const newBuilder = builder
      .leftJoinAndSelect(
        'th.postGalleries',
        'postGalleries',
        'postGalleries.deletedAt is null',
      )
      .leftJoinAndSelect('th.createdUser', 'u', 'u.deletedAt is null')
      .leftJoinAndSelect('th.updatedUser', 'us', 'us.deletedAt is null')
      .where(
        `th.deletedAt is null
        and postGalleries.deletedAt is null
      ${content ? ' and LOWER(th.content) LIKE :content' : ''}
      and th.tag = :filterByType 
        `,
        {
          ...(content ? { content: `%${content.toLowerCase()}%` } : {}),
          filterByType,
        },
      );

    return await newBuilder
      .addOrderBy('th.id', 'DESC')
      .take(take)
      .skip(getSkip({ page, take }))
      .getManyAndCount();
  }

  async getPostsForLookupTable(
    input: HomePagePostFilterDto,
    userId: string,
  ): Promise<PaginationDto<ViewPostDto>> {
    const { page, take, content, filterByType } = input;

    const builder = this.postRepository.createQueryBuilder('th');

    const [preThreads, count] = await this.prepareQueryBuilderForPosts(
      builder,
      content,
      take,
      page,
      filterByType,
    );

    //query
    const threads = preThreads.filter((x) => x);
    if (threads?.length > 0) {
      const actionIds = await this.userInteractService.getInteractIdsByActions([
        InteractType.LOVE,
        InteractType.DISLOVE,
      ]);
      const viewThreads =
        await this.userInteractService.handleIsLikeAndDislikeAndSavedForThreads(
          threads,
          actionIds,
          userId,
        );

      //return
      return new PaginationDto(viewThreads, <PageMetaDto>{
        page,
        take,
        totalCount: count,
      });
    }

    return new PaginationDto([], <PageMetaDto>{
      page,
      take,
      totalCount: count,
    });
  }

  async findOne(id: string) {
    return await this.postRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
      relations: ['createdUser', 'postGalleries'],
    });
  }
}
