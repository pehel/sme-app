import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication, applicationActions } from '../../context/ApplicationContext';
import { 
  UserIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

const applicantTypes = [
  {
    id: 'sole-trader',
    name: 'Sole Trader',
    description: 'Individual trading in their own name or under a business name.',
    icon: UserIcon,
    requirements: ['Personal identification', 'Business registration (if applicable)', 'Tax reference number'],
    suitable: 'Perfect for individual professionals, consultants, and small businesses'
  },
  {
    id: 'partnership',
    name: 'Partnership',
    description: 'Two or more people trading together with shared profits and losses.',
    icon: UsersIcon,
    requirements: ['Partnership agreement', 'All partners identification', 'Partnership tax number'],
    suitable: 'Ideal for professional services, joint ventures, and family businesses'
  },
  {
    id: 'limited-company',
    name: 'Limited Company',
    description: 'Incorporated company with limited liability for shareholders.',
    icon: BuildingOfficeIcon,
    requirements: ['Certificate of incorporation', 'CRO number', 'Directors identification'],
    suitable: 'Best for established businesses seeking growth capital and limited liability'
  },
  {
    id: 'other-organization',
    name: 'Other Organization',
    description: 'Clubs, societies, charities, or other legal entities.',
    icon: BuildingLibraryIcon,
    requirements: ['Constitution/articles', 'Registration certificates', 'Authorized representatives ID'],
    suitable: 'For non-profits, clubs, societies, and specialized business structures'
  }
];

function ApplicantTypeSelection() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const [selectedType, setSelectedType] = useState(state.applicantType || '');
  const [errors, setErrors] = useState({});

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    // Clear validation error when user makes a selection
    if (errors.applicantType) {
      setErrors({});
    }
  };

  const handleNext = () => {
    if (!selectedType) {
      setErrors({ applicantType: 'Please select your applicant type to continue.' });
      return;
    }

    dispatch(applicationActions.setApplicantType(selectedType));
    navigate('/customer-details');
  };

  const handleBack = () => {
    navigate('/');
  };

  const isTypeSelected = (typeId) => selectedType === typeId;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Select Your Applicant Type
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the option that best describes your business structure. This helps us 
          customize the application process and required documentation.
        </p>
      </div>

      {/* Applicant Type Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {applicantTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = isTypeSelected(type.id);

          return (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={`card card-selectable text-left w-full ${isSelected ? 'card-selected' : ''}`}
              aria-pressed={isSelected}
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${
                    isSelected ? 'bg-primary-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      isSelected ? 'text-primary-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {type.name}
                      </h3>
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <div className="h-5 w-5 rounded-full bg-primary-600 flex items-center justify-center">
                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600">
                      {type.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Key Requirements:
                    </h4>
                    <ul className="space-y-1">
                      {type.requirements.map((requirement, index) => (
                        <li key={`${type.id}-req-${index}`} className="flex items-center text-sm text-gray-600">
                          <svg className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-500 italic">
                      {type.suitable}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Error Message */}
      {errors.applicantType && (
        <div className="text-center">
          <p className="error-text">{errors.applicantType}</p>
        </div>
      )}

      {/* Selected Type Summary */}
      {selectedType && (
        <div className="bg-primary-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-primary-800 mb-2">
            Selected Applicant Type
          </h3>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              {applicantTypes.find(type => type.id === selectedType)?.name}
            </span>
          </div>
        </div>
      )}

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
          disabled={!selectedType}
          className="btn-primary px-8 py-3"
        >
          Continue
        </button>
      </div>

      {/* Compliance Note */}
      <div className="bg-amber-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-amber-800 mb-2">
          <span className="flex items-center">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Important Compliance Information
          </span>
        </h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• All applicant types must comply with KYC (Know Your Customer) requirements</li>
          <li>• Beneficial ownership information required for companies and partnerships (≥25% ownership)</li>
          <li>• Anti-Money Laundering (AML) checks will be performed on all applicants</li>
          <li>• Documentation requirements vary by applicant type and must be in English or with certified translation</li>
        </ul>
      </div>
    </div>
  );
}

export default ApplicantTypeSelection;
