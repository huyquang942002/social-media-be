import { Module } from '@nestjs/common';
import { PetService } from '../services/pet.service';
import { PetController } from './pet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animals } from 'src/entities/pet';
import { Users } from 'src/entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([Animals, Users])],
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}
