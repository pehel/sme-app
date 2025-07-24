import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useApplication,
  applicationActions,
} from '../../context/ApplicationContext';
import {
  CheckCircleIcon,
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

function Completion() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();

  useEffect(() => {
    // Ensure user has completed the process
    if (!state.decisionOutcome) {
      navigate('/review-decision');
    }
  }, [state.decisionOutcome, navigate]);

  const getProductIcon = (productId) => {
    switch (productId) {
      case 'term-loan':
      case 'green-loan':
        return BanknotesIcon;
      case 'business-overdraft':
        return BuildingLibraryIcon;
      case 'business-credit-card':
        return CreditCardIcon;
      default:
        return BanknotesIcon;
    }
  };

  const getProductDisbursementInfo = (productId) => {
    switch (productId) {
      case 'term-loan':
        return {
          title: 'Term Loan Disbursement',
          description:
            'Funds will be disbursed to your selected business account within 2-3 business days.',
          action: 'Check your business account for the loan amount',
        };
      case 'green-loan':
        return {
          title: 'Green Loan Disbursement',
          description:
            'Your environmentally-focused loan funds will be available in your account within 2-3 business days.',
          action: 'Funds are earmarked for your approved green purpose',
        };
      case 'business-overdraft':
        return {
          title: 'Overdraft Facility Active',
          description:
            'Your overdraft limit is now available in your designated business account.',
          action: 'You can access funds immediately as needed',
        };
      case 'business-credit-card':
        return {
          title: 'Credit Card Dispatch',
          description:
            'Your business credit card will be dispatched to your registered address within 5-7 business days.',
          action: 'Activate your card upon receipt and set up online banking',
        };
      default:
        return {
          title: 'Credit Facility',
          description: 'Your approved credit facility is being processed.',
          action: 'You will be contacted with further details',
        };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleNewApplication = () => {
    dispatch(applicationActions.resetApplication());
    navigate('/');
  };

  const handleDownloadSummary = () => {
    // Generate and download application summary
    const summary = `
SME CREDIT APPLICATION SUMMARY
==============================

Application Reference: SME-${Date.now().toString().slice(-8)}
Date: ${new Date().toLocaleDateString('en-IE')}

APPLICANT INFORMATION
Applicant Type: ${state.applicantType
      ?.replace('-', ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())}
Business Name: ${state.businessInfo?.businessName || 'N/A'}
Industry: ${state.businessInfo?.industryType || 'N/A'}
Annual Turnover: ${formatCurrency(state.businessInfo?.annualTurnover || 0)}

SELECTED PRODUCTS
${
  state.selectedProducts
    ?.map(
      (product) =>
        `- ${product
          .replace('-', ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase())}`
    )
    .join('\n') || 'None'
}

DECISION
Status: ${state.decisionOutcome?.type?.toUpperCase() || 'PENDING'}
${
  state.decisionOutcome?.type === 'approved'
    ? 'Amount Approved: ' +
      formatCurrency(state.applicationDetails?.amountRequested || 0)
    : ''
}

${
  state.creditAgreement?.signed
    ? 'AGREEMENT SIGNED: ' +
      new Date(state.creditAgreement.signedDate).toLocaleDateString('en-IE')
    : ''
}

This summary is for your records.
SME Banking Solutions - Regulated by the Central Bank of Ireland
    `;

    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `sme-application-summary-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
          Application Complete!
        </h1>

        <p className="text-xl text-gray-600 mb-2">
          {state.decisionOutcome?.type === 'approved'
            ? 'Congratulations! Your credit application has been successfully processed.'
            : 'Thank you for your application. We will be in touch soon.'}
        </p>

        <div className="bg-gray-50 rounded-lg p-4 inline-block">
          <p className="text-sm text-gray-500">Application Reference Number</p>
          <p className="text-lg font-mono font-bold text-gray-900">
            SME-{Date.now().toString().slice(-8)}
          </p>
        </div>
      </div>

      {/* Application Status */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Application Status
        </h2>

        <div
          className={`p-4 rounded-lg border-l-4 ${
            state.decisionOutcome?.type === 'approved'
              ? 'bg-green-50 border-green-400'
              : state.decisionOutcome?.type === 'pending'
              ? 'bg-yellow-50 border-yellow-400'
              : 'bg-red-50 border-red-400'
          }`}
        >
          <div className="flex items-center">
            <div
              className={`flex-shrink-0 ${
                state.decisionOutcome?.type === 'approved'
                  ? 'text-green-400'
                  : state.decisionOutcome?.type === 'pending'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h3
                className={`text-lg font-medium ${
                  state.decisionOutcome?.type === 'approved'
                    ? 'text-green-800'
                    : state.decisionOutcome?.type === 'pending'
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }`}
              >
                {state.decisionOutcome?.title}
              </h3>
              <p
                className={`text-sm ${
                  state.decisionOutcome?.type === 'approved'
                    ? 'text-green-700'
                    : state.decisionOutcome?.type === 'pending'
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}
              >
                {state.decisionOutcome?.message}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product-Specific Information */}
      {state.decisionOutcome?.type === 'approved' && state.selectedProducts && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Your Approved Credit Facilities
          </h2>

          {state.selectedProducts.map((productId) => {
            const ProductIcon = getProductIcon(productId);
            const disbursementInfo = getProductDisbursementInfo(productId);

            return (
              <div key={productId} className="card">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-primary-100 rounded-lg">
                    <ProductIcon className="h-6 w-6 text-primary-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {disbursementInfo.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {disbursementInfo.description}
                    </p>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800 font-medium">
                        Next Steps: {disbursementInfo.action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Important Reminders */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Important Reminders
        </h2>

        <div className="space-y-4">
          {state.decisionOutcome?.type === 'approved' && (
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Set up Direct Debit</p>
                <p className="text-sm text-gray-600">
                  Contact your relationship manager to set up automatic
                  repayments for your loan facilities.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <EnvelopeIcon className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Check Your Email</p>
              <p className="text-sm text-gray-600">
                All documentation and next steps will be sent to your registered
                email address.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <PhoneIcon className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">
                Customer Support Available
              </p>
              <p className="text-sm text-gray-600">
                Contact us at +353 1 234 5678 if you have any questions about
                your application.
              </p>
            </div>
          </div>

          {state.creditAgreement?.signed && (
            <div className="flex items-start space-x-3">
              <ArrowDownTrayIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">
                  Download Your Documents
                </p>
                <p className="text-sm text-gray-600">
                  Your signed credit agreement and application summary are
                  available for download.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownloadSummary}
          className="btn-outline flex items-center justify-center px-6 py-3"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Download Application Summary
        </button>

        <button
          onClick={handleNewApplication}
          className="btn-primary px-6 py-3"
        >
          Start New Application
        </button>
      </div>

      {/* Thank You Message */}
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Thank You for Choosing SME Banking Solutions
        </h3>
      </div>
    </div>
  );
}

export default Completion;
