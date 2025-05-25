/**
 * File Manager - Company.Schema
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { z } from 'zod';

const companySchema = z.object({
  companyName: z.string().min(3, {
    message: 'El nombre de la empresa debe tener al menos 3 letras',
  }),
  nit: z
    .string()
    .min(6, {
      message: 'El NIT debe tener al menos 6 caracteres',
    })
    .max(15, {
      message: 'El NIT no puede tener más de 15 caracteres',
    }),
  subdomain: z
    .string()
    .min(4, { message: 'El subdominio debe tener al menos 4 caracteres' })
    .max(15, {
      message: 'El subdominio no puede tener más de 15 caracteres',
    }),
  departments: z
    .string()
    .array()
    .nonempty({ message: 'Debe definir al menos un departamento' }),
});

export default companySchema;
