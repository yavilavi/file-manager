import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDepartmentDto {
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
