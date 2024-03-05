import { AutoMap } from '@automapper/classes';
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
import { Interacts } from './interacts';
import { Post } from './post';

@Index('user_interacts_pkey', ['id'], { unique: true })
@Entity('user_interacts', { schema: 'public' })
export class UserInteracts {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @AutoMap()
  @Column('bigint', { name: 'entity_id', nullable: true })
  entityId: string | null;

  @AutoMap()
  @OneToOne(() => Post)
  @JoinColumn({ name: 'entity_id' })
  post: Post | null;

  @ManyToOne(() => Users, (users) => users.userInteracts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;

  @AutoMap()
  @Column('bigint', { name: 'user_id', nullable: true })
  userId: string;

  @AutoMap()
  @Column('character varying', {
    name: 'entity_name',
    nullable: true,
    length: 50,
    default: () => 'NULL::character varying',
  })
  entityName: string | null;

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

  @ManyToOne(() => Interacts, (interacts) => interacts.userInteracts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'interact_id', referencedColumnName: 'id' }])
  interact: Interacts;

  @AutoMap()
  @Column('bigint', { name: 'interact_id', nullable: true })
  interactId: string;
}
