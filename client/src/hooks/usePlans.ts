/**
 * File Manager - Useplans
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchActivePlans, 
  fetchCompanyPlan, 
  createCompanyPlan, 
  type CreateCompanyPlanDto,
  type Plan,
  type CompanyPlan
} from '../services/api/plans';
import { notifications } from '@mantine/notifications';

export function useFetchActivePlans() {
  return useQuery<Plan[], Error>({
    queryKey: ['plans', 'active'],
    queryFn: fetchActivePlans,
    refetchOnWindowFocus: false,
  });
}

export function useFetchCompanyPlan(tenantId: string) {
  return useQuery<CompanyPlan, Error>({
    queryKey: ['companyPlan', tenantId],
    queryFn: () => fetchCompanyPlan(tenantId),
    refetchOnWindowFocus: false,
    enabled: !!tenantId,
    retry: (failureCount, error) => {
      // Don't retry if 404 Not Found - no plan exists yet
      if (error.message.includes('404')) return false;
      return failureCount < 3;
    }
  });
}

export function useCreateCompanyPlan() {
  const queryClient = useQueryClient();
  
  return useMutation<CompanyPlan, Error, CreateCompanyPlanDto>({
    mutationFn: (data) => createCompanyPlan(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['companyPlan', data.tenantId],
      });
      notifications.show({
        title: 'Plan seleccionado',
        message: 'Se ha asignado el plan correctamente',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: `No se pudo asignar el plan: ${error.message}`,
        color: 'red',
      });
    },
  });
} 