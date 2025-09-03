import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  UserIcon,
  CurrencyPoundIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const DirectorApproval = () => {
  const navigate = useNavigate();
  const {
    user,
    role,
    pendingApprovals,
    addDirectorApproval,
    finalizeApproval,
    simulateCreditApproval,
    emailNotifications
  } = useAppStore();

  const [selectedApproval, setSelectedApproval] = useState(null);
  const [signingInProgress, setSigningInProgress] = useState(false);
  const [eidVerified, setEidVerified] = useState(false);

  // Redirect non-directors
  if (role !== 'DIRECTOR') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">This area is restricted to Directors only.</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const handleCreditApproval = (approvalId) => {
    simulateCreditApproval(approvalId);
    alert('Credit has approved the application! Directors have been sent signing request emails.');
  };

  const handleApprovalView = (approval) => {
    setSelectedApproval(approval);
  };

  const handleEIDVerification = async () => {
    setSigningInProgress(true);
    // Simulate eID&V process
    setTimeout(() => {
      setEidVerified(true);
      setSigningInProgress(false);
    }, 2000);
  };

  const handleDigitalSigning = async (approvalId) => {
    if (!eidVerified) {
      alert('Please complete eID&V first');
      return;
    }

    setSigningInProgress(true);
    
    // Simulate digital signing process
    setTimeout(() => {
      const signature = {
        timestamp: new Date().toISOString(),
        directorId: user.id,
        method: 'EU_eIDAS_QUALIFIED',
        certificate: 'DEMO_CERT_' + Date.now()
      };

      addDirectorApproval(approvalId, signature);
      
      // Check if all required approvals are complete
      const approval = pendingApprovals.find(a => a.id === approvalId);
      const requiredApprovals = approval.directorsRequired === 'DUAL_DIRECTOR' ? 2 : 1;
      
      if (approval.approvals.length + 1 >= requiredApprovals) {
        finalizeApproval(approvalId);
        alert('Application approved and auto-submitted to bank!');
      } else {
        alert('Your approval recorded. Waiting for additional director approval.');
      }
      
      setSigningInProgress(false);
      setSelectedApproval(null);
      setEidVerified(false);
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const getApprovalRequirement = (directorsRequired) => {
    switch (directorsRequired) {
      case 'SINGLE_DIRECTOR':
        return 'Single Director Approval Required';
      case 'DUAL_DIRECTOR':
        return 'Dual Director Approval Required';
      case 'BOARD_APPROVAL':
        return 'Board Approval Required';
      default:
        return 'Approval Required';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Director Approval Portal</h1>
          <p className="text-gray-600">Review and approve pending loan applications</p>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Pending Approvals</h2>
            <p className="text-gray-600">All applications are up to date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Approvals List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Approvals ({pendingApprovals.length})</h2>
              
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className={`bg-white rounded-lg shadow-lg p-6 border-l-4 cursor-pointer transition-all hover:shadow-xl ${
                    isExpired(approval.expiresAt) 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-blue-500 hover:border-blue-600'
                  } ${selectedApproval?.id === approval.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleApprovalView(approval)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Application #{approval.id}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <UserIcon className="h-4 w-4 mr-1" />
                        Submitted by {approval.submittedBy.name}
                      </p>
                    </div>
                    {isExpired(approval.expiresAt) && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        EXPIRED
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyPoundIcon className="h-4 w-4 mr-2 text-green-600" />
                      {formatCurrency(approval.amount)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                      {new Date(approval.submittedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm text-gray-600">
                      {getApprovalRequirement(approval.directorsRequired)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Expires: {new Date(approval.expiresAt).toLocaleDateString()}
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      {approval.approvals.length} of {approval.directorsRequired === 'DUAL_DIRECTOR' ? '2' : '1'} approved
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Approval Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              {selectedApproval ? (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Application Review</h2>
                  
                  {/* Application Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application ID:</span>
                        <span className="font-medium">#{selectedApproval.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Amount:</span>
                        <span className="font-medium">{formatCurrency(selectedApproval.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted By:</span>
                        <span className="font-medium">{selectedApproval.submittedBy.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">{new Date(selectedApproval.submittedAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expires:</span>
                        <span className={`font-medium ${isExpired(selectedApproval.expiresAt) ? 'text-red-600' : ''}`}>
                          {new Date(selectedApproval.expiresAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Credit Approval Simulation */}
                  {!selectedApproval.creditApproved && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">Credit Review Status</h3>
                      <p className="text-blue-800 mb-3">
                        This application is currently under credit review. Directors have been informed via email.
                      </p>
                      <button
                        onClick={() => handleCreditApproval(selectedApproval.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Simulate Credit Approval
                      </button>
                    </div>
                  )}

                  {/* Email Notifications Summary */}
                                    {/* Email Notifications Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Notifications</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">
                        Directors were notified via email at the following stages:
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-green-700">
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Information email sent when application was submitted
                        </div>
                        {selectedApproval.creditApproved ? (
                          <div className="flex items-center text-green-700">
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Signing request email sent after credit approval
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            Signing request email will be sent after credit approval
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Existing Approvals */}
                  {selectedApproval.approvals.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Existing Approvals</h3>
                      <div className="space-y-2">
                        {selectedApproval.approvals.map((approval, index) => (
                          <div key={index} className="bg-green-50 p-3 rounded-lg flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <p className="font-medium text-green-900">{approval.directorName}</p>
                              <p className="text-sm text-green-700">
                                Signed: {new Date(approval.signedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Digital Signing Process */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Signing Process</h3>
                    
                    {!isExpired(selectedApproval.expiresAt) ? (
                      <div className="space-y-4">
                        {/* Step 1: eID&V */}
                        <div className={`p-4 rounded-lg border-2 ${eidVerified ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <ShieldCheckIcon className={`h-6 w-6 mr-3 ${eidVerified ? 'text-green-600' : 'text-gray-400'}`} />
                              <div>
                                <h4 className="font-medium">1. Electronic Identity & Verification</h4>
                                <p className="text-sm text-gray-600">Verify your identity using eID&V</p>
                              </div>
                            </div>
                            {!eidVerified && (
                              <button
                                onClick={handleEIDVerification}
                                disabled={signingInProgress}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                              >
                                {signingInProgress ? 'Verifying...' : 'Verify Identity'}
                              </button>
                            )}
                            {eidVerified && (
                              <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            )}
                          </div>
                        </div>

                        {/* Step 2: Digital Signing */}
                        <div className={`p-4 rounded-lg border-2 ${eidVerified ? 'border-blue-500' : 'border-gray-300 opacity-50'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <DocumentTextIcon className={`h-6 w-6 mr-3 ${eidVerified ? 'text-blue-600' : 'text-gray-400'}`} />
                              <div>
                                <h4 className="font-medium">2. EU eIDAS Qualified Digital Signature</h4>
                                <p className="text-sm text-gray-600">Legally binding digital signature</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDigitalSigning(selectedApproval.id)}
                              disabled={!eidVerified || signingInProgress}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {signingInProgress ? 'Signing...' : 'Sign & Approve'}
                            </button>
                          </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="flex items-start">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                              <p className="font-medium">Legal Notice:</p>
                              <p>By signing this application, you are legally binding the company to this loan application. 
                              This is not a personal guarantee but a corporate commitment subject to bank approval.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <XCircleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <p className="text-red-800 font-medium">This approval request has expired</p>
                        <p className="text-red-600 text-sm">The submitter will need to resubmit the application</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Select an application from the left to review and approve</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectorApproval;
