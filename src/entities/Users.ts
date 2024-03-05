import { AutoMap } from '@automapper/classes';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserCodes } from './UserCodes';
// import { Story } from './story';
// import { Expert } from './expert';
import { Post } from './post';
import { UserInteracts } from './UserInteracts';
// import { Conversations } from './conversation';

@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @AutoMap()
  @Column('character varying', {
    name: 'is_have_pet',
    default: false,
  })
  isHavePet: boolean | null;

  @AutoMap()
  @Column('character varying', { name: 'email', nullable: true, length: 100 })
  email: string | null;

  @AutoMap()
  @Column('text', { name: 'username', nullable: true })
  username: string | null;

  @AutoMap()
  @Column('character varying', { name: 'zipcode', nullable: true })
  zipcode: string | null;

  @Column('character varying', {
    name: 'password',
    nullable: true,
    length: 255,
  })
  password: string | null;

  @Column('character varying', {
    name: 's3_profile',
    nullable: true,
    length: 100,
  })
  s3Profile: string | null;

  @Column('character varying', {
    name: 'first_name',
    nullable: true,
    length: 255,
  })
  firstName: string | null;

  @Column('character varying', {
    name: 'last_name',
    nullable: true,
    length: 255,
  })
  lastName: string | null;

  @AutoMap()
  @Column('character varying', {
    name: 'phone_number',
    nullable: true,
    length: 100,
  })
  phoneNumber: string | null;

  @AutoMap()
  @Column('character varying', {
    name: 'address',
    nullable: true,
    length: 100,
  })
  address: string | null;

  @Column('boolean', {
    name: 'is_active_email',
    nullable: true,
    default: false,
  })
  isActiveEmail: boolean | null;

  // @Column('boolean', {
  //   name: 'is_active_phone',
  //   nullable: true,
  //   default: false,
  // })
  // isActivePhone: boolean | null;

  @Column('integer', { name: 'gender', nullable: true })
  gender: string | null;

  @Column('date', { name: 'dob', nullable: true })
  dob: string | null;

  @Column('boolean', { name: 'is_access_cms', default: false })
  isAccessCms: boolean | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('bigint', { name: 'created_by', nullable: true })
  createdBy: string | null;

  @Column('timestamp without time zone', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('bigint', { name: 'updated_by', nullable: true })
  updatedBy: string | null;

  @Column('timestamp without time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @Column('bigint', { name: 'deleted_by', nullable: true })
  deletedBy: string | null;

  @OneToMany(() => UserCodes, (userCodes) => userCodes.user)
  userCodes: UserCodes[];

  // User relationship: 1-n
  // @OneToMany(() => Story, (story) => story.user)
  // story: Story[];

  // Posts relationships: 1-n
  // @OneToMany(() => Post, (post) => post.users)
  // posts: Post[];

  // @OneToMany(() => GroupUsers, (groupUsers) => groupUsers.user)
  // groupUsers: GroupUsers[];

  // @OneToMany(() => Pets, (pet) => pet.user)
  // pet: Pets[];

  // @OneToOne(() => Expert, (expert) => expert.users)
  // expert: Expert;

  @OneToMany(() => UserInteracts, (userInteracts) => userInteracts.user)
  userInteracts: UserInteracts[];

  // @OneToMany(() => Conversations, (conversations) => conversations.users)
  // conversation: Conversations[];
}
