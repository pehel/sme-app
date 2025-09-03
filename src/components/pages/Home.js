import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  BuildingOfficeIcon,
  UserIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    setUser,
    setRole,
    entities,
    selectEntity,
    loadQuoteByReference,
    facilities,
    currentApplication,
    applicationStatus,
    submitForApproval
  } = useAppStore();

  const [resumeReference, setResumeReference] = useState('');
  const [resumeError, setResumeError] = useState('');

  const handleQuickLogin = (userType) => {
    // Quick demo login
    const demoUser = {
      id: `user-${userType}`,
      name: userType === 'director' ? 'Mary Murphy' : userType === 'staff' ? 'John Doe' : 'Sarah Wilson',
      email: `${userType}@demo.com`,
      type: userType
    };
    
    setUser(demoUser);
    
    // Set the role based on user type
    if (userType === 'director') {
      setRole('DIRECTOR');
    } else if (userType === 'staff') {
      setRole('STAFF');
    } else {
      setRole('PREPARER'); // FLU users
    }
    
    // Auto-select first entity
    if (entities.length > 0) {
      selectEntity(entities[0].id);
    }
    
    // Navigate to role-specific dashboard
    if (userType === 'director') {
      navigate('/director/dashboard');
    } else if (userType === 'staff') {
      navigate('/staff/dashboard');
    } else {
      navigate('/entity-select');
    }
  };

  const handleQuickEmailDemo = () => {
    // Quick demo of email workflow
    const demoApplicationData = {
      entity: entities[0],
      loanAmount: 150000,
      type: 'LOAN_APPLICATION'
    };
    
    submitForApproval(demoApplicationData);
    alert('Demo application submitted! Directors have been notified via email.');
    navigate('/email-notifications');
  };

  const handleResumeByReference = () => {
    if (!resumeReference.trim()) {
      setResumeError('Please enter a reference number');
      return;
    }

    const found = loadQuoteByReference(resumeReference.trim().toUpperCase());
    if (found) {
      navigate('/quote');
    } else {
      setResumeError('Reference not found. Please check and try again.');
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'DRAFT', label: 'Draft', icon: DocumentTextIcon },
      { key: 'SUBMITTED', label: 'Submitted', icon: ClockIcon },
      { key: 'DECISION_APPROVED', label: 'Approved', icon: DocumentTextIcon },
      { key: 'DOCS', label: 'Documents', icon: DocumentTextIcon },
      { key: 'SIGNING', label: 'Signing', icon: DocumentTextIcon },
      { key: 'COMPLETE', label: 'Complete', icon: DocumentTextIcon }
    ];

    const currentIndex = steps.findIndex(step => step.key === applicationStatus);
    
    return steps.map((step, index) => ({
      ...step,
      status: index <= currentIndex ? 'complete' : 'pending'
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-12">
          <BuildingOfficeIcon className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SME Banking Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of business banking with our AI-powered application process. 
            Get instant decisions, seamless document handling, and digital signing.
          </p>
        </div>

        {/* Quick Demo Login */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Demo Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => handleQuickLogin('director')}
              className="group p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              <UserIcon className="h-12 w-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Director</h3>
              <p className="text-sm text-gray-600 mb-4">
                Can approve applications and digitally sign for the company
              </p>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                Approval & Signing Authority
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('staff')}
              className="group p-6 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all duration-200"
            >
              <DocumentTextIcon className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Staff</h3>
              <p className="text-sm text-gray-600 mb-4">
                Can prepare applications, requires Director approval
              </p>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Requires approval
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('flu')}
              className="group p-6 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all duration-200"
            >
              <BuildingOfficeIcon className="h-12 w-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">FLU Staff</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage RTL tasks and credit approvals
              </p>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                Staff access
              </div>
            </button>
          </div>
        </div>

        {/* Resume Application */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Resume Saved Application
          </h2>
          <div className="max-w-md mx-auto">
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={resumeReference}
                  onChange={(e) => {
                    setResumeReference(e.target.value);
                    setResumeError('');
                  }}
                  placeholder="Enter reference (e.g., Q-1234)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {resumeError && (
                  <p className="text-red-600 text-sm mt-1">{resumeError}</p>
                )}
              </div>
              <button
                onClick={handleResumeByReference}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Find
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">
              Have a saved quote or application? Enter your reference number to continue where you left off.
            </p>
          </div>
        </div>

        {/* Quick Email Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📧 Test Email Workflow
            </h2>
            <p className="text-gray-600 mb-6">
              See how directors are notified via email when applications are submitted
            </p>
            <button
              onClick={handleQuickEmailDemo}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Demo Email Notification to Directors
            </button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Decisions</h3>
            <p className="text-gray-600">
              Get AI-powered credit decisions in real-time with transparent decision making.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <DocumentTextIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Documents</h3>
            <p className="text-gray-600">
              AI extracts data from your documents automatically, saving time and reducing errors.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Access</h3>
            <p className="text-gray-600">
              Different permissions for Directors, Preparers, and Staff with proper approval workflows.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated User Dashboard
  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-600">
              Continue your banking journey or start a new application.
            </p>
          </div>
          <button
            onClick={() => navigate('/entity')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            Start New Application
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Application Status */}
        {currentApplication && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Current Application
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Application ID:</span>
                <span className="font-medium">{currentApplication.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">€{currentApplication.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {applicationStatus.replace('_', ' ')}
                </span>
              </div>
              
              {/* Status Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  {getStatusSteps().map((step, index) => (
                    <span
                      key={step.key}
                      className={step.status === 'complete' ? 'text-blue-600' : 'text-gray-400'}
                    >
                      {step.label}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  {getStatusSteps().map((step, index) => (
                    <div
                      key={step.key}
                      className={`h-2 flex-1 rounded ${
                        step.status === 'complete' ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/status')}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        )}

        {/* Existing Facilities */}
        {facilities.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Facilities
            </h2>
            <div className="space-y-4">
              {facilities.slice(0, 3).map((facility) => (
                <div key={facility.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">{facility.productName}</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {facility.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Balance:</span>
                      <span className="font-medium">€{facility.closingBalance.toLocaleString()}</span>
                    </div>
                    {facility.terms.limit && (
                      <div className="flex justify-between">
                        <span>Limit:</span>
                        <span className="font-medium">€{facility.terms.limit.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate('/day2')}
                className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Manage All Facilities
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/suitability')}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Product Suitability Check</div>
              <div className="text-sm text-gray-600">Find the right products for your needs</div>
            </button>
            
            <button
              onClick={() => navigate('/quote')}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Build Quote</div>
              <div className="text-sm text-gray-600">Calculate repayments and get quotes</div>
            </button>
            
            <button
              onClick={() => navigate('/day2/restructure')}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Restructure Existing</div>
              <div className="text-sm text-gray-600">Modify terms on existing facilities</div>
            </button>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Resume Application
          </h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={resumeReference}
                onChange={(e) => {
                  setResumeReference(e.target.value);
                  setResumeError('');
                }}
                placeholder="Enter reference (e.g., Q-1234)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {resumeError && (
                <p className="text-red-600 text-sm mt-1">{resumeError}</p>
              )}
            </div>
            <button
              onClick={handleResumeByReference}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Find Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
