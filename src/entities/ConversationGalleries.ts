// import { AutoMap } from '@automapper/classes';
// import {
//   Column,
//   Entity,
//   Index,
//   JoinColumn,
//   ManyToOne,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Post } from './post';
// import { Conversations } from './conversation';
// import { Users } from './Users';

// @Index('conversation_galleries_pkey', ['id'], { unique: true })
// @Entity('conversation_galleries', { schema: 'public' })
// export class ConversationGalleries {
//   @AutoMap()
//   @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
//   id: string;

//   @AutoMap()
//   @Column('character varying', { name: 'name', length: 500 })
//   name: string | null;

//   @AutoMap()
//   @Column({ name: 'is_ghim', nullable: true, default: false })
//   isGhim: boolean | null;

//   @Column('timestamp without time zone', {
//     name: 'created_at',
//     nullable: true,
//     default: () => 'CURRENT_TIMESTAMP',
//   })
//   createdAt: Date | null;

//   @Column('bigint', { name: 'created_by', nullable: true })
//   createdBy: string | null;

//   @AutoMap()
//   @OneToOne(() => Users)
//   @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
//   createdUser: Users | null;

//   @Column('timestamp without time zone', { name: 'updated_at', nullable: true })
//   updatedAt: Date | null;

//   @Column('bigint', { name: 'updated_by', nullable: true })
//   updatedBy: string | null;

//   @AutoMap()
//   @OneToOne(() => Users)
//   @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
//   updatedUser: Users | null;

//   @AutoMap()
//   @Column('timestamp without time zone', { name: 'deleted_at', nullable: true })
//   deletedAt: Date | null;

//   @AutoMap()
//   @Column('bigint', { name: 'deleted_by', nullable: true })
//   deletedBy: string | null;

//   @ManyToOne(
//     () => Conversations,
//     (conversations) => conversations.conversationsGalleries,
//     {
//       onDelete: 'CASCADE',
//     },
//   )
//   @JoinColumn([{ name: 'conversation_id', referencedColumnName: 'id' }])
//   conversations: Conversations;

//   @AutoMap()
//   @Column('bigint', { name: 'conversation_id', nullable: true })
//   conversationId: string;
// }
