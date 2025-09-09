import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavigationHeader from '../Layout/NavigationHeader';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  ArrowRightIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log('🏦 CustomerDashboard rendered, user:', user);

  // Mock application data for the customer
  useEffect(() => {
    const loadApplications = () => {
      // Simulate API call
      setTimeout(() => {
        // Only show applications for existing customers
        let mockApplications = [];

        if (user?.isExistingCustomer) {
          console.log('🏦 Loading applications for existing customer');
          mockApplications = [
            {
              id: 'APP-2024-001',
              businessName: user?.businessName || 'Tech Solutions Ltd',
              products: ['Business Loan', 'Business Account'],
              totalAmount: 75000,
              status: 'PENDING_REVIEW',
              submittedAt: new Date('2024-01-15'),
              lastUpdated: new Date('2024-01-16'),
              completionPercentage: 100,
              nextSteps: 'Pending RM review',
              estimatedDecision: new Date('2024-01-20'),
            },
            {
              id: 'APP-2024-002',
              businessName: user?.businessName || 'Tech Solutions Ltd',
              products: ['Merchant Services'],
              totalAmount: 0, // Service-based
              status: 'APPROVED',
              submittedAt: new Date('2024-01-10'),
              lastUpdated: new Date('2024-01-12'),
              completionPercentage: 100,
              nextSteps: 'Setup scheduled for Jan 25th',
              estimatedDecision: null,
            },
            {
              id: 'APP-2024-003',
              businessName: user?.businessName || 'Tech Solutions Ltd',
              products: ['Credit Line'],
              totalAmount: 25000,
              status: 'DRAFT',
              submittedAt: null,
              lastUpdated: new Date('2024-01-18'),
              completionPercentage: 45,
              nextSteps: 'Complete financial documentation',
              estimatedDecision: null,
            },
          ];
        } else {
          console.log('🆕 New customer - no existing applications');
          // New customers have no applications
          mockApplications = [];
        }

        setApplications(mockApplications);
        setIsLoading(false);
      }, 800);
    };

    loadApplications();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'PENDING_REVIEW':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'UNDER_REVIEW':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'DRAFT':
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'PENDING_REVIEW':
        return 'Pending Review';
      case 'UNDER_REVIEW':
        return 'Under Review';
      case 'DRAFT':
        return 'Draft';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-orange-100 text-orange-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartNewApplication = () => {
    // Navigate to product browsing instead of directly to application
    navigate('/browse-products');
  };

  const handleContinueApplication = (application) => {
    if (application.status === 'DRAFT') {
      // Load the draft application and continue where left off
      // For now, redirect to the appropriate step based on completion
      navigate('/new-application');
    } else {
      // View the submitted application
      navigate(`/application/${application.id}`);
    }
  };

  const handleViewApplication = (application) => {
    navigate(`/application/${application.id}`);
  };

  const formatCurrency = (amount) => {
    if (amount === 0) return '0';
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-IE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Welcome back, {user?.name?.split(' ')[0]}!
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Manage your banking applications and track their progress
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={handleStartNewApplication}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 sm:px-0 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Applications
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {applications.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Review
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {
                          applications.filter(
                            (app) =>
                              app.status === 'PENDING_REVIEW' ||
                              app.status === 'UNDER_REVIEW'
                          ).length
                        }
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Approved
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {
                          applications.filter(
                            (app) => app.status === 'APPROVED'
                          ).length
                        }
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyEuroIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Requested
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCurrency(
                          applications.reduce(
                            (sum, app) => sum + app.totalAmount,
                            0
                          )
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="px-4 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Applications
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Track the status and progress of all your banking applications
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getStatusIcon(application.status)}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {application.id}
                            </p>
                            <span
                              className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {getStatusText(application.status)}
                            </span>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-600">
                              Products: {application.products.join(', ')}
                            </p>
                            <p className="text-sm text-gray-600">
                              Amount: {formatCurrency(application.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {application.status === 'DRAFT' ? (
                          <button
                            onClick={() =>
                              handleContinueApplication(application)
                            }
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <ArrowRightIcon className="h-3 w-3 mr-1" />
                            Continue
                          </button>
                        ) : (
                          <button
                            onClick={() => handleViewApplication(application)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <EyeIcon className="h-3 w-3 mr-1" />
                            View
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar for Drafts */}
                    {application.status === 'DRAFT' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Application Progress</span>
                          <span>{application.completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${application.completionPercentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Additional Details */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        Submitted:{' '}
                        {application.submittedAt
                          ? formatDate(application.submittedAt)
                          : 'Not submitted'}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Last Updated: {formatDate(application.lastUpdated)}
                      </div>
                      {application.estimatedDecision && (
                        <div className="flex items-center">
                          <ChartBarIcon className="h-4 w-4 mr-1" />
                          Expected Decision:{' '}
                          {formatDate(application.estimatedDecision)}
                        </div>
                      )}
                    </div>

                    {/* Next Steps */}
                    {application.nextSteps && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          <strong>Next Steps:</strong> {application.nextSteps}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {applications.length === 0 && (
              <div className="text-center py-12">
                {user?.isExistingCustomer ? (
                  // Existing customer with no applications
                  <>
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No applications yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first banking application.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleStartNewApplication}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Start New Application
                      </button>
                    </div>
                  </>
                ) : (
                  // New customer welcome
                  <>
                    <div className="mb-6">
                      <div className="bg-blue-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <DocumentTextIcon className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        SME BANKING
                      </h3>
                      <p className="text-gray-600 text-lg mb-4">
                        Discover the right financial products for your business
                      </p>
                      <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                        Browse our product catalog first, then start your application with pre-selected products.
                      </p>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleStartNewApplication}
                        className="inline-flex items-center px-8 py-4 border border-transparent shadow-sm text-lg font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusIcon className="h-6 w-6 mr-3" />
                        Browse Products & Apply
                      </button>
                    </div>
                    <div className="mt-6 text-sm text-gray-500 space-y-1">
                      <p>✓ Quick online application</p>
                      <p>✓ Fast approval decisions</p>
                      <p>✓ Full transparency</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomerDashboard;
