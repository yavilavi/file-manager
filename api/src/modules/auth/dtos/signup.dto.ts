import { CreateCompanyDto } from '@modules/company/dtos/create-company.dto';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class SignupDto {
  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company: CreateCompanyDto;

  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
