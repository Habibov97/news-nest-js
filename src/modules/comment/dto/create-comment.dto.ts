import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @Type()
  @IsString()
  @Length(5, 500)
  @ApiProperty({ default: 'content' })
  content: string;
}
