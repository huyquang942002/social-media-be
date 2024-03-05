import { PublicApiService } from '../services/public-api.service';
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
} from '@nestjs/common';
import { PostFilterDto } from 'src/posts/dto/post.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileFilterDto } from './dto/public-api.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
@ApiTags('public-api')
@Controller('public-api')
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  // Have get all post in new feed  by tag ^^
  @Get('get-all-posts-public')
  @ApiOperation({ summary: 'Get all post in new feed (Filter by tag)' })
  async findAll(@Query() input: PostFilterDto) {
    return await this.publicApiService.findAll(input);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('detail-profile')
  @ApiOperation({ summary: 'Get detail profile' })
  async detailProfile(@Req() req, @Query() input: ProfileFilterDto) {
    const { id: userId } = req.user;
    return await this.publicApiService.detailProfile(userId, input);
  }
}
