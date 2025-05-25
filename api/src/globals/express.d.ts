/**
 * File Manager - Express.D
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { RequestUserInterface } from '@shared/interfaces/request-user-interface';

declare global {
  namespace Express {
    interface Request {
      user: RequestUserInterface;
      tenantId: string;
    }
  }
}
