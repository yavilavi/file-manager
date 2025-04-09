import apiCall from '../axios.ts';
import { DepartmentInterface } from '../../types/interfaces/user-interface.ts';

export const fetchDepartments = async () => {
  const { data } = await apiCall.get<DepartmentInterface[]>('/departments');
  return data;
};
