/**
 * File Manager - Plans
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';

export interface Plan {
  id: number;
  name: string;
  description: string;
  storageSize: string; // Using string for BigInt compatibility
  creditsIncluded: number; // Credits included with this plan
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyPlan {
  id: number;
  tenantId: string;
  planId: number;
  plan?: Plan;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  storageUsed: string; // Using string for BigInt compatibility
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyPlanDto {
  tenantId: string;
  planId: number;
  startDate?: string;
  endDate?: string;
}

export const fetchActivePlans = async (): Promise<Plan[]> => {
  const response = await apiCall.get<Plan[]>('/plans/active');
  return response.data;
};

export const fetchCompanyPlan = async (tenantId: string): Promise<CompanyPlan> => {
  const response = await apiCall.get<CompanyPlan>(`/company-plans/tenant/${tenantId}`);
  return response.data;
};