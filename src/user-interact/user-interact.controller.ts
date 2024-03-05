import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { successMessage } from 'src/shared/utils';
import { CreateUserInteractDto } from './dto/user-interact.dto';
import { UserInteractService } from '../services/user-interact.service';

@ApiTags('UserInteract')
@Controller('user-interact')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserInteractController {
  constructor(private userInteractService: UserInteractService) {}

  @ApiOperation({ summary: 'Love Post' })
  @Post('love')
  async love(@Body() createUserInteractDto: CreateUserInteractDto, @Req() req) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.love({ entityId, userId });

    return successMessage({ message: 'Love post successfully' });
  }

  @ApiOperation({ summary: 'Remove love Post' })
  @Post('remove-love')
  async removeLove(
    @Body() createUserInteractDto: CreateUserInteractDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.removeLove({ entityId, userId });

    return successMessage({ message: 'Removed love post successfully' });
  }

  @ApiOperation({ summary: 'Dislove Post' })
  @Post('dislove')
  async dislove(
    @Body() createUserInteractDto: CreateUserInteractDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.dislove({ entityId, userId });

    return successMessage({ message: 'Dislove post Successfully' });
  }

  @ApiOperation({ summary: 'Remove dislove Post' })
  @Post('remove-dislove')
  async removeDislike(
    @Body() createUserInteractDto: CreateUserInteractDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.removeDislike({ entityId, userId });

    return successMessage({ message: 'Removed dislove post successfully' });
  }

  @ApiOperation({ summary: 'love Comment' })
  @Post('love-comment')
  async likeComment(
    @Body() createUserInteractDto: CreateUserInteractDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.likeComment({ entityId, userId });

    return successMessage({ message: 'Love comment Successfully' });
  }

  @ApiOperation({ summary: 'Remove love Comment' })
  @Post('remove-love-comment')
  async removeLikeComment(
    @Body() createUserInteractDto: CreateUserInteractDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.removeLikeComment({ entityId, userId });

    return successMessage({ message: 'Removed Love Comment Successfully' });
  }

  @ApiOperation({ summary: 'Dislove Comment' })
  @Post('dislove-comment')
  async dislikeCommentike(
    @Body() createUserInteractDto: CreateUserInteractDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.dislikeComment({ entityId, userId });

    return successMessage({ message: 'Dislove comment Successfully' });
  }

  @ApiOperation({ summary: 'Remove dislove Comment' })
  @Post('remove-dislove-comment')
  async removeDislikeComment(
    @Body() createUserInteractDto: CreateUserInteractDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.removeDislikeComment({ entityId, userId });

    return successMessage({ message: 'Removed DisLove Comment Successfully' });
  }

  @ApiOperation({ summary: 'Love Conversation' })
  @Post('love-conversation')
  async loveConversation(
    @Body() createUserInteractDto: CreateUserInteractDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.loveConversation({ entityId, userId });

    return successMessage({
      message: 'Love Conversation Successfully',
    });
  }

  @ApiOperation({ summary: 'Remove love Conversation' })
  @Post('remove-love-conversation')
  async removeLoveConversation(
    @Body() createUserInteractDto: CreateUserInteractDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.removeLoveConversation({ entityId, userId });

    return successMessage({
      message: 'Removed Love Conversation Successfully',
    });
  }

  @ApiOperation({ summary: 'Dislove Conversation' })
  @Post('dislove-conversation')
  async disLoveConversation(
    @Body() createUserInteractDto: CreateUserInteractDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.disLoveConversation({ entityId, userId });

    return successMessage({
      message: 'DisLove Conversation successfully',
    });
  }

  @ApiOperation({ summary: 'Remove dislove Conversation' })
  @Post('remove-dislove-conversation')
  async removeDisLoveConversation(
    @Body() createUserInteractDto: CreateUserInteractDto,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    const { entityId } = createUserInteractDto;
    await this.userInteractService.removeDisLoveConversation({
      entityId,
      userId,
    });

    return successMessage({
      message: 'Removed DisLove Conversation Successfully',
    });
  }
}
