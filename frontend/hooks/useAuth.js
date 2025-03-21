import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../store/useStore';

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const { isAuthenticated, user, checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // If authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      // Redirect to login page with return URL
      router.push(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
    }

    // If user is authenticated and trying to access auth pages (login/register)
    if (isAuthenticated && ['/login', '/register'].includes(router.pathname)) {
      // Redirect to dashboard or the return URL if specified
      const returnUrl = router.query.returnUrl || '/dashboard';
      router.push(decodeURIComponent(returnUrl));
    }
  }, [isAuthenticated, requireAuth, router]);

  return { isAuthenticated, user };
}

export function useAuthGuard() {
  const router = useRouter();
  const { isAuthenticated, user, checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated, user };
}

export function useRole(allowedRoles) {
  const router = useRouter();
  const { user, isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const hasRequiredRole = Array.isArray(allowedRoles)
        ? allowedRoles.includes(user.role)
        : user.role === allowedRoles;

      if (!hasRequiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [user, isAuthenticated, allowedRoles, router]);

  return { user, isAuthenticated };
}

export function usePermissions(requiredPermissions) {
  const { user } = useStore();

  const hasPermissions = (permissions) => {
    if (!user || !user.permissions) return false;

    if (Array.isArray(permissions)) {
      return permissions.every(permission => user.permissions.includes(permission));
    }

    return user.permissions.includes(permissions);
  };

  const checkPermission = (permission) => {
    return hasPermissions(permission);
  };

  return {
    hasPermissions: hasPermissions(requiredPermissions),
    checkPermission,
  };
}

export function useAuthRedirect() {
  const router = useRouter();
  const { isAuthenticated } = useStore();

  const redirectToLogin = (returnUrl = router.asPath) => {
    router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const redirectToDashboard = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  };

  const redirectToUnauthorized = () => {
    router.push('/unauthorized');
  };

  return {
    redirectToLogin,
    redirectToDashboard,
    redirectToUnauthorized,
  };
}

export function useSession() {
  const { user, isAuthenticated, logout } = useStore();

  const handleSessionExpired = () => {
    logout();
    router.push('/login?expired=true');
  };

  useEffect(() => {
    // Set up session expiration check
    const checkSession = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            handleSessionExpired();
          }
        } catch (error) {
          handleSessionExpired();
        }
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return {
    user,
    isAuthenticated,
    handleSessionExpired,
  };
}

export default useAuth;