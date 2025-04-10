import apiCall from '../axios.ts';

interface SendEmailDTO {
  to: string;
  subject: string;
  body: string;
}


export const sendEmail = async ({ to, subject, body }: SendEmailDTO) => {
  const response = await apiCall.post('/email-notification/send-email', { to, subject, body });
  return response.data;
};
