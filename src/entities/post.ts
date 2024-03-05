import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { Users } from './Users';
// import { Groups } from './group';
import { PostGalleries } from './PostGalleries';
import { TagEnum } from 'src/shared/tag-enum';
import { AutoMap } from '@automapper/classes';
import { Comments } from './comment';

@Index('posts_pkey', ['id'], { unique: true })
@Entity('posts', { schema: 'public' })
export class Post {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @AutoMap()
  @Column({ nullable: true, default: null, name: 'content' })
  content: string;

  @AutoMap()
  @Column('character varying', {
    name: 'new_s3_links',
    default: null,
  })
  newS3Links: string;

  @AutoMap()
  @Column('character varying', {
    name: 'total_love',
    default: 0,
  })
  totalLove: string | null;

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
    name: 'tag',
    nullable: true,
  })
  tag: TagEnum | null;

  @AutoMap()
  @Column('character varying', {
    name: 'address',
    default: 0,
  })
  address: string | null;

  @AutoMap()
  @Column('character varying', {
    name: 'total_dis_love',
    default: 0,
  })
  totalDisLove: string | null;

  @AutoMap()
  @Column('character varying', {
    name: 'total_comment',
    default: 0,
  })
  totalComment: string | null;

  // @AutoMap()
  // @OneToOne(() => Users)
  // @JoinColumn({ name: 'original_create_by' })
  // originalCreateUser: Users | null;

  @AutoMap()
  @OneToMany(() => Comments, (comment) => comment.post)
  comment: Comments[];

  // @ManyToOne(() => Groups, (groups) => groups.posts)
  // @JoinColumn([{ name: 'group_id', referencedColumnName: 'id' }])
  // group: Groups;

  // @AutoMap()
  // @Column('bigint', { name: 'group_id', nullable: true })
  // groupId: string | null;

  @AutoMap()
  @OneToMany(() => PostGalleries, (PostGalleries) => PostGalleries.post)
  postGalleries: PostGalleries[];
}
