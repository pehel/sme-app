import React from 'react';
import ProgressBar from './ProgressBar';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  SME Credit Application
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-sm text-gray-500">
                Secure • GDPR Compliant • Ireland
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProgressBar />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 SME Banking Solutions. All rights reserved.</p>
            <p className="mt-1">
              Regulated by the Central Bank of Ireland • eIDAS Compliant
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
