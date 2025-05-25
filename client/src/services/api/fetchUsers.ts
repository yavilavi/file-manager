/**
 * File Manager - Fetchusers
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';
import { UserInterface } from '../../types/interfaces/user-interface.ts';

export const fetchUsers = async () => {
  const { data } = await apiCall.get<UserInterface[]>('/users');
  return data;
};
