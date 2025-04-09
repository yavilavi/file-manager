import apiCall from '../axios';
import { DepartmentInterface } from '../../types/interfaces/user-interface.ts';

export async function updateDepartment({ id, name }: Pick<DepartmentInterface, 'id' | 'name'>) {
  const res = await apiCall.patch(`/departments/${id}`, { name });
  return res.data;
}
