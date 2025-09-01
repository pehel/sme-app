import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const Demographics = () => {
  const navigate = useNavigate();
  const { selectedEntity } = useAppStore();
  const [isValidating, setIsValidating] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);

  // Mock demographics data (in real app, this would come from API)
  const [demographics, setDemographics] = useState({
    businessName: selectedEntity?.name || '',
    croNumber: selectedEntity?.croNumber || '',
    vatNumber: selectedEntity?.vatNumber || '',
    address: selectedEntity?.address || '',
    established: selectedEntity?.established || '',
    segment: selectedEntity?.segment || '',
    directors: selectedEntity?.directors || []
  });

  const handleValidateCRO = async () => {
    setIsValidating(true);
    
    // Simulate API call to CRO
    setTimeout(() => {
      setValidationComplete(true);
      setValidationSuccess(true);
      setIsValidating(false);
      
      // Mock: Update directors from CRO data
      setDemographics(prev => ({
        ...prev,
        directors: [
          ...prev.directors,
          // Could add new directors found in CRO
        ]
      }));
    }, 2000);
  };

  const handleFieldChange = (field, value) => {
    setDemographics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    if (validationSuccess) {
      navigate('/suitability');
    }
  };

  if (!selectedEntity) {
    navigate('/entity');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Business Demographics Review
        </h1>
        <p className="text-lg text-gray-600">
          Review and confirm your business details. We'll validate with the Companies Registration Office.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Demographics Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Business Information</h2>
            
            <div className="space-y-6">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={demographics.businessName}
                  onChange={(e) => handleFieldChange('businessName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* CRO Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CRO Number
                </label>
                <input
                  type="text"
                  value={demographics.croNumber}
                  onChange={(e) => handleFieldChange('croNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* VAT Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT Number
                  </label>
                  <input
                    type="text"
                    value={demographics.vatNumber}
                    onChange={(e) => handleFieldChange('vatNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Year Established */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Established
                  </label>
                  <input
                    type="text"
                    value={demographics.established}
                    onChange={(e) => handleFieldChange('established', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registered Address
                </label>
                <textarea
                  value={demographics.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Business Segment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Segment
                </label>
                <select
                  value={demographics.segment}
                  onChange={(e) => handleFieldChange('segment', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="SME_Retail">SME Retail</option>
                  <option value="SME_Tech">SME Technology</option>
                  <option value="SME_Manufacturing">SME Manufacturing</option>
                  <option value="SME_Services">SME Services</option>
                  <option value="SME_Hospitality">SME Hospitality</option>
                </select>
              </div>
            </div>

            {/* Directors Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Directors</h3>
              <div className="space-y-3">
                {demographics.directors.map((director, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Name</label>
                        <div className="font-medium text-gray-900">{director.name}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Role</label>
                        <div className="text-gray-700">{director.role}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                        <div className="text-gray-700">{director.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Validation Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">CRO Validation</h3>
            
            {!validationComplete ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-blue-50 rounded-lg p-4">
                  <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Ready to Validate</div>
                    <div className="text-sm text-blue-700">Click below to validate with CRO</div>
                  </div>
                </div>
                
                <button
                  onClick={handleValidateCRO}
                  disabled={isValidating}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isValidating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Validating with CRO...
                    </>
                  ) : (
                    'Validate with CRO'
                  )}
                </button>
                
                <div className="text-xs text-gray-600">
                  We'll verify your business details and pull director information from the Companies Registration Office.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {validationSuccess ? (
                  <div className="flex items-center space-x-3 bg-green-50 rounded-lg p-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Validation Successful</div>
                      <div className="text-sm text-green-700">All details verified with CRO</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 bg-red-50 rounded-lg p-4">
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                    <div>
                      <div className="font-medium text-red-900">Validation Failed</div>
                      <div className="text-sm text-red-700">Please check your details</div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Validation Results</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                      Business name verified
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                      CRO number valid
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                      Directors confirmed
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                      Status: Active
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/entity')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Entity Selection
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!validationSuccess}
          className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Product Suitability
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Demographics;
