import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';
import { AutoMap } from '@automapper/classes';
import { SpeciesEnum } from 'src/shared/pet.enum';

@Index('animals_pkey', ['id'], { unique: true })
@Entity('animals', { schema: 'public' })
export class Animals {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ default: null, nullable: true, name: 's3_image_pet' })
  s3ImagePet: string;

  @Column({ nullable: true, default: 'OTHERS', name: 'species' })
  species: SpeciesEnum;

  @AutoMap()
  @Column('character varying', { name: 'description', length: 1000 })
  description: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('bigint', { name: 'created_by', nullable: true })
  createdBy: string | null;

  @AutoMap()
  @OneToOne(() => Users)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdUser: Users | null;

  @Column('timestamp without time zone', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('bigint', { name: 'updated_by', nullable: true })
  updatedBy: string | null;

  @AutoMap()
  @OneToOne(() => Users)
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updatedUser: Users | null;

  @Column('timestamp without time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @Column('bigint', { name: 'deleted_by', nullable: true })
  deletedBy: string | null;

  @Column({
    name: 'date_of_birth',
    nullable: true,
    type: 'timestamp without time zone',
  })
  dateOfBirth: Date | null;

  @Column({ default: true })
  gender: string;

  @Column({ default: true, name: 'fur_color' })
  furColor: string;

  @Column({ default: true, name: 'name' })
  name: string;
}
