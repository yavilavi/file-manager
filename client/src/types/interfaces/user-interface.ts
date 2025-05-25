/**
 * File Manager - User Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { RoleInterface } from './role-interface';

export interface DepartmentInterface {
  id: number;
  name: string;
  createdAt: string;
}

interface CompanyInterface {
  id: number;
  name: string;
  nit: string;
  tenantId: string;
}

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string; // o Date si haces parsing
  updatedAt: string; // o Date
  department: DepartmentInterface;
  company: CompanyInterface;
  roles?: RoleInterface[];
  canSendEmail: boolean;
}
