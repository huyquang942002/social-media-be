import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { PET_USER_ID } from 'src/constant/upload.constant';
import { Users } from 'src/entities/Users';
import { Animals } from 'src/entities/pet';
import { CreatePetDto, PetFilter, UpdatePetDto } from 'src/pet/dto/pet.dto';
import { PageMetaDto } from 'src/shared/pagination/page-meta.dto';
import { PaginationDto } from 'src/shared/pagination/pagination.dto';
import { SpeciesEnum, genderPet } from 'src/shared/pet.enum';
import { getS3Presigned, getSkip } from 'src/shared/utils';
import { In, IsNull, Repository } from 'typeorm';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Animals)
    private petRepository: Repository<Animals>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly configService: ConfigService,
  ) {}

  async updateHavePet(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository.save({
      ...user,
      isHavePet: true,
    });
  }

  public async presignedUrlPetMedia(fileNames: string, userId: string) {
    return getS3Presigned(
      fileNames,
      `${PET_USER_ID}_${userId}`,
      this.configService,
    );
  }

  async create(dto: CreatePetDto, createdBy: string) {
    const { s3ImagePet } = dto;

    const pet = await this.petRepository.create({
      ...dto,
      createdBy,
    });

    pet.s3ImagePet = s3ImagePet
      ? await this.presignedUrlPetMedia(s3ImagePet, createdBy)
      : '';

    return await this.petRepository.save(pet);
  }

  async update(id: string, dto: UpdatePetDto, updatedBy: string) {
    const { s3ImagePet, isRemoveImage } = dto;

    const pet = await this.petRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!pet) {
      throw new HttpException('PET not found', HttpStatus.BAD_REQUEST);
    }
    if (isRemoveImage) {
      pet.s3ImagePet = '';
    }
    let newS3Link;
    if (s3ImagePet) {
      newS3Link = await this.presignedUrlPetMedia(s3ImagePet, updatedBy);
    }

    const petSaved = await this.petRepository.save({
      ...pet,
      ...dto,
      updatedAt: moment().format(),
      updatedBy,
    });

    console.log('newS3Link', newS3Link);

    return { petSaved, newS3Link };
  }

  async findOne(id: string) {
    return await this.petRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
      relations: ['createdUser', 'updatedUser'],
    });
  }
  async findAll(input: PetFilter) {
    const { page, take, species, userId } = input;
    const [pet, count] = await this.petRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.createdUser', 'u', 'u.deletedAt is null')
      .leftJoinAndSelect('p.updatedUser', 'us', 'us.deletedAt is null')
      .where(
        'p.deletedAt is null and p.createdBy = :createdBy and p.species = :species',
        {
          createdBy: userId,
          species,
        },
      )
      .orderBy('p.id', 'DESC')
      .take(take)
      .skip(getSkip({ page, take }))
      .getManyAndCount();
    return new PaginationDto(pet, <PageMetaDto>{
      page,
      take,
      totalCount: count,
    });
  }

  async remove(id: string, deletedBy: string) {
    return await this.petRepository.update(
      {
        id,
        createdBy: deletedBy,
      },
      {
        deletedAt: moment().format(),
        deletedBy,
      },
    );
  }
}
