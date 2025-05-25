/**
 * File Manager - update-company-plan.dto DTO
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCompanyPlanDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  planId?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
