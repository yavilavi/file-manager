/**
 * File Manager - Privateroute
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Navigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../stores/auth.store';
import { validateToken } from '../../services/api/auth.ts';
import { useEffect, ReactNode } from 'react';

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.token);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['validateToken'],
    queryFn: validateToken,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  if (!token || isError) return <Navigate to="/login" replace />;
  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
}
