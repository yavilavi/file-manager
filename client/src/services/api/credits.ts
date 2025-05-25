/**
 * File Manager - Credits
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios';
import { CompanyCredits, CreditTransaction } from '../../types/interfaces/company.interface';

export const fetchCompanyCredits = async (): Promise<CompanyCredits> => {
  const response = await apiCall.get<CompanyCredits>('/credits');
  return response.data;
};

export const fetchCreditTransactions = async (): Promise<CreditTransaction[]> => {
  const response = await apiCall.get<CreditTransaction[]>('/credits/transactions');
  return response.data;
};

export const purchaseCredits = async (data: {
  amount: number;
  description?: string;
}): Promise<CompanyCredits> => {
  const response = await apiCall.post<CompanyCredits>('/credits/purchase', data);
  return response.data;
};

export const useCredits = async (data: {
  amount: number;
  description?: string;
  referenceId?: number;
}): Promise<CompanyCredits> => {
  const response = await apiCall.post<CompanyCredits>('/credits/use', data);
  return response.data;
}; 