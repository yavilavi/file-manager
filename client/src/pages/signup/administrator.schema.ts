import { z } from 'zod';

const administratorSchema = z
  .object({
    adminName: z
      .string()
      .min(6, {
        message: 'El nombre del administrador debe tener al menos 6 caractéres',
      })
      .max(15, {
        message:
          'El nombre del administrador no puede tener más de 15 caractéres',
      }),
    adminEmail: z.string().email({ message: 'El email no es válido' }),
    adminPassword: z
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caractéres' })
      .max(10, {
        message: 'La contraseña no puede tener más de 10 caractéres',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export default administratorSchema;
