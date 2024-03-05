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
import { Post } from './post';
import { Users } from './Users';

@Index('post_galleries_pkey', ['id'], { unique: true })
@Entity('post_galleries', { schema: 'public' })
export class PostGalleries {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @AutoMap()
  @Column('character varying', { name: 'link', length: 500 })
  link: string | null;

  @AutoMap()
  @Column('character varying', { name: 'name', length: 500 })
  name: string | null;

  @AutoMap()
  @Column('character varying', { name: 'description', length: 5000 })
  description: string | null;

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

  @ManyToOne(() => Post, (Post) => Post.postGalleries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;

  @AutoMap()
  @Column('bigint', { name: 'post_id', nullable: true })
  postId: string;
}
