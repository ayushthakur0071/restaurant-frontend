import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { HomePage } from './components/home/HomePage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { MenuPage } from './components/menu/MenuPage';
import { MenuItemDetail } from './components/menu/MenuItemDetail';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/cart/CheckoutPage';
import { ReservationPage } from './components/reservation/ReservationPage';
import { OrderTrackingPage } from './components/customer/OrderTrackingPage';
import { StaffOrderManagement } from './components/staff/StaffOrderManagement';
import { StaffReservationManagement } from './components/staff/StaffReservationManagement';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MenuManagement } from './components/admin/MenuManagement';
import { UserManagement } from './components/admin/UserManagement';
import { AboutUsPage } from './components/about/AboutUsPage';


function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    // Auth pages (no layout)
    if (currentPath === '/login') {
      return <LoginPage />;
    }
    if (currentPath === '/register') {
      return <RegisterPage />;
    }

    // Customer pages
    if (currentPath === '/') {
      return (
        <Layout>
          <HomePage />
        </Layout>
      );
    }
    if (currentPath === '/menu') {
      return (
        <Layout>
          <MenuPage />
        </Layout>
      );
    }
    if (currentPath.startsWith('/menu/')) {
      const itemId = currentPath.split('/menu/')[1];
      return (
        <Layout>
          <MenuItemDetail itemId={itemId} />
        </Layout>
      );
    }
    if (currentPath === '/cart') {
      return (
        <Layout>
          <CartPage />
        </Layout>
      );
    }
    if (currentPath === '/checkout') {
      return (
        <Layout>
          <CheckoutPage />
        </Layout>
      );
    }
    if (currentPath === '/reservation') {
      return (
        <Layout>
          <ReservationPage />
        </Layout>
      );
    }
    if (currentPath === '/about') {
      return (
        <Layout>
          <AboutUsPage />
        </Layout>
      );
    }
    if (currentPath === '/orders') {
      return (
        <Layout>
          <OrderTrackingPage />
        </Layout>
      );
    }

    // Staff pages
    if (currentPath === '/staff/orders') {
      return (
        <Layout>
          <StaffOrderManagement />
        </Layout>
      );
    }
    if (currentPath === '/staff/reservations') {
      return (
        <Layout>
          <StaffReservationManagement />
        </Layout>
      );
    }

    // Admin pages
    if (currentPath === '/admin/dashboard') {
      return (
        <Layout>
          <AdminDashboard />
        </Layout>
      );
    }
    if (currentPath === '/admin/menu') {
      return (
        <Layout>
          <MenuManagement />
        </Layout>
      );
    }
    if (currentPath === '/admin/users') {
      return (
        <Layout>
          <UserManagement />
        </Layout>
      );
    }

    // 404 fallback
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="mb-4">404 - Page Not Found</h1>
          <p className="text-stone-600 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <button
            onClick={() => window.location.hash = '/'}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Go Home
          </button>
        </div>
      </Layout>
    );
  };

  return (
    <AppProvider>
      {renderPage()}
    </AppProvider>
  );
}

export default App;
