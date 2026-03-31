import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class NewsListDto {
  @Type()
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({ default: 1, required: false })
  category: number;
}
