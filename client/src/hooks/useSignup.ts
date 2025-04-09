import { useMutation } from '@tanstack/react-query';
import { signup } from '../services/api/auth.ts';

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,
  });
};
