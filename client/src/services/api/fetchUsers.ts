import apiCall from '../axios.ts';
import { UserInterface } from '../../types/interfaces/user-interface.ts';

export const fetchUsers = async () => {
  const { data } = await apiCall.get<UserInterface[]>('/users');
  return data;
};
