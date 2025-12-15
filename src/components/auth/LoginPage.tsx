import React, { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/Button';
import { Utensils } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'staff' | 'admin'>('customer');
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password, role);
    if (success) {
      if (role === 'admin') {
        window.location.hash = '/admin/dashboard';
      } else if (role === 'staff') {
        window.location.hash = '/staff/orders';
      } else {
        window.location.hash = '/';
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1683538503204-fec7fc504067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Restaurant food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/50 to-transparent"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-10 h-10 text-red-600" />
                <span className="text-red-600 text-2xl">The Griller</span>
              </div>
            </div>
            <h2 className="mt-6">Sign in to your account</h2>
            <p className="mt-2 text-stone-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="role" className="block text-stone-700 mb-2">
                  Sign in as
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'customer' | 'staff' | 'admin')}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-stone-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-stone-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-600 border-stone-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-stone-700">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                className="text-red-600 hover:text-red-700"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" fullWidth>
              Sign in
            </Button>

            <div className="text-center">
              <p className="text-stone-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => window.location.hash = '/register'}
                  className="text-red-600 hover:text-red-700"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
