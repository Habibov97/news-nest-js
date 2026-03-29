import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateCategoryDto {
  @Type()
  @IsString()
  @Length(5, 100)
  @ApiProperty({ default: 'category-name' })
  name: string;

  @Type()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @ApiProperty({ default: 'slug-data' })
  @IsOptional()
  slug: string;
}
