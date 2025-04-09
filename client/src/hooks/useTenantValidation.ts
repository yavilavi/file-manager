import { useQuery } from '@tanstack/react-query';
import { checkSubdomain } from '../services/api/checkSubdomain.ts';

function useTenantValidation() {
  const hostname = window.location.hostname;
  const tenant = hostname.split('.')[0]; // Asume: tenant.docma.yilmer.com

  return useQuery({
    queryKey: ['validate-tenant', tenant],
    queryFn: () => checkSubdomain(tenant),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export default useTenantValidation;
