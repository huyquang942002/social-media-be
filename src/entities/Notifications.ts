import { AutoMap } from '@automapper/classes';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';
// import { Groups } from './group';

@Index('notifications_pkey', ['id'], { unique: true })
@Index('notifications_type_index', ['type'], {})
@Entity('notifications', { schema: 'public' })
export class Notifications {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @AutoMap()
  @Column('character varying', { name: 'type', length: 100 })
  type: string;

  @AutoMap()
  @Column('character varying', { name: 'data', length: 1000 })
  data: string;

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

  @AutoMap()
  @Column('boolean', {
    name: 'is_readed',
    nullable: true,
    default: () => 'false',
  })
  isReaded: boolean | null;

  @AutoMap()
  @Column('bigint', { name: 'user_id', nullable: true })
  userId: string | null;

  @AutoMap()
  @Column('bigint', { name: 'action_user_id', nullable: true })
  actionUserId: string | null;

  @AutoMap()
  @OneToOne(() => Users)
  @JoinColumn({ name: 'action_user_id' })
  actionUser: Users | null;

  // @AutoMap()
  // @Column('bigint', { name: 'group_id', nullable: true })
  // groupId: string | null;

  // @AutoMap()
  // @OneToOne(() => Groups)
  // @JoinColumn({ name: 'group_id' })
  // group: Groups | null;

  @AutoMap()
  @Column('character varying', { name: 'additional_data' })
  additionalData: string;
}
