import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication, applicationActions } from '../../context/ApplicationContext';
import BusinessInfoForm from '../Forms/BusinessInfoForm';
import PersonalInfoForm from '../Forms/PersonalInfoForm';

function CustomerDetails() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const [errors, setErrors] = useState({});
  const [businessInfo, setBusinessInfo] = useState(state.businessInfo || {});
  const [personalInfo, setPersonalInfo] = useState(state.personalInfo || {});

  // Redirect if no applicant type selected
  useEffect(() => {
    if (!state.applicantType) {
      navigate('/applicant-type');
    }
  }, [state.applicantType, navigate]);

  const validateForm = () => {
    const newErrors = {};

    // Business Info Validation
    if (!businessInfo.businessName?.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!businessInfo.registeredAddress?.trim()) {
      newErrors.registeredAddress = 'Registered address is required';
    }
    
    if (!businessInfo.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(businessInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!businessInfo.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!businessInfo.industryType) {
      newErrors.industryType = 'Industry type is required';
    }
    
    if (!businessInfo.numberOfEmployees) {
      newErrors.numberOfEmployees = 'Number of employees is required';
    }
    
    if (!businessInfo.annualTurnover?.trim()) {
      newErrors.annualTurnover = 'Annual turnover is required';
    }
    
    if (!businessInfo.yearEstablished?.trim()) {
      newErrors.yearEstablished = 'Year established is required';
    } else {
      const year = parseInt(businessInfo.yearEstablished);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        newErrors.yearEstablished = 'Please enter a valid year';
      }
    }

    // Business Identifier Validation based on applicant type
    if (state.applicantType === 'sole-trader') {
      if (!businessInfo.businessIdentifiers?.ppsn?.trim()) {
        newErrors.ppsn = 'PPSN is required for sole traders';
      }
    } else if (state.applicantType === 'limited-company') {
      if (!businessInfo.businessIdentifiers?.croNumber?.trim()) {
        newErrors.croNumber = 'CRO Number is required for limited companies';
      }
      if (!businessInfo.businessIdentifiers?.trn?.trim()) {
        newErrors.trn = 'Tax Reference Number is required';
      }
    }

    // Personal Info Validation based on applicant type
    if (state.applicantType === 'sole-trader') {
      if (!personalInfo.owners?.[0]?.fullName?.trim()) {
        newErrors.ownerName = 'Full name is required';
      }
      if (!personalInfo.owners?.[0]?.dateOfBirth?.trim()) {
        newErrors.ownerDob = 'Date of birth is required';
      }
      if (!personalInfo.owners?.[0]?.address?.trim()) {
        newErrors.ownerAddress = 'Address is required';
      }
      if (!personalInfo.owners?.[0]?.ppsn?.trim()) {
        newErrors.ownerPpsn = 'PPSN is required';
      }
    } else if (state.applicantType === 'partnership') {
      if (!personalInfo.partners || personalInfo.partners.length === 0) {
        newErrors.partners = 'At least one partner must be added';
      } else {
        personalInfo.partners.forEach((partner, index) => {
          if (!partner.fullName?.trim()) {
            newErrors[`partner${index}Name`] = `Partner ${index + 1} name is required`;
          }
          if (!partner.dateOfBirth?.trim()) {
            newErrors[`partner${index}Dob`] = `Partner ${index + 1} date of birth is required`;
          }
          if (!partner.ppsn?.trim()) {
            newErrors[`partner${index}Ppsn`] = `Partner ${index + 1} PPSN is required`;
          }
        });
      }
    } else if (state.applicantType === 'limited-company') {
      if (!personalInfo.beneficialOwners || personalInfo.beneficialOwners.length === 0) {
        newErrors.beneficialOwners = 'At least one beneficial owner must be added';
      } else {
        personalInfo.beneficialOwners.forEach((owner, index) => {
          if (!owner.fullName?.trim()) {
            newErrors[`owner${index}Name`] = `Beneficial owner ${index + 1} name is required`;
          }
          if (!owner.dateOfBirth?.trim()) {
            newErrors[`owner${index}Dob`] = `Beneficial owner ${index + 1} date of birth is required`;
          }
          if (!owner.sharePercentage || owner.sharePercentage < 0 || owner.sharePercentage > 100) {
            newErrors[`owner${index}Share`] = `Valid share percentage is required`;
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      dispatch(applicationActions.updateBusinessInfo(businessInfo));
      dispatch(applicationActions.updatePersonalInfo(personalInfo));
      navigate('/application-details');
    }
  };

  const handleBack = () => {
    navigate('/applicant-type');
  };

  const updateBusinessInfo = (updates) => {
    setBusinessInfo(prev => ({ ...prev, ...updates }));
    // Clear related errors
    const updatedErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      delete updatedErrors[key];
    });
    setErrors(updatedErrors);
  };

  const updatePersonalInfo = (updates) => {
    setPersonalInfo(prev => ({ ...prev, ...updates }));
    // Clear related errors
    const updatedErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      delete updatedErrors[key];
    });
    setErrors(updatedErrors);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Customer Details
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Please provide your business and personal information. All fields marked with * are required.
        </p>
      </div>

      <div className="space-y-8">
        {/* Business Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Business Information
          </h2>
          <BusinessInfoForm
            applicantType={state.applicantType}
            businessInfo={businessInfo}
            updateBusinessInfo={updateBusinessInfo}
            errors={errors}
          />
        </div>

        {/* Personal Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Personal Information
          </h2>
          <PersonalInfoForm
            applicantType={state.applicantType}
            personalInfo={personalInfo}
            updatePersonalInfo={updatePersonalInfo}
            errors={errors}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="btn-secondary px-6 py-3"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="btn-primary px-8 py-3"
        >
          Continue
        </button>
      </div>

      {/* Data Protection Notice */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          <span className="flex items-center">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Data Protection & Privacy
          </span>
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Your personal data is processed in accordance with GDPR regulations</li>
          <li>• Information is encrypted and stored securely in Ireland</li>
          <li>• Data is only used for credit assessment and regulatory compliance</li>
          <li>• You have the right to access, correct, or delete your personal data</li>
        </ul>
      </div>
    </div>
  );
}

export default CustomerDetails;
