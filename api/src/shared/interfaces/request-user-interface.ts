import { User, Department } from '@prisma/client';

export interface RequestUserInterface {
  data: Omit<User, 'password' | 'deletedAt'> & {
    tenantId: string;
    departmentId: number | null;
    canSendEmail: boolean;
  };
  department: Pick<Department, 'name' | 'id'> | null;
}
