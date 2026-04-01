import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @Type()
  @IsInt()
  @Min(1)
  @Max(500)
  @ApiProperty({ default: 10 })
  @IsOptional()
  limit: number = 10;

  @Type()
  @IsInt()
  @Min(1)
  @ApiProperty({ default: 1 })
  page: number = 1;
}
