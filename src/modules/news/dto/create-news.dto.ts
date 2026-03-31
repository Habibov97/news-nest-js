import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class CreateNewsDto {
  @Type()
  @IsString()
  @Length(5, 100)
  @ApiProperty({ default: 'title' })
  title: string;

  @Type()
  @IsString()
  @Length(10, 10000)
  @ApiProperty({ default: 'content' })
  content: string;

  @Type()
  @IsString()
  @ApiProperty({ default: 'slug-data' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @IsOptional()
  slug: string;

  @Type()
  @IsUrl()
  @ApiProperty({
    default:
      'https://images.unsplash.com/photo-1673295716958-b1dc96e5b24f?q=80&w=2102&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  })
  thumbnail: string;

  @Type()
  @IsInt()
  @ApiProperty({ default: 1 })
  categoryId: number;
}
