import React from 'react';
import { ShoppingCart, User, Utensils, LogOut, Home, BookOpen, Calendar, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Info } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const Layout = ({ children, showNav = true }: LayoutProps) => {
  const { currentUser, logout, cart } = useApp();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavigation = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {showNav && (
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('/')}>
                <Utensils className="w-8 h-8 text-red-600" />
                <span className="text-red-600">The Griller</span>
              </div>

              <div className="hidden md:flex items-center gap-8">
                {!currentUser || currentUser.role === 'customer' ? (
                  <>
                    <button onClick={() => handleNavigation('/')} className="text-stone-700 hover:text-red-600 transition-colors flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      Home
                    </button>
                    <button onClick={() => handleNavigation('/menu')} className="text-stone-700 hover:text-red-600 transition-colors flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      Menu
                    </button>
                    <button onClick={() => handleNavigation('/reservation')} className="text-stone-700 hover:text-red-600 transition-colors flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Reservations
                    </button>
                    <button
                      onClick={() => handleNavigation('/about')}
                      className="text-stone-700 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <Info className="w-4 h-4" />
                      About Us
                    </button>
                  </>
                ) : currentUser.role === 'staff' ? (
                  <>
                    <button onClick={() => handleNavigation('/staff/orders')} className="text-stone-700 hover:text-red-600 transition-colors">
                      Orders
                    </button>
                    <button onClick={() => handleNavigation('/staff/reservations')} className="text-stone-700 hover:text-red-600 transition-colors">
                      Reservations
                    </button>
                  </>
                ) : currentUser.role === 'admin' ? (
                  <>
                    <button onClick={() => handleNavigation('/admin/dashboard')} className="text-stone-700 hover:text-red-600 transition-colors">
                      Dashboard
                    </button>
                    <button onClick={() => handleNavigation('/admin/menu')} className="text-stone-700 hover:text-red-600 transition-colors">
                      Menu Management
                    </button>
                    <button onClick={() => handleNavigation('/admin/users')} className="text-stone-700 hover:text-red-600 transition-colors">
                      Users
                    </button>
                  </>
                ) : null}
              </div>

              <div className="flex items-center gap-4">
                {(!currentUser || currentUser.role === 'customer') && (
                  <button 
                    onClick={() => handleNavigation('/cart')} 
                    className="relative text-stone-700 hover:text-red-600 transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                )}
                
                {currentUser ? (
                  <div className="flex items-center gap-3">
                    {currentUser.role === 'customer' && (
                      <button 
                        onClick={() => handleNavigation('/orders')} 
                        className="text-stone-700 hover:text-red-600 transition-colors"
                      >
                        <Package className="w-6 h-6" />
                      </button>
                    )}
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-stone-700" />
                      <span className="text-stone-700">{currentUser.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        handleNavigation('/');
                      }}
                      className="text-stone-700 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <main>{children}</main>

      {showNav && (
        <footer className="bg-stone-800 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Utensils className="w-6 h-6 text-red-600" />
                  <span>The Griller</span>
                </div>
                <p className="text-stone-300">
                  Bringing you the finest dining experience with fresh ingredients and exceptional service.
                </p>
              </div>

              <div>
                <h3 className="mb-4">Opening Hours</h3>
                <div className="text-stone-300 space-y-2">
                  <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                  <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                </div>
              </div>

              <div>
                <h3 className="mb-4">Contact Us</h3>
                <div className="text-stone-300 space-y-2">
                  <p>123 Food Street, Culinary District</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Email: info@TheGriller.com</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-stone-700 text-center text-stone-400">
              <p>&copy; 2025 The Griller. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
