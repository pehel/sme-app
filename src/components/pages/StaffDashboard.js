import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  CurrencyPoundIcon,
  CalendarIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    role,
    applications,
    approvalStatus,
    pendingApprovals,
    approvalHistory,
    emailNotifications
  } = useAppStore();

  // Redirect non-staff
  if (role !== 'STAFF' && role !== 'PREPARER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">This area is restricted to Staff members only.</p>
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'DRAFT': { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
      'PENDING_DIRECTOR': { color: 'bg-yellow-100 text-yellow-800', text: 'Awaiting Director' },
      'APPROVED': { color: 'bg-green-100 text-green-800', text: 'Approved' },
      'EXPIRED': { color: 'bg-red-100 text-red-800', text: 'Expired' },
      'REJECTED': { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig['DRAFT'];
    return (
      <span className={`${config.color} px-2 py-1 rounded-full text-xs font-medium`}>
        {config.text}
      </span>
    );
  };

  // Get applications submitted by current user
  const myApplications = applications.filter(app => app.submittedBy?.id === user?.id);
  const myPendingApprovals = pendingApprovals.filter(approval => approval.submittedBy?.id === user?.id);
  const myApprovalHistory = approvalHistory.filter(approval => approval.submittedBy?.id === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
          <p className="text-gray-600">Manage loan applications and track approvals</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <button
            onClick={() => navigate('/entity-select')}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center">
              <PlusIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">New Application</h3>
                <p className="text-sm text-gray-600">Start a new loan application</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/email-notifications')}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500"
          >
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-purple-600 mr-4" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">Email Workflow</h3>
                <p className="text-sm text-gray-600">View director notifications</p>
              </div>
            </div>
          </button>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{myPendingApprovals.length}</h3>
                <p className="text-sm text-gray-600">Pending Approvals</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{emailNotifications.length}</h3>
                <p className="text-sm text-gray-600">Email Notifications</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{myApprovalHistory.length}</h3>
                <p className="text-sm text-gray-600">Approved Applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Application Status */}
        {approvalStatus !== 'DRAFT' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Current Application Status</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {approvalStatus === 'PENDING_DIRECTOR' && <ClockIcon className="h-6 w-6 text-yellow-600" />}
                {approvalStatus === 'APPROVED' && <CheckCircleIcon className="h-6 w-6 text-green-600" />}
                {approvalStatus === 'EXPIRED' && <XCircleIcon className="h-6 w-6 text-red-600" />}
                {approvalStatus === 'REJECTED' && <XCircleIcon className="h-6 w-6 text-red-600" />}
                <div>
                  <h3 className="font-semibold text-gray-900">Application Status</h3>
                  <p className="text-sm text-gray-600">
                    {approvalStatus === 'PENDING_DIRECTOR' && 'Your application is awaiting director approval'}
                    {approvalStatus === 'APPROVED' && 'Your application has been approved and submitted to the bank'}
                    {approvalStatus === 'EXPIRED' && 'Your application approval has expired'}
                    {approvalStatus === 'REJECTED' && 'Your application was rejected by the director'}
                  </p>
                </div>
              </div>
              {getStatusBadge(approvalStatus)}
            </div>
          </div>
        )}

        {/* Pending Approvals */}
        {myPendingApprovals.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Director Approvals</h2>
            <div className="space-y-4">
              {myPendingApprovals.map((approval) => (
                <div key={approval.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Application #{approval.id}</h3>
                    {getStatusBadge(approval.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CurrencyPoundIcon className="h-4 w-4 mr-2 text-green-600" />
                      {formatCurrency(approval.amount)}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Submitted: {new Date(approval.submittedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2 text-yellow-600" />
                      Expires: {new Date(approval.expiresAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Approvals: {approval.approvals.length} of {approval.directorsRequired === 'DUAL_DIRECTOR' ? '2' : '1'}
                      </span>
                      {approval.approvals.length > 0 && (
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Partially approved
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Applications</h2>
          
          {myApplications.length === 0 && myApprovalHistory.length === 0 ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first loan application</p>
              <button
                onClick={() => navigate('/entity-select')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Application
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Approved Applications */}
              {myApprovalHistory.map((approval) => (
                <div key={approval.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Application #{approval.id}</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Approved & Submitted
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <CurrencyPoundIcon className="h-4 w-4 mr-2 text-green-600" />
                      {formatCurrency(approval.amount)}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Approved: {new Date(approval.finalizedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-2 text-purple-600" />
                      {approval.approvals.length} Director{approval.approvals.length !== 1 ? 's' : ''} Signed
                    </div>
                  </div>

                  <div className="text-sm text-green-700">
                    <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                    Auto-submitted to bank on {new Date(approval.autoSubmittedAt).toLocaleString()}
                  </div>
                </div>
              ))}

              {/* Draft Applications */}
              {myApplications.filter(app => !app.submitted).map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Draft Application</h3>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      Draft
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    Last modified: {new Date(app.lastModified || app.created).toLocaleDateString()}
                  </div>

                  <button
                    onClick={() => navigate('/entity-select')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Continue Application →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Helpful Information */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Application Process Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">As Staff, you can:</h4>
              <ul className="space-y-1">
                <li>• Prepare and submit loan applications</li>
                <li>• Track approval status in real-time</li>
                <li>• View application history</li>
                <li>• Receive notifications on status changes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Email Workflow:</h4>
              <ul className="space-y-1">
                <li>• Directors informed when application submitted</li>
                <li>• Signing emails sent after credit approval</li>
                <li>• Real-time status tracking available</li>
                <li>• Automatic notifications at each stage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
