/**
 * File Manager - Updatedepartment
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios';
import { DepartmentInterface } from '../../types/interfaces/user-interface.ts';

export async function updateDepartment({ id, name }: Pick<DepartmentInterface, 'id' | 'name'>) {
  const res = await apiCall.patch(`/departments/${id}`, { name });
  return res.data;
}
