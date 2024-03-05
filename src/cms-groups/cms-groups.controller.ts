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
// } from './dto/group.dto';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
// import { successMessage } from 'src/shared/utils';

// @ApiTags('cms-group')
// @Controller('cms-group')
// // @UseGuards(JwtAuthGuard)
// // @ApiBearerAuth()
// export class CmsGroupsController {
//   constructor(private readonly groupService: GroupService) {}

//   @ApiOperation({ summary: 'Create Group' })
//   @Post()
//   async create(@Body() create: CreateGroupDto, @Req() req) {
//     // const { id: userId } = req.user;
//     return await this.groupService.create(create, '2');
//   }

//   @ApiOperation({ summary: 'Update Group' })
//   @Patch(':id')
//   async update(
//     @Param('id') id: string,
//     @Body() updateGroupDto: UpdateGroupDto,
//     @Req() req,
//   ) {
//     // const userId = req.user.id;
//     const isAdmin = true;
//     await this.groupService.update(id, updateGroupDto, '2', isAdmin);
//     return successMessage({ message: 'Updated Group' });
//   }

//   @ApiOperation({ summary: 'Delete Group' })
//   @Delete(':id')
//   async delete(@Param('id') id: string, @Req() req) {
//     // const userId = req.user.id;
//     const isAdmin = false;
//     await this.groupService.delete(id, '2', isAdmin);
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

//   @ApiOperation({
//     summary: 'Get all group ',
//   })
//   @Get('/get-all-groups')
//   async findAll(@Query() input: GroupFilterDto) {
//     return await this.groupService.findAll(input);
//   }

//   @ApiOperation({
//     summary: 'Find Post By ID',
//   })
//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return await this.groupService.findOne(id);
//   }
// }
