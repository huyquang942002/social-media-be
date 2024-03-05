import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TypeGhim } from 'src/shared/conversation.enum';
import { PageOptionsDto } from 'src/shared/pagination/page-option.dto';

export class CreateConversationDto {
  @ApiProperty({ required: true })
  receiverId: string | null;

  @ApiProperty({ required: false, description: 'parent message' })
  conversationId: string | null;

  @ApiProperty({ required: false })
  content: string | null;

  @ApiProperty({ required: false })
  file;
}

export class DeleteConversationDto {
  @ApiProperty({ required: true })
  id: string | null;
}

export class GhimMessageDto {
  @ApiProperty({ required: true })
  id: string | null;

  @ApiProperty({ required: true, enum: TypeGhim, description: 'TEXT/IMAGE' })
  typeGhim: TypeGhim;

  @ApiProperty({ required: true })
  isGhim: boolean | null;
}

export class DetailConversationFilter extends OmitType(PageOptionsDto, [
  'order',
] as const) {
  @ApiProperty({ required: true })
  receiverId: string | null;
}

export class ListConversationFilter extends OmitType(PageOptionsDto, [
  'order',
] as const) {}
