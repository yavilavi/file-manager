/**
 * File Manager - create-user.dto DTO
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Match } from '@shared/decorators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Match('password')
  confirmPassword: string;

  @IsNotEmpty()
  @IsNumber()
  departmentId: number;
}
