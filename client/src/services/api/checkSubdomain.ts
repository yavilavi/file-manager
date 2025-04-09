import apiCall from '../axios.ts';

export const checkSubdomain = async (subdomain: string) => {
  const { data } = await apiCall.get<{
    available: boolean;
  }>(`/tenant/check-subdomain?subdomain=${subdomain}`);
  return data ?? { available: false };
};
