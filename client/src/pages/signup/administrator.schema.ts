/**
 * File Manager - Administrator.Schema
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { z } from 'zod';

const administratorSchema = z
  .object({
    adminName: z
      .string()
      .min(6, {
        message: 'El nombre del administrador debe tener al menos 6 caracteres',
      })
      .max(15, {
        message:
          'El nombre del administrador no puede tener más de 15 caracteres',
      }),
    adminEmail: z.string().email({ message: 'El email no es válido' }),
    adminPassword: z
      .string()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
      .max(12, {
        message: 'La contraseña no puede tener más de 12 caracteres',
      }),
    departmentId: z
      .number({
        invalid_type_error: 'No se ha seleccionado un departamento válido',
      })
      .nonnegative(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export default administratorSchema;
