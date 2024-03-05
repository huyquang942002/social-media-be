import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { Users } from './Users';
import { AutoMap } from '@automapper/classes';

@Index('friends_pkey', ['id'], { unique: true })
@Entity('friends', { schema: 'public' })
export class Friend {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'sender_id', nullable: true })
  senderId: string;

  @AutoMap()
  @OneToOne(() => Users)
  @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
  senderUser: Users | null;

  @Column('bigint', { name: 'receiver_id', nullable: true })
  receiverId: string;

  @AutoMap()
  @OneToOne(() => Users)
  @JoinColumn({ name: 'receiver_id', referencedColumnName: 'id' })
  receiverUser: Users | null;

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
}
