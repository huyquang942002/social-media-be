import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment/moment';
// import { GroupUsers } from 'src/entities/GroupUsers';
import { UserDevices } from 'src/entities/UserDevices';
import { FirebaseNotificationService } from 'src/firebase-notifcation/firebase-notification.service';
import { In, IsNull, Repository } from 'typeorm';
import { mapper } from '../configuration/mapper';
import { Notifications } from '../entities/Notifications';
import { PageMetaDto } from '../shared/pagination/page-meta.dto';
import { PaginationDto } from '../shared/pagination/pagination.dto';
import { getSkip } from '../shared/utils';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from '../notification/dto/create-notification.dto';
import { NotificationInputFilter } from '../notification/dto/notification-input.filter';
// import { Groups } from 'src/entities/group';
import { ViewNotificationDto } from '../notification/dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notifications)
    private notificationRepository: Repository<Notifications>,
    @InjectRepository(UserDevices)
    private userDevicesRepository: Repository<UserDevices>,
    private firebaseNotificationService: FirebaseNotificationService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return await this.notificationRepository.insert(
      this.notificationRepository.create(createNotificationDto),
    );
  }

  async createAndReturn(createNotificationDto: CreateNotificationDto) {
    const obj = this.notificationRepository.create(createNotificationDto);
    const insertedResult = await this.notificationRepository.insert({
      ...obj,
    });

    if (insertedResult?.generatedMaps?.[0]?.id) {
      return {
        ...insertedResult?.generatedMaps?.[0],
        ...createNotificationDto,
      };
    }
  }

  async findAllUserNotifications(
    input: NotificationInputFilter,
    userId: string,
  ) {
    const { order, page, take, isFilterUnread } = input;

    const optionQuery = {
      where: {
        userId,
        deletedAt: IsNull(),
        ...(isFilterUnread?.toString() === 'true' ? { isReaded: false } : {}),
      },
      order: {
        createdAt: order,
      },
      take,
      skip: getSkip({ page, take }),
      relations: ['actionUser', 'createdUser', 'updatedUser'],
    };

    const list = await this.notificationRepository.find(optionQuery);

    const count = await this.notificationRepository.count({
      where: {
        userId,
        deletedAt: IsNull(),
      },
    });

    const totalUnread = await this.notificationRepository.count({
      where: {
        userId,
        deletedAt: IsNull(),
        isReaded: false,
      },
    });

    return new PaginationDto(
      mapper.mapArray(list, Notifications, ViewNotificationDto),
      <PageMetaDto>{ page, take, totalCount: count, totalUnread },
    );
  }

  async findAll(input: NotificationInputFilter) {
    const { order, page, take } = input;

    const optionQuery = {
      order: {
        id: order,
      },
      take,
      skip: getSkip({ page, take }),
      relations: ['actionUser', 'createdUser', 'updatedUser'],
    };

    const [list, count] = await this.notificationRepository.findAndCount(
      optionQuery,
    );

    return new PaginationDto(
      mapper.mapArray(list, Notifications, ViewNotificationDto),
      <PageMetaDto>{ page, take, totalCount: count },
    );
  }

  async findOne(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['actionUser', 'createdUser', 'updatedUser'],
    });
    return mapper.map(notification, Notifications, ViewNotificationDto);
  }

  async update(id: number, update: UpdateNotificationDto, updatedBy: string) {
    const currentObj = await this.notificationRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (currentObj) {
      return this.notificationRepository.save({
        ...currentObj,
        ...update,
        updatedBy,
        updatedAt: moment().format(),
      });
    } else {
      throw new NotFoundException();
    }
  }

  async remove(id: number, deletedBy: string) {
    const objToRemove = await this.notificationRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (objToRemove) {
      return this.notificationRepository.save({
        ...objToRemove,
        deletedAt: moment().format(),
        deletedBy,
      });
    } else {
      throw new NotFoundException();
    }
  }

  async readSingleNotification(id: number, userId: string) {
    const currentObj = await this.notificationRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (currentObj) {
      return this.notificationRepository.save({
        ...currentObj,
        isReaded: true,
        updatedBy: userId,
        updatedAt: moment().format(),
      });
    } else {
      throw new NotFoundException();
    }
  }

  async unReadSingleNotification(id: number, userId: string) {
    const currentObj = await this.notificationRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (currentObj) {
      return this.notificationRepository.save({
        ...currentObj,
        isReaded: false,
        updatedBy: userId,
        updatedAt: moment().format(),
      });
    } else {
      throw new NotFoundException();
    }
  }

  async prepareSendNotiForPerson(
    userId: string,
    body,
    title: string,
    message: string,
  ) {
    const notiDeviceUsers = await this.userDevicesRepository.find({
      where: { userId },
    });
    if (!notiDeviceUsers) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const notiDeviceIds = notiDeviceUsers
      .map((nU) => nU?.deviceId)
      .filter((nU) => nU);

    this.firebaseNotificationService.sendNotificationToDevice(
      body,
      notiDeviceIds,
      title,
      message,
    );
  }

  async prepareSendNotiForMultiUsers(
    userIds: string[],
    body,
    title: string,
    message: string,
  ) {
    const notiDeviceUsers = await this.userDevicesRepository.find({
      where: { userId: In(userIds) },
    });

    const notiDeviceIds = notiDeviceUsers
      .map((nU) => nU?.deviceId)
      .filter((nU) => nU);

    this.firebaseNotificationService.sendNotificationToDevice(
      body,
      notiDeviceIds,
      title,
      message,
    );
  }
}
