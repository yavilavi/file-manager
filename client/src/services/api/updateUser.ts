/**
 * File Manager - Updateuser
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';

export interface UpdateUserPayload {
  id: number;
  name: string;
  email: string;
  password?: string;
  departmentId: number | string;
}

export const updateUser = async ({ id, name, email, password, departmentId }: UpdateUserPayload) => {
  const payload: Omit<UpdateUserPayload, 'id'> = {
    name,
    email,
    departmentId: Number(departmentId),
  };

  if (password) payload.password = password;

  const { data } = await apiCall.put(`/users/${id}`, payload);
  return data;
};
