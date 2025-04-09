import { User } from '@prisma/client';

export interface RequestUserInterface {
  data: Omit<User, 'password' | 'deletedAt'>;
}
