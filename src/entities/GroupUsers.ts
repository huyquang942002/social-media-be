// import {
//   Column,
//   Entity,
//   Index,
//   JoinColumn,
//   ManyToOne,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Users } from './Users';
// import { AutoMap } from '@automapper/classes';
// import { Groups } from './group';

// @Index('group_users_pkey', ['id'], { unique: true })
// @Entity('group_users', { schema: 'public' })
// export class GroupUsers {
//   @AutoMap()
//   @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
//   id: string;

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

//   @ManyToOne(() => Groups, (groups) => groups.groupUsers, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn([{ name: 'group_id', referencedColumnName: 'id' }])
//   group: Groups;

//   @AutoMap()
//   @Column('bigint', { name: 'group_id', nullable: true })
//   groupId: string | null;

//   @ManyToOne(() => Users, (users) => users.groupUsers, { onDelete: 'CASCADE' })
//   @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
//   user: Users;

//   @AutoMap()
//   // @Column('bigint', { name: 'user_id', nullable: true })
//   userId: string | null;

//   @AutoMap()
//   @Column('int', { name: 'follow_status', nullable: true })
//   followStatus: string | null;
// }
