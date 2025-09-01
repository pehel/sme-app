import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import {
  EnvelopeIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const EmailNotifications = () => {
  const { emailNotifications, applicationStage } = useAppStore();
  const [selectedEmail, setSelectedEmail] = useState(null);

  const getEmailTypeIcon = (type) => {
    switch (type) {
      case 'DIRECTOR_INFO':
        return <InformationCircleIcon className="h-6 w-6 text-blue-600" />;
      case 'SIGNING_REQUEST':
        return <DocumentTextIcon className="h-6 w-6 text-red-600" />;
      default:
        return <EnvelopeIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const getEmailTypeBadge = (type, purpose) => {
    if (type === 'DIRECTOR_INFO') {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Information Only</span>;
    }
    if (type === 'SIGNING_REQUEST') {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Signature Required</span>;
    }
    return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{purpose}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const isExpired = (expiresAt) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  const getStageProgress = () => {
    const stages = [
      { key: 'SUBMITTED', label: 'Submitted', completed: true },
      { key: 'CREDIT_REVIEW', label: 'Credit Review', completed: applicationStage !== 'SUBMITTED' },
      { key: 'CREDIT_APPROVED', label: 'Credit Approved', completed: ['CREDIT_APPROVED', 'SIGNING_REQUIRED', 'FULLY_SIGNED', 'COMPLETE'].includes(applicationStage) },
      { key: 'SIGNING_REQUIRED', label: 'Director Signing', completed: ['FULLY_SIGNED', 'COMPLETE'].includes(applicationStage) },
      { key: 'COMPLETE', label: 'Complete', completed: applicationStage === 'COMPLETE' }
    ];

    return stages;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Email Notification Workflow</h2>
        <p className="text-gray-600">Track how directors are informed throughout the application process</p>
      </div>

      {/* Application Stage Progress */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Progress</h3>
        <div className="flex items-center space-x-4 overflow-x-auto pb-4">
          {getStageProgress().map((stage, index) => (
            <div key={stage.key} className="flex items-center space-x-2 min-w-0">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                stage.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stage.completed ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${stage.completed ? 'text-green-600' : 'text-gray-600'}`}>
                  {stage.label}
                </p>
                {stage.key === applicationStage && (
                  <p className="text-xs text-blue-600 font-medium">Current</p>
                )}
              </div>
              {index < getStageProgress().length - 1 && (
                <ArrowRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Email Workflow Explanation */}
      <div className="mb-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Director Email Workflow</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Stage 1: Information Email (After Submission)</p>
              <p>All directors receive an informational email when an application is submitted. This keeps them aware of pending applications under credit review.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <DocumentTextIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Stage 2: Signing Request (After Credit Approval)</p>
              <p>Required directors receive a signing request email with secure links when the application is approved by Credit. This triggers the legal signing process.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Notifications List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Email Notifications Sent</h3>
        
        {emailNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <EnvelopeIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>No email notifications sent yet</p>
            <p className="text-sm">Submit an application to see the email workflow</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emailNotifications.map((email) => (
              <div
                key={email.id}
                className={`border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
                  selectedEmail?.id === email.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } ${isExpired(email.expiresAt) ? 'opacity-75' : ''}`}
                onClick={() => setSelectedEmail(selectedEmail?.id === email.id ? null : email)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {getEmailTypeIcon(email.type)}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 truncate">{email.subject}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        To: {email.recipients.map(r => r.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {getEmailTypeBadge(email.type, email.purpose)}
                    {isExpired(email.expiresAt) && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Expired
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Sent: {new Date(email.sentAt).toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    {email.recipients.length} recipient{email.recipients.length !== 1 ? 's' : ''}
                  </div>
                  {email.expiresAt && (
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Expires: {new Date(email.expiresAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {selectedEmail?.id === email.id && (
                  <div className="border-t pt-4 mt-4">
                    <h5 className="font-medium text-gray-900 mb-3">Email Content Preview</h5>
                    
                    {/* Email Details */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Entity:</p>
                          <p className="text-sm text-gray-600">{email.content.entityName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Amount:</p>
                          <p className="text-sm text-gray-600">{formatCurrency(email.content.amount || 0)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Summary:</p>
                        <p className="text-sm text-gray-600">{email.content.summary}</p>
                      </div>

                      {email.content.signingLink && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Signing Link:</p>
                          <p className="text-sm text-blue-600 font-mono bg-white p-2 rounded border">
                            {email.content.signingLink}
                          </p>
                        </div>
                      )}

                      {email.content.legalNotice && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <div className="flex items-start">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">Legal Notice:</p>
                              <p className="text-sm text-yellow-700">{email.content.legalNotice}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recipients List */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Recipients:</p>
                        <div className="space-y-1">
                          {email.recipients.map((recipient, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              <span className="font-medium">{recipient.name}</span>
                              <span className="mx-2">•</span>
                              <span>{recipient.email}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-500">
                    Application ID: #{email.applicationId}
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {selectedEmail?.id === email.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Stage Actions */}
      {emailNotifications.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h3>
          <div className="text-sm text-gray-600">
            {applicationStage === 'SUBMITTED' && (
              <p>Application is under credit review. Directors have been informed and are awaiting the credit decision.</p>
            )}
            {applicationStage === 'CREDIT_APPROVED' && (
              <p>Credit has approved the application. Directors have been sent signing requests and can now digitally sign.</p>
            )}
            {applicationStage === 'SIGNING_REQUIRED' && (
              <p>Waiting for required director signatures. Check the Director Portal for signing status.</p>
            )}
            {applicationStage === 'COMPLETE' && (
              <p>All signatures collected. Application has been finalized and submitted to the bank.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailNotifications;
