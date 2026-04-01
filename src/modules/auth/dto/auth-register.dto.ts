import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UserGender, UserRole } from 'src/modules/user/user.types';

export class AuthRegisterDto {
  @Type()
  @IsString()
  @Length(5, 30)
  @IsAlphanumeric()
  @ApiProperty({ default: 'Johnnyyyyy' })
  username: string;

  @Type()
  @IsString()
  @MinLength(6)
  @ApiProperty({ default: '1234565' })
  password: string;

  @Type()
  @IsEnum(UserGender)
  @ApiProperty({ default: UserGender.MALE })
  gender: UserGender;

  @Type()
  @IsString()
  @IsOptional()
  @ApiProperty({ nullable: true, default: 'John Doe' })
  fullName: string;

  @Type()
  @IsEnum(UserRole)
  @ApiProperty({ default: UserRole.GUEST })
  role: UserRole;
}
