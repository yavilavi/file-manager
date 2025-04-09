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
