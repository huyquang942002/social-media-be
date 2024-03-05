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
import { CommentService } from '../services/comment.service';
import {
  CommentChildFilterDto,
  CreateCommentDto,
  DeleteCommentDto,
  UpdateCommentDto,
} from './dto/comment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { findAllPostFilter } from 'src/posts/dto/post.dto';

@Controller('comment')
@ApiTags('comment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create Comment' })
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    const { id: userId } = req.user;
    return this.commentService.create(createCommentDto, userId);
  }

  @ApiOperation({ summary: 'Get comment by Parent comment Id' })
  @Get('/get-by-parent-comment')
  async getCommentByParentComment(
    @Query() input: CommentChildFilterDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return await this.commentService.getCommentByParentComment(input, userId);
  }

  // @ApiOperation({ summary: 'get all comment by userName' })
  // @Get('getCommentByUsername/:id')
  // getCommentByusername(
  //   @Param('id') id: string,
  //   @Query() input: { username: string },
  // ) {
  //   return this.commentService.getCommentByUsername(id, input.username);
  // }

  @ApiOperation({ summary: 'get all comment by post' })
  @Get('postId/:id')
  getAllCommentByPost(
    @Param('id') id: string,
    @Query() input: findAllPostFilter,
    @Req() req,
  ) {
    const { id: userId } = req.user;
    return this.commentService.getAllCommentByPost(id, input, userId);
  }

  // @ApiOperation({ summary: 'get one comment' })
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.commentService.findOne(id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto, @Req() req) {
    const { id: userId } = req.user;
    const isAdmin = false;
    return this.commentService.update(id, dto, userId, isAdmin);
  }

  @ApiOperation({ summary: 'Delete by user' })
  @Delete('delete/:id')
  deleteByUser(@Param('id') id: string, @Req() req) {
    const { id: userId } = req.user;
    return this.commentService.deleteByUser(id, userId);
  }

  // @ApiOperation({ summary: 'Delete by admin' })
  // @Delete('delete/:id')
  // deleteByAdmin(@Param('id') id: DeleteCommentDto, @Req() req) {
  //   const { id: userId } = req.user;
  //   return this.commentService.deleteByAdmin(id, userId);
  // }
}
