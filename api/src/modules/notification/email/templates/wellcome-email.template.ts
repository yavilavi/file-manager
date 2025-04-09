const buildWelcomeEmailTemplate = (
  name: string,
  company: string,
  appUrl: string,
): string => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
    <div style="text-align: center;">
      <img src="https://minio.docma.yilmer.com/assets/docma-logo.png" alt="Docma Logo" style="width: 100px; margin-bottom: 16px;" />
      <h2 style="color: #2c3e50;">¡Bienvenido a Docma, ${name}!</h2>
    </div>
    
    <p style="font-size: 16px; color: #333;">
      Gracias por registrar <strong>${company}</strong> en Docma. Estamos emocionados de tenerte a bordo.
    </p>

    <p style="font-size: 16px; color: #333;">
      Desde ahora puedes comenzar a gestionar tus documentos y procesos empresariales de forma eficiente y segura.
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${appUrl}" 
         style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
         Ir al panel
      </a>
    </div>

    <p style="font-size: 14px; color: #777;">
      ¿Necesitas ayuda? Contáctanos en <a href="mailto:yilmer@avila.dev">soporte@yilmer@avila.dev</a>.
    </p>

    <hr style="margin: 32px 0;" />
    <p style="font-size: 12px; color: #aaa; text-align: center;">
      Este mensaje fue enviado automáticamente por Docma. No respondas a este correo.
    </p>
  </div>
`;
export default buildWelcomeEmailTemplate;
