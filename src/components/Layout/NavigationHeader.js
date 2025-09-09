import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

const NavigationHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/customer/dashboard',
      icon: HomeIcon,
      description: 'View your applications and account overview',
    },
    {
      name: 'Browse Products',
      path: '/browse-products',
      icon: ShoppingBagIcon,
      description: 'Explore our banking products and services',
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              <div className="ml-2 lg:ml-0 flex items-center">
                <div className="bg-blue-600 rounded-lg p-2 mr-3">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    SME Banking
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Business Financial Solutions
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {menuItems.slice(0, 4).map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="ml-2 hidden sm:block text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 ${
          isMenuOpen ? 'block' : 'hidden'
        } lg:hidden`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sidebar */}
        <div className="relative flex flex-col w-full max-w-sm bg-white h-full shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-2 mr-3">
                <DocumentTextIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">SME Banking</h2>
                <p className="text-xs text-gray-500">Business Solutions</p>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <UserCircleIcon className="h-10 w-10 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-colors ${
                  isActivePath(item.path)
                    ? 'text-blue-600 bg-blue-50 border border-blue-200'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5 mr-4 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationHeader;
