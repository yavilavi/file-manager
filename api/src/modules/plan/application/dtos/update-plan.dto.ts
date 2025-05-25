/**
 * File Manager - update-plan.dto DTO
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  storageSize?: string; // Will be converted to BigInt

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  creditsIncluded?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
