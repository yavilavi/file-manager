import { RequestUserInterface } from '@shared/interfaces/request-user-interface';

declare global {
  namespace Express {
    interface Request {
      user: RequestUserInterface;
      tenantId: string;
    }
  }
}
