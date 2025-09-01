import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ArrowRightIcon,
  SparklesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const DirectorNotification = () => {
  const navigate = useNavigate();
  const {
    selectedEntity,
    currentQuote,
    user,
    submitForApproval,
    emailNotifications
  } = useAppStore();
  
  const [notificationStep, setNotificationStep] = useState('preparing');
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailContent, setShowEmailContent] = useState(false);

  useEffect(() => {
    // Simulate the director notification process
    const processNotification = async () => {
      // Step 1: Preparing notification
      setNotificationStep('preparing');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 2: Sending emails
      setNotificationStep('sending');
      
      // Create application data for director notification
      const applicationData = {
        entity: selectedEntity,
        quote: currentQuote,
        loanAmount: currentQuote?.amount || 60000,
        submittedAt: new Date().toISOString(),
        type: 'LOAN_APPLICATION'
      };
      
      // Trigger the email notification
      submitForApproval(applicationData);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Step 3: Emails sent
      setNotificationStep('sent');
      setEmailSent(true);
    };

    processNotification();
  }, [selectedEntity, currentQuote, submitForApproval]);

  const directors = [
    { name: 'Joe Bloggs', email: 'joe.bloggs@democorp.com', role: 'Managing Director' },
    { name: 'Mary Murphy', email: 'mary.murphy@democorp.com', role: 'Technical Director' },
    { name: 'James Wilson', email: 'james.wilson@democorp.com', role: 'Finance Director' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const handleContinueToReview = () => {
    navigate('/review-decision');
  };

  const latestEmailNotification = emailNotifications
    .filter(email => email.type === 'DIRECTOR_INFO')
    .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Director Notification</h1>
          <p className="text-gray-600">Informing directors about the submitted application</p>
        </div>

        {/* Notification Process */}
        <div className="max-w-4xl mx-auto">
          {/* Process Steps */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Process</h2>
            
            <div className="space-y-6">
              {/* Step 1: Preparing */}
              <div className="flex items-start space-x-4">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                  notificationStep === 'preparing' ? 'bg-blue-500 animate-pulse' : 
                  ['sending', 'sent'].includes(notificationStep) ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {['sending', 'sent'].includes(notificationStep) ? (
                    <CheckCircleIcon className="h-5 w-5 text-white" />
                  ) : (
                    <ClockIcon className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Preparing Application Summary</h3>
                  <p className="text-gray-600 text-sm">Compiling application details for director review</p>
                  {notificationStep === 'preparing' && (
                    <div className="mt-2 flex items-center text-blue-600 text-sm">
                      <SparklesIcon className="h-4 w-4 mr-1 animate-spin" />
                      Processing application data...
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Sending */}
              <div className="flex items-start space-x-4">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                  notificationStep === 'sending' ? 'bg-blue-500 animate-pulse' : 
                  notificationStep === 'sent' ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {notificationStep === 'sent' ? (
                    <CheckCircleIcon className="h-5 w-5 text-white" />
                  ) : (
                    <EnvelopeIcon className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Sending Email Notifications</h3>
                  <p className="text-gray-600 text-sm">Notifying all directors about the application submission</p>
                  {notificationStep === 'sending' && (
                    <div className="mt-2 flex items-center text-blue-600 text-sm">
                      <EnvelopeIcon className="h-4 w-4 mr-1 animate-bounce" />
                      Sending emails to {directors.length} directors...
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Completed */}
              <div className="flex items-start space-x-4">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                  notificationStep === 'sent' ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Directors Notified</h3>
                  <p className="text-gray-600 text-sm">All directors have been successfully informed</p>
                  {notificationStep === 'sent' && (
                    <div className="mt-2 flex items-center text-green-600 text-sm">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Notification emails delivered successfully
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Application Summary Sent to Directors</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <p className="text-gray-900">{selectedEntity?.name || 'Demo Company Ltd'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                  <p className="text-gray-900 text-lg font-semibold text-green-600">
                    {formatCurrency(currentQuote?.amount || 60000)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purpose</label>
                  <p className="text-gray-900">Business Expansion</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Submitted By</label>
                  <p className="text-gray-900">{user?.name || 'Demo User'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Submission Date</label>
                  <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                    Under Credit Review
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Directors Notified */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Directors Notified</h2>
            
            <div className="space-y-4">
              {directors.map((director, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{director.name}</h3>
                      <p className="text-sm text-gray-600">{director.role}</p>
                      <p className="text-sm text-gray-500">{director.email}</p>
                    </div>
                  </div>
                  {emailSent && (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">Email Sent</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Email Content Preview */}
          {emailSent && latestEmailNotification && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Email Content Sent</h2>
                <button
                  onClick={() => setShowEmailContent(!showEmailContent)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {showEmailContent ? 'Hide Details' : 'Show Email Content'}
                </button>
              </div>
              
              {showEmailContent && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Subject:</h3>
                    <p className="text-gray-700 bg-white p-3 rounded border">
                      {latestEmailNotification.subject}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Message:</h3>
                    <div className="text-gray-700 bg-white p-4 rounded border space-y-2">
                      <p>Dear Directors,</p>
                      <p>{latestEmailNotification.content.summary}</p>
                      <p><strong>Company:</strong> {latestEmailNotification.content.entityName}</p>
                      <p><strong>Amount:</strong> {formatCurrency(latestEmailNotification.content.amount || 0)}</p>
                      <p><strong>Submitted by:</strong> {latestEmailNotification.content.submittedBy}</p>
                      <p>You will receive a signing request if the application is approved by our Credit team.</p>
                      <p>Best regards,<br/>SME Banking Team</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Purpose of this email:</p>
                        <p>This is an <strong>information-only</strong> email to keep directors aware of pending applications. No action is required at this stage. Directors will receive a separate signing request if the application is approved by Credit.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">What Happens Next?</h2>
            <div className="space-y-3 text-blue-800">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                <p><strong>Credit Review:</strong> Our credit team will assess the application (typically 3-5 business days)</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                <p><strong>Decision Notification:</strong> You will receive the credit decision</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                <p><strong>Director Signing:</strong> If approved, directors will receive signing request emails with secure links</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                <p><strong>Completion:</strong> Once signed, funds will be disbursed within 2-3 business days</p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          {emailSent && (
            <div className="text-center">
              <button
                onClick={handleContinueToReview}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center mx-auto"
              >
                Continue to Credit Review
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Proceeding to see the credit decision for this application
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectorNotification;
