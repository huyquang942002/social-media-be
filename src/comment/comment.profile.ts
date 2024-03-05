import {
  CamelCaseNamingConvention,
  createMap,
  forMember,
  mapFrom,
  MappingProfile,
  namingConventions,
} from '@automapper/core';
import { Comments } from 'src/entities/comment';
import { ViewCommentDto } from './dto/comment.dto';

export const commentProfile: MappingProfile = (mapper) => {
  createMap(
    mapper,
    Comments,
    ViewCommentDto,
    forMember(
      (destination) => destination?.createdUser,
      mapFrom((source) => source?.createdUser),
    ),
    namingConventions(new CamelCaseNamingConvention()),
  );
  // createMap(
  //   mapper,
  //   Comments,
  //   ViewCommentByThreadFilter,
  //   forMember(
  //     (destination) => destination?.createUser,
  //     mapFrom((source) => source?.createUser),
  //   ),
  //   namingConventions(new CamelCaseNamingConvention()),
  // );
  // createMap(
  //   mapper,
  //   Comments,
  //   ViewCommentChildByParentFilter,
  //   namingConventions(new CamelCaseNamingConvention()),
  // );
};
