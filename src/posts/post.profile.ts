import {
  CamelCaseNamingConvention,
  createMap,
  forMember,
  mapFrom,
  MappingProfile,
  namingConventions,
} from '@automapper/core';
import { Post } from 'src/entities/post';
import {
  CreatePostGalleriesDto,
  PostGalleriesDto,
  ViewPostDto,
  ViewPostForPublicDto,
} from './dto/post.dto';
import { PostGalleries } from 'src/entities/PostGalleries';

export const postProfile: MappingProfile = (mapper) => {
  createMap(
    mapper,
    Post,
    ViewPostDto,
    forMember(
      (destination) => destination.username,
      mapFrom((source) => source?.createdUser?.username),
    ),
    forMember(
      (destination) => destination.totalDislove,
      mapFrom((source) => source?.totalDisLove),
    ),
    forMember(
      (destination) => destination?.s3Profile,
      mapFrom((source) => source?.createdUser?.s3Profile),
    ),
    forMember(
      (destination) => destination.postGalleries,
      mapFrom((source) =>
        source?.postGalleries
          ?.filter((item) => !item?.deletedAt)
          ?.sort((a, b) => {
            if (a?.id < b?.id) return 1;
            if (a?.id > b?.id) return -1;
            return 0;
          }),
      ),
    ),
    forMember(
      (destination) => destination.createdUser,
      mapFrom((source) => source?.createdUser),
    ),
    forMember(
      (destination) => destination.updatedUser,
      mapFrom((source) => source?.updatedUser),
    ),
    namingConventions(new CamelCaseNamingConvention()),
  );
  createMap(
    mapper,
    CreatePostGalleriesDto,
    PostGalleries,
    namingConventions(new CamelCaseNamingConvention()),
  );

  createMap(
    mapper,
    PostGalleriesDto,
    PostGalleries,
    namingConventions(new CamelCaseNamingConvention()),
  );

  createMap(
    mapper,
    Post,
    ViewPostForPublicDto,

    forMember(
      (destination) => destination.username,
      mapFrom((source) => source?.createdUser?.username),
    ),
    forMember(
      (destination) => destination?.s3Profile,
      mapFrom((source) => source?.createdUser?.s3Profile),
    ),
    forMember(
      (destination) => destination.postGalleries,
      mapFrom((source) =>
        source?.postGalleries?.filter((item) => !item?.deletedAt),
      ),
    ),
    namingConventions(new CamelCaseNamingConvention()),
  );
};
