import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireKyc?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireKyc = false, requireAdmin = false }: ProtectedRouteProps) {
  const { user, validateRouteAccess } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const access = validateRouteAccess({ requireKyc, requireAdmin });
    if (!access.allowed) {
      navigate(access.redirectTo || '/', { state: { from: location.pathname }, replace: true });
    }
  }, [user, navigate, location, requireKyc, requireAdmin, validateRouteAccess]);

  const currentAccess = validateRouteAccess({ requireKyc, requireAdmin });
  if (!currentAccess.allowed) return null;

  return <>{children}</>;
}
