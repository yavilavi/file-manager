/**
 * File Manager - Application Bootstrap
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios.ts';

export const checkSubdomain = async (subdomain: string) => {
  const { data } = await apiCall.get<{
    available: boolean;
  }>(`/tenant/check-subdomain?subdomain=${subdomain}`);
  return data ?? { available: false };
};
