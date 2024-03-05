import { ApiProperty } from '@nestjs/swagger';
export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly totalCount: number;

  @ApiProperty()
  readonly totalUnread?: number = 0;
}
