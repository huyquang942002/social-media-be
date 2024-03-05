import { ApiProperty } from '@nestjs/swagger';

export interface IFullAuditDto {
  createdAt: Date;

  createdBy: string | null;

  updatedAt: Date | null;

  updatedBy: string | null;

  deletedAt: Date | null;

  deletedBy: string | null;
}
