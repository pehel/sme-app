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
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

function RMReview() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [recommendedAmount, setRecommendedAmount] = useState('');

  useEffect(() => {
    // Mock application data for RM review
    const mockApplication = {
      id: applicationId,
      status: 'UNDER_REVIEW',
      productType: 'term-loan',
      amountRequested: 150000,
      businessName: 'TechGreen Solutions',
      applicantName: 'Joe Bloggs',
      submittedDate: '2024-07-20',
      lastUpdated: '2024-07-22',
      businessInfo: {
        businessName: 'TechGreen Solutions',
        tradingName: 'TechGreen',
        registeredAddress: '15 Dame Street, Dublin 2, D02 Y211',
        phone: '+353-87-123-4567',
        email: 'customer@test.com',
        industryType: 'Technology',
        numberOfEmployees: '25',
        annualTurnover: '2500000',
        yearEstablished: '2019',
      },
      personalInfo: {
        beneficialOwners: [
          {
            fullName: 'Joe Bloggs',
            dateOfBirth: '1985-03-15',
            nationality: 'Irish',
            position: 'Managing Director',
            sharePercentage: '100',
          },
        ],
      },
      documents: [
        {
          name: 'Financial Statements',
          status: 'verified',
          uploadDate: '2024-07-20',
        },
        {
          name: 'Business Registration',
          status: 'verified',
          uploadDate: '2024-07-20',
        },
        {
          name: 'Bank Statements',
          status: 'verified',
          uploadDate: '2024-07-20',
        },
        { name: 'Tax Returns', status: 'verified', uploadDate: '2024-07-20' },
      ],
      riskAssessment: {
        creditScore: 'B+',
        riskLevel: 'Medium',
        debtToIncomeRatio: '0.35',
        collateralValue: '€200,000',
      },
      timeline: [
        {
          date: '2024-07-20',
          event: 'Application Submitted',
          description: 'Initial application received',
        },
        {
          date: '2024-07-21',
          event: 'Documents Verified',
          description: 'All required documents verified',
        },
        {
          date: '2024-07-22',
          event: 'Assigned to RM',
          description: `Assigned to ${user?.name || 'RM'} for review`,
        },
      ],
    };

    setApplication(mockApplication);
    setLoading(false);
  }, [applicationId, user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
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
      case 'PENDING_REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitDecision = () => {
    if (!decision || !comments) {
      alert('Please provide both a decision and comments');
      return;
    }

    // Mock API call to submit decision
    console.log('Submitting RM decision:', {
      applicationId,
      decision,
      comments,
      recommendedAmount,
      reviewedBy: user.name,
    });

    // Simulate success
    alert(`Application ${decision.toLowerCase()} successfully!`);
    navigate('/rm/dashboard');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Application Not Found
          </h1>
          <button
            onClick={() => navigate('/rm/dashboard')}
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
            onClick={() => navigate('/rm/dashboard')}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Review Application {application.id}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {application.businessName}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  application.status
                )}`}
              >
                {application.status.replace('_', ' ')}
              </span>
              <p className="mt-2 text-sm text-gray-500">
                Assigned to: {user?.name}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Application Overview */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Application Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Product Type
                    </p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {application.productType.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CurrencyEuroIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Amount Requested
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      €{application.amountRequested.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Annual Turnover
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      €
                      {parseInt(
                        application.businessInfo.annualTurnover
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-8 w-8 text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Business Established
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {application.businessInfo.yearEstablished}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Business Name
                  </p>
                  <p className="text-base text-gray-900">
                    {application.businessInfo.businessName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Trading Name
                  </p>
                  <p className="text-base text-gray-900">
                    {application.businessInfo.tradingName}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">
                    Registered Address
                  </p>
                  <p className="text-base text-gray-900">
                    {application.businessInfo.registeredAddress}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Industry</p>
                  <p className="text-base text-gray-900">
                    {application.businessInfo.industryType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Number of Employees
                  </p>
                  <p className="text-base text-gray-900">
                    {application.businessInfo.numberOfEmployees}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Risk Assessment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Credit Score
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {application.riskAssessment.creditScore}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Risk Level
                  </p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {application.riskAssessment.riskLevel}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Debt-to-Income Ratio
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {application.riskAssessment.debtToIncomeRatio}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Collateral Value
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {application.riskAssessment.collateralValue}
                  </p>
                </div>
              </div>
            </div>

            {/* RM Decision Form */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                RM Decision
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision
                  </label>
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Decision</option>
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                    <option value="PENDING_INFO">
                      Request Additional Information
                    </option>
                  </select>
                </div>

                {decision === 'APPROVED' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recommended Amount
                    </label>
                    <input
                      type="number"
                      value={recommendedAmount}
                      onChange={(e) => setRecommendedAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    placeholder="Enter your comments and reasoning for this decision..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitDecision}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Submit Decision
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Documents */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Documents
              </h2>
              <div className="space-y-4">
                {application.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded:{' '}
                          {new Date(doc.uploadDate).toLocaleDateString()}
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

            {/* Applicant Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Key Personnel
              </h2>
              <div className="space-y-4">
                {application.personalInfo.beneficialOwners.map(
                  (owner, index) => (
                    <div key={index} className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {owner.fullName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {owner.position}
                        </p>
                        <p className="text-xs text-gray-500">
                          {owner.sharePercentage}% ownership
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Timeline
              </h2>
              <div className="space-y-4">
                {application.timeline.map((event, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                        <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {event.event}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RMReview;
