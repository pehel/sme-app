import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  DocumentTextIcon,
  CalendarDaysIcon,
  CurrencyEuroIcon,
  BuildingOfficeIcon,
  UserIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

function ApplicationView() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock application data - in real app this would come from API
    const mockApplication = {
      id: applicationId,
      status: 'UNDER_REVIEW',
      productType: 'term-loan',
      amountRequested: 150000,
      businessName: user?.businessName || 'TechGreen Solutions',
      applicantName: user?.name || 'John Smith',
      submittedDate: '2024-07-20',
      lastUpdated: '2024-07-22',
      steps: [
        { name: 'Business Information', status: 'completed', date: '2024-07-20' },
        { name: 'Customer Details', status: 'completed', date: '2024-07-20' },
        { name: 'Application Details', status: 'completed', date: '2024-07-20' },
        { name: 'Document Upload', status: 'completed', date: '2024-07-20' },
        { name: 'Review & Decision', status: 'in_progress', date: '2024-07-22' },
        { name: 'Credit Agreement', status: 'pending', date: null },
        { name: 'Completion', status: 'pending', date: null },
      ],
      documents: [
        { name: 'Financial Statements', status: 'verified', uploadDate: '2024-07-20' },
        { name: 'Business Registration', status: 'verified', uploadDate: '2024-07-20' },
        { name: 'Bank Statements', status: 'verified', uploadDate: '2024-07-20' },
        { name: 'Tax Returns', status: 'pending_review', uploadDate: '2024-07-20' },
      ],
      timeline: [
        { date: '2024-07-20', event: 'Application Submitted', description: 'Initial application received and processing started' },
        { date: '2024-07-21', event: 'Documents Verified', description: 'All required documents have been verified' },
        { date: '2024-07-22', event: 'Credit Assessment', description: 'Application is under credit assessment review' },
      ]
    };

    setApplication(mockApplication);
    setLoading(false);
  }, [applicationId, user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in_progress':
      case 'pending_review':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Application {application.id}</h1>
              <p className="mt-2 text-lg text-gray-600">{application.businessName}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {application.status.replace('_', ' ')}
              </span>
              <p className="mt-2 text-sm text-gray-500">
                Last updated: {new Date(application.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Application Overview */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Product Type</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {application.productType.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CurrencyEuroIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount Requested</p>
                    <p className="text-lg font-semibold text-gray-900">
                      €{application.amountRequested.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business</p>
                    <p className="text-lg font-semibold text-gray-900">{application.businessName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-8 w-8 text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Submitted Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(application.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Progress</h2>
              <div className="space-y-4">
                {application.steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0">
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{step.name}</p>
                        {step.date && (
                          <p className="text-sm text-gray-500">
                            {new Date(step.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 capitalize">{step.status.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Timeline</h2>
              <div className="space-y-6">
                {application.timeline.map((event, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                        <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{event.event}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Documents */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents</h2>
              <div className="space-y-4">
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusIcon(doc.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Relationship Manager</p>
                    <p className="text-sm text-gray-600">Michael O'Connor</p>
                    <p className="text-sm text-gray-600">+353-85-111-2222</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationView;
