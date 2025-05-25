/**
 * File Manager - email.provider.interface Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
export interface EmailProvider {
  sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    from?: string,
  ): Promise<any>;
}
