// hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../services/api/auth';

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('atok', data.access_token);
    },
  });
}
