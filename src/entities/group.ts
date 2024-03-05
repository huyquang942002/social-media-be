// import {
//   Entity,
//   OneToMany,
//   Column,
//   PrimaryGeneratedColumn,
//   OneToOne,
//   JoinColumn,
//   Index,
// } from 'typeorm';
// import { Post } from './post';
// import { GroupUsers } from './GroupUsers';
// import { AutoMap } from '@automapper/classes';
// import { Users } from './Users';

// @Index('groups_pkey', ['id'], { unique: true })
// @Entity('groups', { schema: 'public' })
// export class Groups {
//   @PrimaryGeneratedColumn()
//   id: string;

//   @Column()
//   name: string;

//   @Column('timestamp without time zone', {
//     name: 'created_at',
//     nullable: true,
//     default: () => 'CURRENT_TIMESTAMP',
//   })
//   createdAt: Date | null;

//   @Column('bigint', { name: 'created_by', nullable: true })
//   createdBy: string | null;

//   @Column('timestamp without time zone', { name: 'updated_at', nullable: true })
//   updatedAt: Date | null;

//   @Column('bigint', { name: 'updated_by', nullable: true })
//   updatedBy: string | null;

//   @Column('timestamp without time zone', { name: 'deleted_at', nullable: true })
//   deletedAt: Date | null;

//   @Column('bigint', { name: 'deleted_by', nullable: true })
//   deletedBy: string | null;

//   @OneToMany(() => Post, (post) => post.group)
//   posts: Post[];

//   @Column({ name: 'is_public', default: true })
//   isPublic: boolean;

//   @Column({ default: null, nullable: true, name: 'image_group' })
//   imageGroup: string;

//   @Column('character varying', {
//     name: 'group_role',
//     nullable: true,
//     length: 255,
//   })
//   groupRole: string | null;

//   @OneToMany(() => GroupUsers, (groupUsers) => groupUsers.group)
//   groupUsers: GroupUsers[];
// }
