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

@Index('request_friends_pkey', ['id'], { unique: true })
@Entity('request_friends', { schema: 'public' })
export class FriendRequest {
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
}
