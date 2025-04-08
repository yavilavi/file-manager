export interface UserInterface {
  id: number;
  name: string;
  email: string;
  tenantId: string;
  departmentId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
