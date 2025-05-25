/**
 * File Manager - Signup DTO (Presentation Layer)
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { CreateCompanyDto } from '@modules/company/dtos/create-company.dto';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

/**
 * Signup DTO for API input
 * Part of presentation layer (interface adapters)
 */
export class SignupDto {
  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company: CreateCompanyDto;

  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
