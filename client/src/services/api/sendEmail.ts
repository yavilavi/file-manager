/**
 * File Manager - Sendemail
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
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
