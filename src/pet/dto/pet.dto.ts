import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/shared/pagination/page-option.dto';
import { SpeciesEnum } from 'src/shared/pet.enum';

export class CreatePetDto {
  @ApiProperty()
  s3ImagePet: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty({ description: 'MALE/FEMALE', default: 'MALE' })
  gender: string;

  @ApiProperty()
  furColor: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: SpeciesEnum, description: 'DOG/CAT/BIRD,OTHERS' })
  species: SpeciesEnum;
}

export class PetFilter extends OmitType(PageOptionsDto, ['order'] as const) {
  @ApiProperty({ required: true, enum: SpeciesEnum })
  species: SpeciesEnum;

  @ApiProperty({ required: true })
  userId: string;
}

export class deletePetDto {
  @ApiProperty({ required: true })
  ids: string[];
}

export class UpdatePetDto extends CreatePetDto {
  @ApiProperty({ required: false })
  isRemoveImage: boolean | null;
}
