/**
 * File Manager - Useplans
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import {useQuery} from '@tanstack/react-query';
import {
    fetchActivePlans,
    fetchCompanyPlan,
    type Plan,
    type CompanyPlan
} from '../services/api/plans';

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