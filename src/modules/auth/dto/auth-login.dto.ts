import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsAlphanumeric, IsString, Length } from 'class-validator';

export class AuthLoginDto {
  @Type()
  @IsString()
  @Length(5, 30)
  @IsAlphanumeric()
  @ApiProperty({ default: 'Johnnyyy' })
  username: string;

  @Type()
  @IsString()
  @ApiProperty({ default: 'password' })
  password: string;
}
