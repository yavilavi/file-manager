import { Plan } from "../../services/api/plans";

export interface CompanyCredits {
  id: number;
  tenantId: string;
  totalPurchased: number;
  currentBalance: number;
  lastPurchaseAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  id: number;
  transactionType: 'PURCHASE' | 'USAGE';
  amount: number;
  description: string | null;
  tenantId: string;
  referenceId: number | null;
  createdAt: string;
}

export interface CompanyInfo {
  id: number;
  name: string;
  nit: string;
  tenantId: string;
  canSendEmail: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CompanyData {
  company: CompanyInfo;
  plan?: {
    id: number;
    tenantId: string;
    planId: number;
    plan: Plan;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    storageUsed: string;
    createdAt: string;
    updatedAt: string;
  };
  credits?: CompanyCredits;
} 