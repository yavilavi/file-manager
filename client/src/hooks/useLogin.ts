/**
 * File Manager - Uselogin
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
// hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../services/api/auth';

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
    },
  });
}
