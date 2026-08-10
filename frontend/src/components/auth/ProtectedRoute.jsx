import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Radio } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center animate-pulse shadow-xs">
            <Radio className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-zinc-500">
            Validating pit wall credentials...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to login with original location preserved
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
