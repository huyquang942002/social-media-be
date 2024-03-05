import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/create-notification.dto';
import {
  NotificationGroupFilter,
  NotificationInputFilter,
  ReadAllGroupNotifications,
} from './dto/notification-input.filter';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { successMessage } from '../shared/utils';

@ApiTags('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Create a notification',
  })
  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @Req() req,
  ) {
    const createdObject = await this.notificationService.create(
      createNotificationDto,
    );
    return successMessage({
      statusCode: HttpStatus.CREATED,
      data: createdObject,
    });
  }

  @ApiOperation({
    summary: 'Get all notifications',
  })
  @Get()
  findAll(@Query() input: NotificationInputFilter) {
    return this.notificationService.findAll(input);
  }

  @ApiOperation({
    summary: 'Find a notification',
  })
  @Get('id')
  findOne(@Query('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update a notification',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Req() req,
  ) {
    const updatedBy = req.user.id;
    await this.notificationService.update(
      +id,
      updateNotificationDto,
      updatedBy,
    );
    return successMessage({ statusCode: HttpStatus.OK });
  }

  @ApiOperation({
    summary: 'Remove a notification',
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const deletedBy = req.user.id;
    await this.notificationService.remove(+id, deletedBy);
    return successMessage({ statusCode: HttpStatus.OK });
  }

  @ApiOperation({
    summary: 'Get all user notifications',
  })
  @Get('/get-all-user-notifications')
  async findAllUserNotifications(
    @Query() input: NotificationInputFilter,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    return this.notificationService.findAllUserNotifications(input, userId);
  }

  @ApiOperation({
    summary: 'Read single notification',
  })
  @Post('/read-single-notification/:id')
  async readSingleNotification(@Param('id') id: string, @Req() req) {
    const { id: userId } = req.user;
    await this.notificationService.readSingleNotification(+id, userId);
    return successMessage({ statusCode: HttpStatus.OK });
  }

  @ApiOperation({
    summary: 'Un-Read single notification',
  })
  @Post('/un-read-single-notification/:id')
  async unReadSingleNotification(@Param('id') id: string, @Req() req) {
    const { id: userId } = req.user;
    await this.notificationService.unReadSingleNotification(+id, userId);
    return successMessage({ statusCode: HttpStatus.OK });
  }
}
