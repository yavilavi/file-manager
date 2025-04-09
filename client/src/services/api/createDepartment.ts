import apiCall from '../axios.ts';
import { DepartmentInterface } from '../../types/interfaces/user-interface.ts';

export const createDepartment = async (data: { name: string }) => {
  const response = await apiCall.post<DepartmentInterface>(
    '/departments',
    data,
  );
  return response.data;
};
