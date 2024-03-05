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
// import { PostService } from '../services/post.service';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
// import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { successMessage } from 'src/shared/utils';
// import {
//   CreatePostDtoCms,
//   PostFilterDto,
//   PostHavePostFilterDto,
//   UpdatePostDtoCms,
// } from 'src/posts/dto/post.dto';

// @Controller('cms-posts')
// @ApiTags('cms-posts')
// // @UseGuards(JwtAuthGuard)
// // @ApiBearerAuth()
// export class CmsPostController {
//   constructor(private readonly postService: PostService) {}

//   @ApiOperation({ summary: 'Create post' })
//   @Post()
//   async create(@Body() dto: CreatePostDtoCms) {
//     // const { id: userId } = req.user;
//     return await this.postService.create(dto, '2');
//   }

//   @Patch(':id')
//   @ApiOperation({ summary: 'Update post' })
//   async update(
//     @Param('id') id: string,
//     @Body() dto: UpdatePostDtoCms,
//     @Req() req,
//   ) {
//     // const userId = req.user.id;
//     const isAdmin = true;
//     const data = await this.postService.update(id, dto, '2', isAdmin);
//     return successMessage({ message: 'Updated  Post', data });
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete post' })
//   async delete(@Param('id') id: string, @Req() req) {
//     // const userId = req.user.id;
//     const isAdmin = true;
//     await this.postService.delete(id, '2', isAdmin);

//     return successMessage({ message: 'Deleted Post' });
//   }

//   // // Have get all post by tag ^^
//   // @Get('get-all-posts')
//   // @ApiOperation({ summary: 'Get all post in new feed (Filter by tag)' })
//   // async findAll(@Query() input: PostFilterDto) {
//   //   return await this.postService.findAll(input);
//   // }

//   // @ApiOperation({ summary: 'Get all post post by User' })
//   // @Get('get-all-posts-by-User')
//   // async getAllPostByUser(@Query() input: PostHavePostFilterDto, @Req() req) {
//   //   // const { id: userId } = req.user;
//   //   return await this.postService.getAllPostByUser(input, '2');
//   // }

//   @ApiOperation({ summary: 'Find post by id' })
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.postService.findOne(id);
//   }
// }
