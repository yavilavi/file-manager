/**
 * File Manager - Createdepartment
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';
import { DepartmentInterface } from '../../types/interfaces/user-interface.ts';

export const createDepartment = async (data: { name: string }) => {
  const response = await apiCall.post<DepartmentInterface>(
    '/departments',
    data,
  );
  return response.data;
};
