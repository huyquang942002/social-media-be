// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
//   Req,
//   UseGuards,
// } from '@nestjs/common';
// import { GroupService } from '../services/group.service';
// import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// import {
//   CreateGroupDto,
//   GroupFilterDto,
//   UpdateGroupDto,
// } from 'src/cms-groups/dto/group.dto';
// import { successMessage } from 'src/shared/utils';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

// @ApiTags('group')
// @Controller('group')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
// export class GroupController {
//   constructor(private readonly groupService: GroupService) {}

//   @ApiOperation({ summary: 'Create Group' })
//   @Post()
//   async create(@Body() create: CreateGroupDto, @Req() req) {
//     const { id: userId } = req.user;
//     return await this.groupService.create(create, userId);
//   }

//   @ApiOperation({ summary: 'Update Group' })
//   @Patch(':id')
//   async update(
//     @Param('id') id: string,
//     @Body() updateGroupDto: UpdateGroupDto,
//     @Req() req,
//   ) {
//     const userId = req.user.id;
//     const isAdmin = false;
//     await this.groupService.update(id, updateGroupDto, userId, isAdmin);
//     return successMessage({ message: 'Updated Group' });
//   }

//   @ApiOperation({ summary: 'Delete Group' })
//   @Delete(':id')
//   async delete(@Param('id') id: string, @Req() req) {
//     const userId = req.user.id;
//     const isAdmin = false;
//     await this.groupService.delete(id, userId, isAdmin);
//     return successMessage({ message: 'Deleted Group' });
//   }

//   //  Search by tag ,content of post
//   // Get all user in group
//   @ApiOperation({
//     summary: 'Get all posts in group ',
//   })
//   @Get('/get-posts-by-group-id')
//   async getAllPostInGroup(@Query() input: GroupFilterDto) {
//     return await this.groupService.getAllPostInGroup(input);
//   }

//   @ApiOperation({ summary: 'Upload avatar' })
//   @Get('upload-avatar')
//   async presignedUrlPictureProfile(@Query('groupId') groupId: string) {
//     const data = await this.groupService.presignedUrlAvatar(groupId);
//     return successMessage({ data: data });
//   }
// }
