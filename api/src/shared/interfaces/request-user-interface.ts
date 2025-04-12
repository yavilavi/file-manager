import { User, Department } from '@prisma/client';

export interface RequestUserInterface {
  data: Omit<User, 'password' | 'deletedAt'>;
  department: Pick<Department, 'name' | 'id'> | null;
}
