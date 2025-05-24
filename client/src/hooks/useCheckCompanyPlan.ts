import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { useFetchCompanyPlan } from './usePlans';

/**
 * Hook to check if a company has an active plan
 * If not, it will redirect to the plan selection page
 * @param tenantId The company's tenant ID
 * @param excludedPaths Paths that should not trigger the plan check
 */
export function useCheckCompanyPlan(
  tenantId: string,
  excludedPaths: string[] = ['/select-plan']
) {
  const { data: companyPlan, error, isLoading } = useFetchCompanyPlan(tenantId);
  
  useEffect(() => {
    // Don't check on excluded paths
    if (excludedPaths.some(path => window.location.pathname.includes(path))) {
      return;
    }
    
    // If there's an error (e.g., 404 - no plan found) and we've finished loading
    if (error && !isLoading) {
      if (error.message.includes('404')) {
        notifications.show({
          id: 'plan-required',
          title: 'Plan requerido',
          message: 'Debes seleccionar un plan para continuar',
          color: 'yellow',
          autoClose: 5000,
        });
        
        // Redirect to plan selection
        window.location.href = '/select-plan';
      }
    }
  }, [error, isLoading, excludedPaths, tenantId]);

  return {
    companyPlan,
    isLoading,
    hasPlan: !!companyPlan,
  };
} 