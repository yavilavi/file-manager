/**
 * File Manager - Fetchdepartments
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';
import { DepartmentInterface } from '../../types/interfaces/user-interface.ts';

export const fetchDepartments = async () => {
  const { data } = await apiCall.get<DepartmentInterface[]>('/departments');
  return data;
};
