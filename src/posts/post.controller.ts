import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import {
  CreatePostDto,
  HomePagePostFilterDto,
  HomePageUserPostFilterDto,
  PostFilterDto,
  UpdatePostDto,
} from './dto/post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { successMessage } from 'src/shared/utils';

@Controller('post')
@ApiTags('post')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Lookup table' })
  @Get('/lookup')
  async getPostsForLookupTable(
    @Query() input: HomePagePostFilterDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return await this.postService.getPostsForLookupTable(input, userId);
  }

  @ApiOperation({ summary: 'Create post' })
  @Post()
  async create(@Body() dto: CreatePostDto, @Req() req) {
    const { id: userId } = req.user;
    return await this.postService.create(dto, userId);
  }

  @ApiOperation({ summary: 'Get all post by User' })
  @Get('get-all-posts-by-User')
  async getAllPostByUser(
    @Req() req,
    @Query() input: HomePageUserPostFilterDto,
  ) {
    const { id: userId } = req.user;
    return await this.postService.getAllPostByUser(userId, input, null);
  }

  // // Have get all post by tag ^^
  // @Get('get-all-posts')
  // @ApiOperation({ summary: 'Get all post (Filter by tag)' })
  // async findAll(@Query() input: PostFilterDto) {
  //   return await this.postService.findAll(input);
  // }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    const isAdmin = false;
    const data = await this.postService.update(id, dto, userId, isAdmin);
    return successMessage({ message: 'Updated  Post', data });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post' })
  async delete(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    const isAdmin = false;
    await this.postService.delete(id, userId, isAdmin);

    return successMessage({ message: 'Deleted Post' });
  }

  @ApiOperation({ summary: 'Find post by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }
}
