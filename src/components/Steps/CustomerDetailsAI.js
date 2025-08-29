import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useApplication,
  applicationActions,
} from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import aiService from '../../services/aiService';
import BusinessInfoForm from '../Forms/BusinessInfoForm';
import PersonalInfoForm from '../Forms/PersonalInfoForm';
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

function CustomerDetailsAI() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const { user } = useAuth();
  const [errors, setErrors] = useState({});
  const [businessInfo, setBusinessInfo] = useState(state.businessInfo || {});
  const [personalInfo, setPersonalInfo] = useState(state.personalInfo || {});
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupResults, setLookupResults] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auto-populate data from logged-in user and set applicant type
  useEffect(() => {
    console.log('🔍 CustomerDetailsAI useEffect - user data:', user);
    console.log('🔍 Current state businessInfo:', state.businessInfo);
    console.log('🔍 Current state personalInfo:', state.personalInfo);
    
    if (user?.existingData && user?.isExistingCustomer) {
      console.log('🔄 Auto-populating customer data for EXISTING customer');
      console.log('🔄 User existing data:', user.existingData);
      
      // Set applicant type based on business structure (if not already set)
      if (!state.applicantType) {
        const defaultApplicantType = 'limited-company'; // Existing customers are typically limited companies
        console.log('🔄 Setting applicant type for existing customer:', defaultApplicantType);
        dispatch(applicationActions.setApplicantType(defaultApplicantType));
      }

      // Auto-populate business info if available and not already populated
      if (user.existingData.businessInfo && (!state.businessInfo?.businessName || Object.keys(state.businessInfo || {}).length <= 1)) {
        console.log('🔄 Auto-populating business info for existing customer:', user.existingData.businessInfo);
        setBusinessInfo(user.existingData.businessInfo);
        dispatch(applicationActions.updateBusinessInfo(user.existingData.businessInfo));
      } else if (state.businessInfo && Object.keys(state.businessInfo).length > 0) {
        console.log('🔄 Using existing business info from state');
        setBusinessInfo(state.businessInfo);
      }

      // Auto-populate personal info if available and not already populated  
      if (user.existingData.personalInfo && (!state.personalInfo?.firstName || Object.keys(state.personalInfo || {}).length <= 3)) {
        console.log('🔄 Auto-populating personal info for existing customer:', user.existingData.personalInfo);
        
        // Transform user personal data to match form structure
        const userPersonalData = user.existingData.personalInfo;
        const transformedPersonalInfo = {
          // For existing customers, we'll put their info as the beneficial owner
          beneficialOwners: [{
            fullName: `${userPersonalData.firstName} ${userPersonalData.lastName}`,
            dateOfBirth: userPersonalData.dateOfBirth,
            nationality: userPersonalData.nationality,
            address: `${userPersonalData.address?.street}, ${userPersonalData.address?.city}, ${userPersonalData.address?.county}, ${userPersonalData.address?.postalCode}`,
            email: userPersonalData.email,
            phone: userPersonalData.phone,
            ppsn: userPersonalData.ppsn,
            position: userPersonalData.position || 'Director',
            sharePercentage: '100',
            isDirector: true
          }],
          owners: [{
            fullName: `${userPersonalData.firstName} ${userPersonalData.lastName}`,
            dateOfBirth: userPersonalData.dateOfBirth,
            nationality: userPersonalData.nationality,
            address: `${userPersonalData.address?.street}, ${userPersonalData.address?.city}, ${userPersonalData.address?.county}, ${userPersonalData.address?.postalCode}`,
            email: userPersonalData.email,
            phone: userPersonalData.phone,
            ppsn: userPersonalData.ppsn,
            occupation: userPersonalData.position || 'Business Owner'
          }],
          partners: [] // Empty for existing customers who are typically limited companies
        };
        
        setPersonalInfo(transformedPersonalInfo);
        dispatch(applicationActions.updatePersonalInfo(transformedPersonalInfo));
      } else if (state.personalInfo && Object.keys(state.personalInfo).length > 0) {
        console.log('🔄 Using existing personal info from state');
        setPersonalInfo(state.personalInfo);
      }
    } else if (user && !user.isExistingCustomer) {
      console.log('🆕 NEW customer - NOT auto-populating customer details');
      
      // For new customers, only set applicant type if not already set
      if (!state.applicantType) {
        const defaultApplicantType = 'sole-trader'; // New customers often start as sole traders
        console.log('🔄 Setting applicant type for new customer:', defaultApplicantType);
        dispatch(applicationActions.setApplicantType(defaultApplicantType));
      }
      
      // Don't auto-populate data for new customers - let them fill forms manually
      // Still set from state if available (from previous form inputs)
      if (state.businessInfo) setBusinessInfo(state.businessInfo);
      if (state.personalInfo) setPersonalInfo(state.personalInfo);
    } else {
      console.log('⚠️ No user data or unknown customer type');
      // Still set from state if available
      if (state.businessInfo) setBusinessInfo(state.businessInfo);
      if (state.personalInfo) setPersonalInfo(state.personalInfo);
    }
  }, [user, dispatch, state.applicantType, state.businessInfo, state.personalInfo]);

  // Redirect logic - skip applicant type for existing customers with data
  useEffect(() => {
    if (!state.applicantType && !user?.existingData) {
      navigate('/applicant-type');
    }
  }, [state.applicantType, navigate, user]);

  // AI-powered company lookup
  const handleCompanyLookup = async (registrationNumber) => {
    if (!registrationNumber || registrationNumber.length < 5) return;

    setIsLookingUp(true);
    try {
      const companyData = await aiService.extractBusinessInfo(
        registrationNumber
      );
      setLookupResults(companyData);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Company lookup failed:', error);
      setErrors((prev) => ({
        ...prev,
        lookup:
          'Failed to retrieve company information. Please enter details manually.',
      }));
    }
    setIsLookingUp(false);
  };

  // Apply AI suggestions to form
  const applyAISuggestions = () => {
    if (!lookupResults) return;

    const updatedBusinessInfo = {
      ...businessInfo,
      // Core company details
      businessName: lookupResults.companyName,
      registrationNumber: lookupResults.registrationNumber,
      registeredAddress: `${lookupResults.address.street}, ${lookupResults.address.city}, ${lookupResults.address.county}, ${lookupResults.address.eircode}`,
      incorporationDate: lookupResults.incorporationDate,
      companyType: lookupResults.companyType,
      // Enhanced AI-extracted details
      phone: lookupResults.phone,
      email: lookupResults.email,
      website: lookupResults.website,
      vatNumber: lookupResults.vatNumber,
      taxReference: lookupResults.taxReference,
      croNumber: lookupResults.croNumber,
      yearEstablished: lookupResults.yearEstablished,
      industry: lookupResults.industry,
      sicCode: lookupResults.sicCode,
      employeeCount: lookupResults.employeeCount,
      annualTurnover: lookupResults.annualTurnover,
      bankAccount: lookupResults.bankDetails?.accountNumber,
      aiExtracted: true,
    };

    // Extract director information for personal info
    const updatedPersonalInfo = { ...personalInfo };
    if (lookupResults.directors && lookupResults.directors.length > 0) {
      if (state.applicantType === 'limited-company') {
        updatedPersonalInfo.beneficialOwners = lookupResults.directors.map(
          (director) => ({
            fullName: director.name,
            dateOfBirth: director.dateOfBirth,
            nationality: director.nationality,
            position: director.position,
            email: director.email || '',
            phone: director.phone || '',
            isDirector: true,
            sharePercentage:
              lookupResults.shareholders?.find((s) => s.name === director.name)
                ?.percentage || 0,
            aiExtracted: true,
          })
        );
      }
    }

    setBusinessInfo(updatedBusinessInfo);
    setPersonalInfo(updatedPersonalInfo);
    setShowSuggestions(false);
    setLookupResults(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check if this is an existing customer with auto-populated data
    const isExistingCustomerWithData = user?.isExistingCustomer && user?.existingData && (
      user.existingData.businessInfo || user.existingData.personalInfo
    );

    console.log('📝 Validating form - isExistingCustomerWithData:', isExistingCustomerWithData);

    // Business Info Validation - more lenient for existing customers with auto-populated data
    if (!businessInfo.businessName?.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!isExistingCustomerWithData && !businessInfo.registeredAddress?.trim()) {
      newErrors.registeredAddress = 'Registered address is required';
    }

    if (
      !isExistingCustomerWithData &&
      state.applicantType === 'limited-company' &&
      !businessInfo.registrationNumber?.trim()
    ) {
      newErrors.registrationNumber = 'Company registration number is required';
    }

    if (!isExistingCustomerWithData && !businessInfo.industry?.trim()) {
      newErrors.industry = 'Industry is required';
    }

    // Personal Info Validation - more lenient for existing customers with auto-populated data
    if (!isExistingCustomerWithData) {
      if (state.applicantType === 'sole-trader') {
        if (!personalInfo.owners || personalInfo.owners.length === 0) {
          newErrors.owners = 'Owner information is required';
        }
      } else if (state.applicantType === 'partnership') {
        if (!personalInfo.partners || personalInfo.partners.length < 2) {
          newErrors.partners = 'At least 2 partners are required';
        }
      } else if (state.applicantType === 'limited-company') {
        if (
          !personalInfo.beneficialOwners ||
          personalInfo.beneficialOwners.length === 0
        ) {
          newErrors.beneficialOwners =
            'Beneficial owners/directors information is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    console.log('🔄 Continue button clicked');
    console.log('📋 Current form state:', { businessInfo, personalInfo, applicantType: state.applicantType });
    
    const isValid = validateForm();
    console.log('✅ Form validation result:', isValid);
    console.log('❌ Validation errors:', errors);
    
    if (isValid) {
      console.log('✅ Form is valid, proceeding to next step');
      // Get AI suggestions for form completion
      try {
        const suggestions = await aiService.suggestFormData(
          {
            businessInfo,
            personalInfo,
            applicantType: state.applicantType,
          },
          'customer-details'
        );

        // Apply suggestions to business info
        const enhancedBusinessInfo = {
          ...businessInfo,
          ...suggestions.businessAddress,
        };

        dispatch(applicationActions.updateBusinessInfo(enhancedBusinessInfo));
        dispatch(applicationActions.updatePersonalInfo(personalInfo));
        console.log('🚀 Navigating to application details');
        navigate('/application-details');
      } catch (error) {
        console.error('AI suggestions failed:', error);
        // Continue without AI enhancement
        dispatch(applicationActions.updateBusinessInfo(businessInfo));
        dispatch(applicationActions.updatePersonalInfo(personalInfo));
        console.log('🚀 Navigating to application details (without AI)');
        navigate('/application-details');
      }
    } else {
      console.log('❌ Form validation failed, not proceeding');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Customer Details
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Enter your business and personal details.
        </p>
      </div>

      {/* AI Company Lookup Section */}
      {(state.applicantType === 'limited-company' ||
        state.applicantType === 'partnership') && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Company Lookup
            </h3>
          </div>

          <p className="text-gray-600 mb-4">
            Enter your company registration number.
          </p>

          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter Company Registration Number (e.g., 634789)"
                value={businessInfo.registrationNumber || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setBusinessInfo((prev) => ({
                    ...prev,
                    registrationNumber: value,
                  }));
                  if (value.length >= 5) {
                    handleCompanyLookup(value);
                  }
                }}
                className="input-field"
              />
            </div>
            <button
              onClick={() =>
                handleCompanyLookup(businessInfo.registrationNumber)
              }
              disabled={isLookingUp || !businessInfo.registrationNumber}
              className="btn-primary px-4 py-2 flex items-center"
            >
              {isLookingUp ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Looking up...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Lookup
                </>
              )}
            </button>
          </div>

          {errors.lookup && (
            <div className="mt-3 text-sm text-red-600 flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
              {errors.lookup}
            </div>
          )}
        </div>
      )}

      {/* AI Suggestions */}
      {showSuggestions && lookupResults && (
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                Company Information Found
              </h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {Math.round(lookupResults.confidence * 100)}% confidence
              </span>
            </div>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-600">Company Name:</span>
              <div className="font-medium">{lookupResults.companyName}</div>
            </div>
            <div>
              <span className="text-gray-600">Registration:</span>
              <div className="font-medium">
                {lookupResults.registrationNumber}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Industry:</span>
              <div className="font-medium">{lookupResults.industry}</div>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <div className="font-medium text-green-600">
                {lookupResults.status}
              </div>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Address:</span>
              <div className="font-medium">
                {lookupResults.address.street}, {lookupResults.address.city},{' '}
                {lookupResults.address.county}
              </div>
            </div>
          </div>

          {lookupResults.aiInsights && (
            <div className="mb-4">
              <div className="text-sm font-medium text-green-800 mb-2">
                AI Insights:
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                {lookupResults.aiInsights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={applyAISuggestions}
              className="btn-primary px-4 py-2 text-sm"
            >
              Auto-fill Form with This Information
            </button>
            <button
              onClick={() => setShowSuggestions(false)}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Enter Manually
            </button>
          </div>
        </div>
      )}

      {/* Business Information Form */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Business Information
          </h2>
          {businessInfo.aiExtracted && (
            <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
              <SparklesIcon className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600">AI Enhanced</span>
            </div>
          )}
        </div>

        <BusinessInfoForm
          applicantType={state.applicantType}
          businessInfo={businessInfo}
          updateBusinessInfo={(updates) =>
            setBusinessInfo((prev) => ({ ...prev, ...updates }))
          }
          errors={errors}
          setErrors={setErrors}
        />
      </div>

      {/* Personal Information Form */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Personal Information
          </h2>
          {personalInfo.aiExtracted && (
            <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
              <SparklesIcon className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600">AI Enhanced</span>
            </div>
          )}
        </div>

        <PersonalInfoForm
          applicantType={state.applicantType}
          personalInfo={personalInfo}
          updatePersonalInfo={(updates) =>
            setPersonalInfo((prev) => ({ ...prev, ...updates }))
          }
          errors={errors}
          setErrors={setErrors}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/applicant-type')}
          className="btn-secondary px-6 py-3"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="btn-primary px-8 py-3 flex items-center"
        >
          Continue to Application Details
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
}

export default CustomerDetailsAI;
