import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Post } from './post';
import { Users } from './Users';

@Index('comments_pkey', ['id'], { unique: true })
@Entity('comments', { schema: 'public' })
export class Comments {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @AutoMap()
  @Column({ nullable: true, default: null })
  content: string;

  @AutoMap()
  @Column('character varying', {
    name: 'comment_id',
    nullable: true,
  })
  commentId: string | null;

  @AutoMap()
  @Column('character varying', {
    name: 'comment_image_name',
    nullable: true,
  })
  commentImageName: string | null;

  @AutoMap()
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

  @AutoMap()
  @Column('timestamp without time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @AutoMap()
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

  // @AutoMap()
  // @Column({ default: 0, nullable: true, name: 'love' })
  // love: string;

  // @AutoMap()
  // @Column({ default: 0, nullable: true, name: 'dis_love' })
  // disLove: string;

  @AutoMap()
  @Column('character varying', {
    name: 'total_comment',
    default: 0,
  })
  totalComment: string | null;

  @AutoMap()
  @ManyToOne(() => Post, (post) => post.comment)
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;

  @AutoMap()
  @Column('bigint', { name: 'post_id', nullable: true })
  postId: string | null;
}
