export interface EmailProvider {
  sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    from?: string,
  ): Promise<any>;
}
