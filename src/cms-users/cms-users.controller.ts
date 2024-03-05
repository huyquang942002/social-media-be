import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from 'src/services/users.service';
import { successMessage } from '../shared/utils';
import {
  CreateUserDto,
  DeleteUsersDto,
  SetPasswordDto,
  UpdateUserDto,
  UsersFilter,
} from './dto/users.dto';

@ApiTags('cms-users')
@Controller('cms-users')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class CmsUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiTags('Create Profile for user')
  async create(@Body() dto: CreateUserDto, @Req() req) {
    // const { id: userId } = req.user;
    const data = await this.usersService.create(dto, '2');
    return successMessage({ message: 'Updated Successfully', data });
  }

  @Get('get-users')
  async findAll(@Query() input: UsersFilter) {
    return await this.usersService.findAll(input);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ) {
    // const { id: userId } = req.user;
    const data = await this.usersService.update(id, dto, '2');
    return successMessage({ message: 'Updated Successfully', data });
  }

  @Delete('delete-users')
  async remove(@Body() dto: DeleteUsersDto, @Req() req) {
    // const { id: userId } = req.user;
    await this.usersService.remove(dto, '2');

    return successMessage({ message: 'Successfully deleted' });
  }

  @Patch('set-password/:userId')
  async setPassword(
    @Req() req,
    @Param('userId') userId: string,
    @Body() dto: SetPasswordDto,
  ) {
    // const { id: updatedBy } = req.user;
    await this.usersService.setPassword(userId, dto, '2');

    return successMessage({ message: 'Set password successfully' });
  }
}
