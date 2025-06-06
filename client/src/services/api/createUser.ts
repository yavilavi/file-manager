﻿/**
 * File Manager - Createuser
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';
import { UserInterface } from '../../types/interfaces/user-interface.ts';

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  departmentId: number;
}

export const createUser = async (payload: CreateUserPayload) => {
  const { data } = await apiCall.post<UserInterface>('/users', payload);
  return data;
};
