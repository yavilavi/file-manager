/**
 * File Manager - Application Bootstrap
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useQuery } from '@tanstack/react-query';
import { checkSubdomain } from '../services/api/checkSubdomain.ts';

export const useCheckSubdomain = (subdomain: string) => {
  return useQuery({
    queryKey: ['check-subdomain', subdomain],
    queryFn: () => checkSubdomain(subdomain),
    enabled: !!subdomain && subdomain.length >= 3,
    staleTime: 1000 * 10,
  });
};
