import { Column, Entity, Index } from 'typeorm';

@Index('user_devices_pkey', ['deviceId', 'userId'], { unique: true })
@Entity('user_devices', { schema: 'public' })
export class UserDevices {
  @Column('bigint', { primary: true, name: 'user_id' })
  userId: string;

  @Column('character varying', {
    primary: true,
    name: 'device_id',
    length: 255,
  })
  deviceId: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('character varying', {
    name: 'platform',
    nullable: true,
    length: 200,
    default: () => 'NULL::character varying',
  })
  platform: string | null;
}
