/**
 * File Manager - Usesignup
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useMutation } from '@tanstack/react-query';
import { signup } from '../services/api/auth.ts';

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,
  });
};
