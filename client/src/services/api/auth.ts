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
