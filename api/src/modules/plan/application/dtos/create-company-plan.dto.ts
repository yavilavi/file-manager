import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanyPlanDto {
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsNumber()
  @Type(() => Number)
  planId: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
