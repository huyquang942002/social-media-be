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
import { Users } from './Users';
import { AutoMap } from '@automapper/classes';

@Index('conversations_pkey', ['id'], { unique: true })
@Entity('conversations', { schema: 'public' })
export class Conversations {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'sender_id', nullable: false })
  senderId: string;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
  senderUser: Users | null;

  @Column('bigint', { name: 'conversation_id', nullable: true })
  conversationId: string | null;

  @Column('bigint', { name: 'receiver_id', nullable: false })
  receiverId: string;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'receiver_id', referencedColumnName: 'id' })
  receiverUser: Users | null;

  @Column('character varying', {
    name: 'content',
    nullable: true,
  })
  content: string;

  @Column({ nullable: true, default: false, name: 'is_ghim' })
  isGhim: boolean;

  @Column({ nullable: true, default: false, name: 'is_hide' })
  isHide: boolean;

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

  @AutoMap()
  @Column('character varying', {
    name: 'total_love',
    default: 0,
  })
  totalLove: string | null;

  @AutoMap()
  @Column('character varying', {
    name: 'total_dis_love',
    default: 0,
  })
  totalDisLove: string | null;

  @Column({ default: false, name: 'is_mark' })
  isMark: boolean;

  @Column({ default: false, name: 'is_read' })
  isRead: boolean;

  // @OneToMany(
  //   () => ConversationGalleries,
  //   (conversationGalleries) => conversationGalleries.conversations,
  // )
  // conversationsGalleries: ConversationGalleries[];

  @Column({ default: false, name: 'conversations_gallerie' })
  conversationsGalleries: string;
}
