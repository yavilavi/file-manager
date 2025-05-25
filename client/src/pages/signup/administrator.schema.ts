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
        message: 'El nombre del administrador debe tener al menos 6 caractÃ©res',
      })
      .max(15, {
        message:
          'El nombre del administrador no puede tener mÃ¡s de 15 caractÃ©res',
      }),
    adminEmail: z.string().email({ message: 'El email no es vÃ¡lido' }),
    adminPassword: z
      .string()
      .min(6, { message: 'La contraseÃ±a debe tener al menos 6 caractÃ©res' })
      .max(10, {
        message: 'La contraseÃ±a no puede tener mÃ¡s de 10 caractÃ©res',
      }),
    confirmPassword: z.string(),
    departmentId: z.number({
      required_error: 'Debes seleccionar un departamento',
      invalid_type_error: 'No se ha seleccionado un departamento vÃ¡lido',
    }),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: 'Las contraseÃ±as no coinciden',
    path: ['confirmPassword'],
  });

export default administratorSchema;
