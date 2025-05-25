/**
 * File Manager - create-plan.dto DTO
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePlanDto {
  @ApiProperty({
    description: 'Plan name',
    example: 'Basic Plan',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Plan description',
    example: 'Basic plan with limited storage',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Storage size in bytes',
    example: '5368709120', // 5GB in bytes
  })
  @IsNotEmpty()
  storageSize: string; // Will be converted to BigInt

  @ApiProperty({
    description: 'Credits included with this plan',
    example: 100,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  creditsIncluded?: number;

  @ApiProperty({
    description: 'Whether the plan is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
