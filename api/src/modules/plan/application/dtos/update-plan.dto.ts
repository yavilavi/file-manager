import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

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

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
