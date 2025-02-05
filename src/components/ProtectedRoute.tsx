import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, adminLoading } = useAdmin();

  console.log('Protected route check:', {
    path: location.pathname,
    hasUser: !!user,
    userId: user?.id,
    requireAdmin,
    isAdmin,
    authLoading,
    adminLoading
  });

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    sessionStorage.setItem('redirectTo', location.pathname);
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('Admin access denied');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You do not have permission to access this area.</p>
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}



// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import { useAdmin } from '../hooks/useAdmin';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requireAdmin?: boolean;
// }

// export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
//   const location = useLocation();
//   const { user } = useAuth();
//   const { isAdmin, loading } = useAdmin();

//   console.log('Protected route check:', {
//     path: location.pathname,
//     hasUser: !!user,
//     userId: user?.id,
//     requireAdmin,
//     isAdmin,
//     loading
//   });

//   // Handle loading state
//   if (requireAdmin && loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   // Handle authentication
//   if (!user) {
//     console.log('No user found, redirecting to login');
//     sessionStorage.setItem('redirectTo', location.pathname);
//     return <Navigate to="/" replace />;
//   }

//   // Handle admin check
//   if (requireAdmin && !isAdmin && !loading) {
//     console.log('Admin access denied', {
//       userId: user.id,
//       requireAdmin,
//       isAdmin
//     });

//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
//           <p className="text-gray-600 mb-4">You do not have permission to access this area.</p>
//           <a
//             href="/"
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Return to Home
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }