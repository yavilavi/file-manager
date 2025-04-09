import { z } from 'zod';

const companySchema = z.object({
  companyName: z.string().min(3, {
    message: 'El nombre de la empresa debe tener al menos 3 letras',
  }),
  nit: z
    .string()
    .min(6, {
      message: 'El NIT debe tener al menos 6 caractéres',
    })
    .max(15, {
      message: 'El NIT no puede tener más de 15 caractéres',
    }),
  subdomain: z
    .string()
    .min(4, { message: 'El subdominio debe tener al menos 4 caractéres' })
    .max(15, {
      message: 'El subdominio no puede tener más de 15 caractéres',
    }),
  departments: z
    .string()
    .array()
    .nonempty({ message: 'Debe definir al menos un departamento' }),
});

export default companySchema;
