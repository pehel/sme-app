import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyEuroIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const ApplicationSummary = () => {
  const navigate = useNavigate();
  const { 
    selectedEntity, 
    quotes, 
    setApplicationStatus, 
    role, 
    user,
    submitForApproval 
  } = useAppStore();
  const [checklist, setChecklist] = useState([
    { id: 'identity', label: 'Identity Verification', status: 'complete', required: true },
    { id: 'business', label: 'Business Registration', status: 'complete', required: true },
    { id: 'financials', label: 'Financial Statements', status: 'pending', required: true },
    { id: 'bank', label: 'Bank Statements (6 months)', status: 'pending', required: true },
    { id: 'projections', label: 'Cash Flow Projections', status: 'review', required: false },
    { id: 'security', label: 'Security Documentation', status: 'pending', required: false },
    { id: 'insurance', label: 'Insurance Certificates', status: 'complete', required: false }
  ]);

  const currentQuote = quotes[quotes.length - 1]; // Latest quote

  const handleChecklistUpdate = (itemId, newStatus) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
  };

  const handleSubmitApplication = () => {
    const requiredIncomplete = checklist.filter(item => 
      item.required && item.status !== 'complete'
    );

    if (requiredIncomplete.length > 0) {
      alert('Please complete all required items before submitting.');
      return;
    }

    // Create application data for approval
    const applicationData = {
      entity: selectedEntity,
      quote: currentQuote,
      loanAmount: currentQuote?.amount || 0,
      submittedAt: new Date().toISOString(),
      checklist,
      type: 'LOAN_APPLICATION'
    };

    // For staff/preparer roles, submit for director approval
    if (role === 'STAFF' || role === 'PREPARER') {
      submitForApproval(applicationData);
      
      // Show immediate confirmation
      alert('Application submitted successfully! Directors have been notified via email.');
      
      // Navigate to the application under review page
      navigate('/application-under-review');
    } else {
      // For directors, proceed directly
      setApplicationStatus('submitted');
      navigate('/decision');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'review':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'review':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const completionPercentage = Math.round(
    (checklist.filter(item => item.status === 'complete').length / checklist.length) * 100
  );

  if (!currentQuote) {
    navigate('/quote-builder');
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Application Summary
        </h1>
        <p className="text-lg text-gray-600">
          Review your application details and complete the requirements checklist
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Overview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Application Overview</h2>
            
            {/* Business Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start space-x-3">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Business Entity</h3>
                  <p className="text-gray-700">{selectedEntity.name}</p>
                  <p className="text-sm text-gray-600">CRO: {selectedEntity.croNumber}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <UserIcon className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Primary Director</h3>
                  <p className="text-gray-700">{selectedEntity.directors[0]?.name}</p>
                  <p className="text-sm text-gray-600">{selectedEntity.directors[0]?.email}</p>
                </div>
              </div>
            </div>

            {/* Quote Summary */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Quote Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <CurrencyEuroIcon className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="font-bold text-gray-900">
                      €{currentQuote.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Monthly Payment</div>
                    <div className="font-bold text-blue-600">
                      €{currentQuote.totalMonthlyPayment.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">Products</div>
                    <div className="font-bold text-gray-900">{currentQuote.items.length}</div>
                  </div>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-2">
                {currentQuote.items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{item.productName}</div>
                        <div className="text-sm text-gray-600">
                          €{item.requestedAmount.toLocaleString()} over {item.term} months
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-blue-600">
                          €{item.monthlyPayment.toFixed(2)}/month
                        </div>
                        <div className="text-sm text-gray-600">{item.rate}% APR</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Requirements Checklist</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-4">
              {checklist.map((item) => (
                <div key={item.id} className={`border rounded-lg p-4 ${getStatusColor(item.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="font-medium">
                          {item.label}
                          {item.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                        <div className="text-sm opacity-75">
                          {item.status === 'complete' && 'Completed'}
                          {item.status === 'pending' && 'Upload required'}
                          {item.status === 'review' && 'Under review'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.status === 'complete' && (
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      )}
                      
                      {item.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleChecklistUpdate(item.id, 'complete')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Upload
                          </button>
                        </div>
                      )}

                      {item.status === 'review' && (
                        <button className="text-orange-600 hover:text-orange-800 transition-colors">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <span className="text-red-500">*</span> Required for application submission
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Application Status</h3>
            
            {/* Status Overview */}
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {checklist.filter(item => item.required && item.status === 'complete').length}/
                    {checklist.filter(item => item.required).length}
                  </div>
                  <div className="text-sm text-blue-700">Required Items Complete</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-600">
                    {checklist.filter(item => item.status === 'complete').length}
                  </div>
                  <div className="text-xs text-green-700">Complete</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {checklist.filter(item => item.status === 'pending').length}
                  </div>
                  <div className="text-xs text-yellow-700">Pending</div>
                </div>
              </div>
            </div>

            {/* Email Workflow Information */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Director Notification Process</h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium text-blue-900">Information Email (Upon Submission)</p>
                      <p className="text-blue-700">All directors receive notification that application is under credit review</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium text-red-900">Signing Request (After Credit Approval)</p>
                      <p className="text-red-700">Required directors receive secure signing links for digital signature</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-600 font-medium">
                    Directors: Mary Murphy, James Wilson, Sarah Chen
                  </p>
                </div>
              </div>
            </div>

            {/* Estimated Timeline */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Estimated Timeline</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application Review</span>
                  <span className="text-gray-900">2-3 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credit Assessment</span>
                  <span className="text-gray-900">3-5 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Final Approval</span>
                  <span className="text-gray-900">1-2 days</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">Total Estimated</span>
                  <span className="text-blue-600">6-10 days</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSubmitApplication}
                disabled={checklist.filter(item => item.required && item.status !== 'complete').length > 0}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Submit Application
              </button>
              
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Save Draft
              </button>
              
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Download Summary
              </button>
            </div>

            {/* Help */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Our team is available to assist with your application.
              </p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/quote-builder')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Quote Builder
        </button>
        
        <div className="text-sm text-gray-500">
          Application auto-saved • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default ApplicationSummary;
