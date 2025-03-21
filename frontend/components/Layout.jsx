import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useStore } from '../store/useStore';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register'];

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(router.pathname);

  // If route requires auth and user is not authenticated, redirect to login
  useEffect(() => {
    if (!isPublicRoute && !isAuthenticated) {
      router.push('/login');
    }
  }, [isPublicRoute, isAuthenticated, router]);

  // If it's a public route, don't show the layout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}>
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Toast container for notifications */}
      <div className="fixed bottom-4 right-4 z-50" />
    </div>
  );
};

export default Layout;