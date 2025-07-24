import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useApplication,
  applicationActions,
} from '../../context/ApplicationContext';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PencilIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';

function ReviewDecision() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const [declarations, setDeclarations] = useState(state.declarations || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decision, setDecision] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!state.applicantType || state.selectedProducts.length === 0) {
      navigate('/');
    }
  }, [state.applicantType, state.selectedProducts, navigate]);

  const calculateTotalAmount = () => {
    let total = 0;

    // Term Loan
    if (state.applicationDetails?.termLoan?.amountRequested) {
      total +=
        parseFloat(state.applicationDetails.termLoan.amountRequested) || 0;
    }

    // Green Loan
    if (state.applicationDetails?.greenLoan?.amountRequested) {
      total +=
        parseFloat(state.applicationDetails.greenLoan.amountRequested) || 0;
    }

    // Business Overdraft
    if (state.applicationDetails?.overdraft?.limitRequested) {
      total +=
        parseFloat(state.applicationDetails.overdraft.limitRequested) || 0;
    }

    // Business Credit Card
    if (state.applicationDetails?.creditCard?.limitRequested) {
      total +=
        parseFloat(state.applicationDetails.creditCard.limitRequested) || 0;
    }

    return total;
  };

  const getDocumentCount = () => {
    // Debug logging
    console.log('State.documents:', state.documents);
    console.log('State.uploadedDocuments:', state.uploadedDocuments);
    console.log('Type of uploadedDocuments:', typeof state.uploadedDocuments);

    // Check for documents in the context
    if (state.documents && Array.isArray(state.documents)) {
      console.log('Returning documents.length:', state.documents.length);
      return state.documents.length;
    }

    // Check for uploadedDocuments
    if (state.uploadedDocuments) {
      if (Array.isArray(state.uploadedDocuments)) {
        console.log(
          'Returning uploadedDocuments.length:',
          state.uploadedDocuments.length
        );
        return state.uploadedDocuments.length;
      }
      // If it's an object (like from our DocumentUploadSimplified component)
      if (typeof state.uploadedDocuments === 'object') {
        const count = Object.keys(state.uploadedDocuments).length;
        console.log('Returning object keys count:', count);
        return count;
      }
    }

    console.log('Returning 0 - no documents found');
    return 0;
  };

  const validateDeclarations = () => {
    const newErrors = {};

    if (!declarations.truthfulness) {
      newErrors.truthfulness =
        'You must confirm the truthfulness of your information';
    }
    if (!declarations.gdprConsent) {
      newErrors.gdprConsent =
        'GDPR consent is required to process your application';
    }
    if (!declarations.creditCheckConsent) {
      newErrors.creditCheckConsent = 'Credit check consent is required';
    }
    if (!declarations.termsAndConditions) {
      newErrors.termsAndConditions = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeclarationChange = (field, value) => {
    setDeclarations((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const simulateDecision = () => {
    // Always return approved outcome for demo purposes
    const approvedOutcome = {
      type: 'approved',
      title: 'Application Approved!',
      message: 'Congratulations! Your credit application has been approved.',
      details:
        'You will receive your credit agreement shortly. Please review and sign to complete the process.',
      nextSteps: [
        'Review the credit agreement terms',
        'Provide electronic signature',
        'Funds will be disbursed within 2-3 business days',
      ],
    };

    return approvedOutcome;
  };

  const handleSubmit = async () => {
    if (!validateDeclarations()) {
      return;
    }

    setIsSubmitting(true);

    // Update declarations in context
    dispatch(applicationActions.updateDeclarations(declarations));

    // Simulate API call delay
    setTimeout(() => {
      const decisionOutcome = simulateDecision();
      setDecision(decisionOutcome);
      dispatch(applicationActions.setDecisionOutcome(decisionOutcome));
      setIsSubmitting(false);
    }, 3000);
  };

  const handleContinue = () => {
    if (decision?.type === 'approved') {
      navigate('/credit-agreement');
    } else {
      navigate('/completion');
    }
  };

  const handleBack = () => {
    navigate('/document-upload');
  };

  const handleEdit = (section) => {
    switch (section) {
      case 'products':
        navigate('/');
        break;
      case 'applicant':
        navigate('/applicant-type');
        break;
      case 'customer':
        navigate('/customer-details');
        break;
      case 'application':
        navigate('/application-details');
        break;
      case 'documents':
        navigate('/document-upload');
        break;
      default:
        break;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (decision) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              decision.type === 'approved'
                ? 'bg-green-100'
                : decision.type === 'pending'
                ? 'bg-yellow-100'
                : 'bg-red-100'
            }`}
          >
            {decision.type === 'approved' && (
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            )}
            {decision.type === 'pending' && (
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            )}
            {decision.type === 'declined' && (
              <XCircleIcon className="h-8 w-8 text-red-600" />
            )}
          </div>

          <h1
            className={`text-3xl font-bold sm:text-4xl mb-4 ${
              decision.type === 'approved'
                ? 'text-green-800'
                : decision.type === 'pending'
                ? 'text-yellow-800'
                : 'text-red-800'
            }`}
          >
            {decision.title}
          </h1>

          <p className="text-lg text-gray-600 mb-2">{decision.message}</p>

          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            {decision.details}
          </p>
        </div>

        {/* Decision Details */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Next Steps
          </h2>
          <ul className="space-y-2">
            {decision.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {index + 1}
                  </span>
                </div>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Application Reference */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">
            Application Reference
          </h3>
          <p className="text-lg font-mono text-gray-900">
            SME-{Date.now().toString().slice(-8)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Please keep this reference number for your records
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <button onClick={handleContinue} className="btn-primary px-8 py-3">
            {decision.type === 'approved'
              ? 'Continue to Agreement'
              : 'Complete Application'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Review & Submit Application
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Please review your application details below and confirm the
          declarations before submitting your credit application.
        </p>
      </div>

      {/* Application Summary */}
      <div className="space-y-6">
        {/* Selected Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Selected Products
            </h2>
            <button
              onClick={() => handleEdit('products')}
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </button>
          </div>
          <div className="space-y-3">
            {state.selectedProducts.map((productId) => {
              let productDetails = null;
              let amount = 0;

              if (
                productId === 'term-loan' &&
                state.applicationDetails?.termLoan
              ) {
                productDetails = state.applicationDetails.termLoan;
                amount = parseFloat(productDetails.amountRequested) || 0;
              } else if (
                productId === 'green-loan' &&
                state.applicationDetails?.greenLoan
              ) {
                productDetails = state.applicationDetails.greenLoan;
                amount = parseFloat(productDetails.amountRequested) || 0;
              } else if (
                productId === 'business-overdraft' &&
                state.applicationDetails?.overdraft
              ) {
                productDetails = state.applicationDetails.overdraft;
                amount = parseFloat(productDetails.limitRequested) || 0;
              } else if (
                productId === 'business-credit-card' &&
                state.applicationDetails?.creditCard
              ) {
                productDetails = state.applicationDetails.creditCard;
                amount = parseFloat(productDetails.limitRequested) || 0;
              }

              return (
                <div key={productId} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {productId
                        .replace('-', ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <span className="font-semibold text-primary-600">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  {productDetails && (
                    <div className="mt-2 text-sm text-gray-600">
                      {productId.includes('loan') &&
                        productDetails.purposeOfCredit && (
                          <div>Purpose: {productDetails.purposeOfCredit}</div>
                        )}
                      {productId.includes('loan') &&
                        productDetails.repaymentTerm && (
                          <div>Term: {productDetails.repaymentTerm} months</div>
                        )}
                      {productId === 'green-loan' &&
                        productDetails.greenPurposeCategory && (
                          <div>
                            Green Category:{' '}
                            {productDetails.greenPurposeCategory}
                          </div>
                        )}
                      {productId === 'business-overdraft' &&
                        productDetails.overdraftPurpose && (
                          <div>
                            Purpose:{' '}
                            {productDetails.overdraftPurpose
                              .replace('-', ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                        )}
                      {productId === 'business-credit-card' &&
                        productDetails.cardPurpose && (
                          <div>
                            Primary Use:{' '}
                            {productDetails.cardPurpose
                              .replace('-', ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Total Amount Requested: {formatCurrency(calculateTotalAmount())}
          </div>
        </div>

        {/* Applicant Information */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Applicant Information
            </h2>
            <button
              onClick={() => handleEdit('customer')}
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Applicant Type:</span>
              <div className="font-medium">
                {state.applicantType
                  ?.replace('-', ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Business Name:</span>
              <div className="font-medium">
                {state.businessInfo.businessName}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Industry:</span>
              <div className="font-medium">
                {state.businessInfo.industryType}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Annual Turnover:</span>
              <div className="font-medium">
                {formatCurrency(state.businessInfo.annualTurnover || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Uploaded Documents
            </h2>
            <button
              onClick={() => handleEdit('documents')}
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </button>
          </div>
          <div className="text-sm text-gray-600">
            {getDocumentCount()} documents uploaded
          </div>
          <div className="flex items-center mt-2 text-green-600">
            <DocumentCheckIcon className="h-4 w-4 mr-1" />
            All required documents provided
          </div>
        </div>
      </div>

      {/* Declarations */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Declarations & Consent
        </h2>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="truthfulness"
              checked={declarations.truthfulness || false}
              onChange={(e) =>
                handleDeclarationChange('truthfulness', e.target.checked)
              }
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="truthfulness" className="text-sm text-gray-700">
              I confirm that all information provided in this application is
              true, accurate, and complete to the best of my knowledge. I
              understand that providing false or misleading information may
              result in application rejection or loan recall.
            </label>
          </div>
          {errors.truthfulness && (
            <p className="error-text ml-7">{errors.truthfulness}</p>
          )}

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="gdprConsent"
              checked={declarations.gdprConsent || false}
              onChange={(e) =>
                handleDeclarationChange('gdprConsent', e.target.checked)
              }
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="gdprConsent" className="text-sm text-gray-700">
              I consent to the collection, processing, and storage of my
              personal data in accordance with GDPR regulations. I understand my
              rights regarding data protection and how my information will be
              used.
            </label>
          </div>
          {errors.gdprConsent && (
            <p className="error-text ml-7">{errors.gdprConsent}</p>
          )}

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="creditCheckConsent"
              checked={declarations.creditCheckConsent || false}
              onChange={(e) =>
                handleDeclarationChange('creditCheckConsent', e.target.checked)
              }
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="creditCheckConsent"
              className="text-sm text-gray-700"
            >
              I authorize the bank to conduct credit checks with the Irish
              Credit Bureau (ICB) and other relevant credit reference agencies.
              I understand this may impact my credit file.
            </label>
          </div>
          {errors.creditCheckConsent && (
            <p className="error-text ml-7">{errors.creditCheckConsent}</p>
          )}

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="termsAndConditions"
              checked={declarations.termsAndConditions || false}
              onChange={(e) =>
                handleDeclarationChange('termsAndConditions', e.target.checked)
              }
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="termsAndConditions"
              className="text-sm text-gray-700"
            >
              I have read, understood, and agree to the{' '}
              <button
                type="button"
                onClick={() => window.open('/terms', '_blank')}
                className="text-primary-600 hover:text-primary-700 underline bg-transparent border-none p-0 cursor-pointer"
              >
                Terms and Conditions
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => window.open('/privacy', '_blank')}
                className="text-primary-600 hover:text-primary-700 underline bg-transparent border-none p-0 cursor-pointer"
              >
                Privacy Policy
              </button>
              .
            </label>
          </div>
          {errors.termsAndConditions && (
            <p className="error-text ml-7">{errors.termsAndConditions}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={isSubmitting}
          className="btn-secondary px-6 py-3"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary px-8 py-3 flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing Application...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </div>
  );
}

export default ReviewDecision;
