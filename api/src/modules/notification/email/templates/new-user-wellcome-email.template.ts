/**
 * File Manager - New User Wellcome Email.Template
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';

const buildNewUserWelcomeEmail = (
  user: CreateUserDto,
  company: string,
  appUrl: string,
): string => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
    <div style="text-align: center;">
      <img src="https://minio.docma.yilmer.com/assets/docma-logo.png" alt="Logo de Docma" style="width: 100px; margin-bottom: 16px;" />
      <h2 style="color: #2c3e50;">¡Hola ${user.name}, tu cuenta ha sido creada!</h2>
    </div>

    <p style="font-size: 16px; color: #333;">
      <strong>${company}</strong> ha creado una cuenta para ti en su espacio de trabajo en <strong>Docma</strong>.
    </p>

    <p style="font-size: 16px; color: #333;">
      A continuación encontrarás los detalles para iniciar sesión:
    </p>

    <ul style="font-size: 16px; color: #333; padding-left: 16px;">
      <li><strong>Correo electrónico:</strong> ${user.email}</li>
      <li><strong>Contraseña:</strong> ${user.password}</li>
    </ul>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${appUrl}" 
         style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
         Ir al panel de Docma
      </a>
    </div>

    <p style="font-size: 14px; color: #555;">
      Si tienes problemas para acceder, asegúrate de usar el correo indicado y verifica tu contraseña.
    </p>

    <hr style="margin: 32px 0;" />
    <p style="font-size: 12px; color: #aaa; text-align: center;">
      Este mensaje fue enviado automáticamente por Docma. Por favor, no respondas a este correo.
    </p>
  </div>
`;

export default buildNewUserWelcomeEmail;
