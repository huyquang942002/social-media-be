import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FriendService } from 'src/services/friend.service';
import { CreateFriendDto, ProposeFriendFilterDto } from './dto/friend.dto';

@Controller('friend')
@ApiTags('friend')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  // CREATE FRIEND
  // REMOVE REQUEST MAKE FRIEND
  // HANDLE
  @Post('create')
  @ApiOperation({ summary: 'Send request/accept make friend' })
  create(
    @Body()
    dto: CreateFriendDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    return this.friendService.create(dto, userId);
  }

  // GET ALL FRIEND BY USER
  @Get('getAllFriend')
  getAllFriendByUserId(@Req() req) {
    const { id: userId } = req.user;
    return this.friendService.getAllFriendByUserId(userId);
  }

  // GET LIST FRIEND BY USER
  @ApiOperation({ summary: 'Total Request Make FR & Profile Request FR ' })
  @Get('getListRequestFriend')
  getListRequestmakeFriend(@Req() req) {
    const { id: userId } = req.user;
    return this.friendService.getListRequestmakeFriend(userId);
  }

  // REMOVE FRIEND BY OTHER USER
  @Delete('delete/:id')
  remove(@Param('id') id: string, @Req() req) {
    const { id: userId } = req.user;
    return this.friendService.remove(id, userId);
  }

  // PROPOSE FRIEND BY DISTANCE , NOT FRIEND , NOT FOLLOW

  @Post('propose-friend')
  async getUsersNotFriends(@Req() req, @Body() dto: ProposeFriendFilterDto) {
    const { id: userId } = req.user;
    return await this.friendService.getUsersNotFriends(userId);
  }

  // LINK POST BETWEEN 2 USER (NOT EMPTY,NOT MATCH)

  // @Get('getAllLinkPost')
  // async getAllLinkPost(@Req() req, @Body('otherUserId') otherUserId: string) {
  //   const { id: userId } = req.user;
  //   return this.friendService.getAllLinkPost(userId, otherUserId);
  // }
}
