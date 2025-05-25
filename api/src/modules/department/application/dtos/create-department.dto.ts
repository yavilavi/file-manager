/**
 * File Manager - create-department.dto DTO
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDepartmentDto {
  @IsNotEmpty({ message: 'El nombre del departamento es requerido' })
  @IsString({ message: 'El nombre del departamento debe ser texto' })
  @Length(2, 255, {
    message: 'El nombre del departamento debe tener entre 2 y 255 caracteres',
  })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name: string;
}
