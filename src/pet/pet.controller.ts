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

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PetService } from 'src/services/pet.service';
import { CreatePetDto, PetFilter, UpdatePetDto } from './dto/pet.dto';
import { successMessage } from 'src/shared/utils';

@Controller('pets')
@ApiTags('pets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PetController {
  constructor(private readonly petService: PetService) {}

  @ApiOperation({ summary: 'Create pet' })
  @Post()
  async create(@Body() dto: CreatePetDto, @Req() req) {
    const { id: userId } = req.user;
    return await this.petService.create(dto, userId);
  }

  @ApiOperation({ summary: 'Update have pet for user' })
  @Post('update-have-pet')
  async updateHavePet(@Req() req) {
    const { id: userId } = req.user;
    const data = await this.petService.updateHavePet(userId);
    return successMessage({
      message: 'Updated Successfully User Have Pet',
      data,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update pet' })
  async update(@Param('id') id: string, @Body() dto: UpdatePetDto, @Req() req) {
    const userId = req.user.id;
    const data = await this.petService.update(id, dto, userId);
    return successMessage({ message: 'Updated Pet', data });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pet' })
  async remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    await this.petService.remove(id, userId);

    return successMessage({ message: 'Deleted pet' });
  }

  @ApiOperation({ summary: 'Get all pet by user' })
  @Get('get-all-pets')
  async findAll(@Query() input: PetFilter) {
    return await this.petService.findAll(input);
  }

  @ApiOperation({ summary: 'Find pet by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petService.findOne(id);
  }
}
