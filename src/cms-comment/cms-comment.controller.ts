// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Req,
//   UseGuards,
//   Query,
// } from '@nestjs/common';
// import { CommentService } from '../services/comment.service';
// import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
// import {
//   CommentFilterDto,
//   CreateCommentDto,
//   DeleteCommentDto,
//   UpdateCommentDtoCms,
// } from 'src/comment/dto/comment.dto';

// @Controller('cms-comment')
// @ApiTags('cms-comment')
// // @UseGuards(JwtAuthGuard)
// // @ApiBearerAuth()
// export class CmsCommentController {
//   constructor(private readonly commentService: CommentService) {}

//   @Post('')
//   @ApiOperation({ summary: 'Create Comment' })
//   create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
//     // const { id: userId } = req.user;
//     return this.commentService.create(createCommentDto, '2');
//   }

//   @ApiOperation({ summary: 'get all comment by post' })
//   @Get('get-all-comment-by-post')
//   getAllCommentByPost(@Query('postId') postId: string) {
//     return this.commentService.getAllCommentByPost(postId);
//   }

//   @ApiOperation({ summary: 'update comment' })
//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() dto: UpdateCommentDtoCms,
//     @Req() req,
//   ) {
//     // const { id: userId } = req.user;
//     const isAdmin = true;
//     return this.commentService.update(id, dto, '2', isAdmin);
//   }

//   @ApiOperation({ summary: 'find One Comment' })
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.commentService.findOne(id);
//   }

//   @ApiOperation({ summary: 'Delete by admin' })
//   @Delete('delete/:id')
//   deleteByAdmin(@Param('id') id: DeleteCommentDto, @Req() req) {
//     // const { id: userId } = req.user;
//     return this.commentService.deleteByAdmin(id, '2');
//   }
// }
