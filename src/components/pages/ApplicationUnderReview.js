import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const ApplicationUnderReview = () => {
  const navigate = useNavigate();
  const {
    pendingApprovals,
    emailNotifications,
    applicationStage,
    user
  } = useAppStore();

  // Get the latest application submitted by current user
  const myLatestApplication = pendingApprovals
    .filter(app => app.submittedBy?.id === user?.id)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];

  // Get related email notifications
  const myEmailNotifications = emailNotifications
    .filter(email => email.applicationId === myLatestApplication?.id)
    .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (!myLatestApplication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <ExclamationCircleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Application Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find your recent application.</p>
          <button
            onClick={() => navigate('/staff/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h1>
            <p className="text-xl text-gray-600 mb-4">
              Your loan application is now under credit review
            </p>
            <div className="bg-blue-50 rounded-lg p-4 inline-block">
              <p className="text-blue-800 font-medium">
                Application Reference: <span className="font-mono">#{myLatestApplication.id}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Application Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Application Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Entity:</span>
                <span className="font-medium">{myLatestApplication.applicationData?.entity?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-medium text-green-600">{formatCurrency(myLatestApplication.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Submitted:</span>
                <span className="font-medium">{getTimeAgo(myLatestApplication.submittedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                  Under Credit Review
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approval Required:</span>
                <span className="font-medium">
                  {myLatestApplication.directorsRequired === 'DUAL_DIRECTOR' ? 'Dual Director' : 'Single Director'}
                </span>
              </div>
            </div>
          </div>

          {/* Process Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Process Status</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium text-green-900">Application Submitted</h3>
                  <p className="text-sm text-green-700">Successfully submitted {getTimeAgo(myLatestApplication.submittedAt)}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ClockIcon className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-medium text-yellow-900">Credit Review in Progress</h3>
                  <p className="text-sm text-yellow-700">Typically takes 3-5 business days</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ClockIcon className="h-6 w-6 text-gray-400 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-500">Director Approval</h3>
                  <p className="text-sm text-gray-500">Pending credit review completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Director Email Notifications */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Directors Notified</h2>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-4">
              <EnvelopeIcon className="h-8 w-8 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Information Email Sent</h3>
                <p className="text-blue-800 mb-4">
                  All directors have been automatically notified that your application is under credit review.
                </p>
                
                {myEmailNotifications.length > 0 && (
                  <div className="space-y-3">
                    {myEmailNotifications
                      .filter(email => email.type === 'DIRECTOR_INFO')
                      .map((email) => (
                        <div key={email.id} className="bg-white rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{email.subject}</h4>
                              <p className="text-sm text-gray-600">Sent {getTimeAgo(email.sentAt)}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              Information Only
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Recipients:</h5>
                            <div className="flex flex-wrap gap-2">
                              {email.recipients.map((recipient, index) => (
                                <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                  <UserGroupIcon className="h-4 w-4 text-gray-600 mr-2" />
                                  <span className="text-sm text-gray-700">{recipient.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600 bg-gray-50 rounded p-3">
                            <strong>Email Summary:</strong> {email.content.summary}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps Information */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <DocumentTextIcon className="h-8 w-8 text-yellow-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">What Happens Next?</h3>
                <div className="space-y-2 text-yellow-800">
                  <p>1. <strong>Credit Review:</strong> Our credit team will assess your application (3-5 business days)</p>
                  <p>2. <strong>Director Notification:</strong> If approved, directors will receive signing request emails</p>
                  <p>3. <strong>Digital Signing:</strong> Required directors will sign using EU eIDAS qualified signatures</p>
                  <p>4. <strong>Completion:</strong> Once signed, your application will be finalized and funds disbursed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/email-notifications')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            View Email Workflow
          </button>
          
          <button
            onClick={() => navigate('/staff/dashboard')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <ArrowRightIcon className="h-5 w-5 mr-2" />
            Return to Dashboard
          </button>
        </div>

        {/* Progress Timeline */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Expected Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-green-900">Application Submitted</h3>
                  <p className="text-sm text-green-700">Completed {getTimeAgo(myLatestApplication.submittedAt)}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-yellow-900">Credit Review</h3>
                  <p className="text-sm text-yellow-700">In progress - typically 3-5 business days</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">Director Approval & Signing</h3>
                  <p className="text-sm text-gray-500">Pending credit review completion</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">Funds Disbursement</h3>
                  <p className="text-sm text-gray-500">Within 2-3 business days after approval</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationUnderReview;
