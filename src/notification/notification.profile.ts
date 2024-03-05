// import {
//   CamelCaseNamingConvention,
//   createMap,
//   forMember,
//   mapFrom,
//   MappingProfile,
//   namingConventions,
// } from '@automapper/core';
// import { Notifications } from 'src/entities/Notifications';
// import { ViewNotificationDto } from './dto/notification.dto';

// export const notificationProfile: MappingProfile = (mapper) => {
//   createMap(
//     mapper,
//     Notifications,
//     ViewNotificationDto,
//     forMember(
//       (destination) => destination?.actionUser,
//       mapFrom((source) => source?.actionUser),
//     ),
//     namingConventions(new CamelCaseNamingConvention()),
//   );
// };
