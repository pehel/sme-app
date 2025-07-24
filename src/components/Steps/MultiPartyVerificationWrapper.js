import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication, applicationActions } from '../../context/ApplicationContext';
import MultiPartyVerification from './MultiPartyVerification';

function MultiPartyVerificationWrapper() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();

  const handleVerificationComplete = (verificationData) => {
    // Store verification data in context
    dispatch(applicationActions.updateMultiPartyVerification(verificationData));
    
    // Navigate to next step
    navigate('/review-decision');
  };

  const handleBack = () => {
    navigate('/document-upload');
  };

  // Only render if we have the required data
  if (!state.applicantType) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Application Data Missing
        </h2>
        <p className="text-gray-600 mb-6">
          Please complete the previous steps before proceeding to multi-party verification.
        </p>
        <button
          onClick={() => navigate('/applicant-type')}
          className="btn-primary px-6 py-3"
        >
          Go to Applicant Type
        </button>
      </div>
    );
  }

  // Check if multi-party verification is actually required
  const isMultiPartyRequired = () => {
    if (state.applicantType === 'partnership') {
      return state.personalInfo.partners && state.personalInfo.partners.length > 0;
    } else if (state.applicantType === 'limited-company') {
      return state.personalInfo.beneficialOwners && state.personalInfo.beneficialOwners.length > 0;
    }
    return false;
  };

  if (!isMultiPartyRequired()) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Multi-Party Verification Not Required
        </h2>
        <p className="text-gray-600 mb-6">
          Based on your applicant type ({state.applicantType}) and the information provided, 
          multi-party verification is not required for this application.
        </p>
        <button
          onClick={() => navigate('/review-decision')}
          className="btn-primary px-6 py-3 mr-4"
        >
          Continue to Review
        </button>
        <button
          onClick={handleBack}
          className="btn-secondary px-6 py-3"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <MultiPartyVerification
      applicantType={state.applicantType}
      personalInfo={state.personalInfo}
      onVerificationComplete={handleVerificationComplete}
      onBack={handleBack}
    />
  );
}

export default MultiPartyVerificationWrapper;
