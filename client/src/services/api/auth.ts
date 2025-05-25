/**
 * File Manager - Auth
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';
import { UserInterface } from '../../types/interfaces/user-interface.ts';

export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  const response = await apiCall.post<{
    access_token: string;
  }>('/auth/login', credentials);
  return response.data;
};

export const validateToken = async () => {
  const { data } = await apiCall.get<UserInterface>('/auth/me');
  return data;
};

export const signup = async (data: {
  company: {
    name: string;
    nit: string;
    tenantId: string;
    departments: { name: string }[];
    planId?: number;
  };
  user: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    departmentId?: number;
  };
}) => {
  const response = await apiCall.post('/auth/signup', data);
  return response.data;
};
