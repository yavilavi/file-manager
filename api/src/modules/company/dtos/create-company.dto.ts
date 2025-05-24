import { IsNotEmpty, IsString, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { CreateDepartmentDto } from '@modules/department/dtos/create-department.dto';
import { Type } from 'class-transformer';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  nit: string;

  @IsNotEmpty()
  @IsString()
  tenantId: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateDepartmentDto)
  departments: CreateDepartmentDto[];
  
  @IsOptional()
  @IsNumber()
  planId?: number;
}
