import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication, applicationActions } from '../../context/ApplicationContext';

const purposeOptions = [
  'Working Capital',
  'Equipment Purchase',
  'Business Expansion',
  'Property Purchase',
  'Inventory/Stock',
  'Marketing/Advertising',
  'Technology Upgrade',
  'Debt Consolidation',
  'Seasonal Cash Flow',
  'Other'
];

const repaymentTerms = [
  { value: '12', label: '1 Year' },
  { value: '24', label: '2 Years' },
  { value: '36', label: '3 Years' },
  { value: '48', label: '4 Years' },
  { value: '60', label: '5 Years' },
  { value: '84', label: '7 Years' },
  { value: '120', label: '10 Years' }
];

const repaymentFrequencies = [
  'Monthly',
  'Quarterly',
  'Semi-Annually',
  'Annually'
];

const greenPurposeCategories = [
  'Renewable Energy (Solar, Wind)',
  'Energy Efficiency Improvements',
  'Electric Vehicle Fleet',
  'Sustainable Building/Renovation',
  'Waste Reduction Systems',
  'Water Conservation',
  'Organic/Sustainable Agriculture',
  'Green Technology R&D',
  'Carbon Reduction Initiatives',
  'Other Environmental Projects'
];

function ApplicationDetails() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const [applicationDetails, setApplicationDetails] = useState(state.applicationDetails || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!state.applicantType || state.selectedProducts.length === 0) {
      navigate('/');
    }
  }, [state.applicantType, state.selectedProducts, navigate]);

  const hasProduct = (productId) => state.selectedProducts.includes(productId);

  const validateForm = () => {
    const newErrors = {};

    // Common fields validation
    if (!applicationDetails.purposeOfCredit) {
      newErrors.purposeOfCredit = 'Purpose of credit is required';
    }

    if (!applicationDetails.amountRequested) {
      newErrors.amountRequested = 'Amount requested is required';
    } else {
      const amount = parseFloat(applicationDetails.amountRequested);
      if (amount <= 0) {
        newErrors.amountRequested = 'Amount must be greater than 0';
      }
    }

    // Product-specific validation
    if (hasProduct('term-loan') || hasProduct('green-loan')) {
      if (!applicationDetails.termLoan?.repaymentTerm) {
        newErrors.repaymentTerm = 'Repayment term is required';
      }
      if (!applicationDetails.termLoan?.repaymentFrequency) {
        newErrors.repaymentFrequency = 'Repayment frequency is required';
      }
    }

    if (hasProduct('green-loan') && !applicationDetails.greenLoan?.greenPurposeCategory) {
      newErrors.greenPurposeCategory = 'Green purpose category is required for Green Loan';
    }

    if (hasProduct('business-overdraft')) {
      if (!applicationDetails.overdraft?.limitRequested) {
        newErrors.overdraftLimit = 'Overdraft limit is required';
      }
      if (!applicationDetails.overdraft?.overdraftPurpose) {
        newErrors.overdraftPurpose = 'Overdraft purpose is required';
      }
    }

    if (hasProduct('business-credit-card')) {
      if (!applicationDetails.creditCard?.creditLimitRequested) {
        newErrors.creditCardLimit = 'Credit limit is required';
      }
      if (!applicationDetails.creditCard?.nameOnCard) {
        newErrors.nameOnCard = 'Name on card is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      dispatch(applicationActions.updateApplicationDetails(applicationDetails));
      navigate('/document-upload');
    }
  };

  const handleBack = () => {
    navigate('/customer-details');
  };

  const updateField = (section, field, value) => {
    setApplicationDetails(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    const errorKey = section === 'termLoan' ? field : 
                    section === 'overdraft' ? `overdraft${field.charAt(0).toUpperCase() + field.slice(1)}` :
                    section === 'creditCard' ? field :
                    field;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: undefined }));
    }
  };

  const updateCommonField = (field, value) => {
    setApplicationDetails(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Application Details
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Provide specific details about your credit requirements for each selected product.
        </p>
      </div>

      {/* Selected Products Summary */}
      <div className="bg-primary-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-primary-800 mb-2">
          Selected Products
        </h3>
        <div className="flex flex-wrap gap-2">
          {state.selectedProducts.map((productId) => (
            <span
              key={productId}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {productId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* Common Fields */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            General Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="purposeOfCredit" className="label-text">
                  Purpose of Credit *
                </label>
                <select
                  id="purposeOfCredit"
                  value={applicationDetails.purposeOfCredit || ''}
                  onChange={(e) => updateCommonField('purposeOfCredit', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select purpose</option>
                  {purposeOptions.map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
                {errors.purposeOfCredit && (
                  <p className="error-text">{errors.purposeOfCredit}</p>
                )}
              </div>

              <div>
                <label htmlFor="amountRequested" className="label-text">
                  Total Amount Requested (€) *
                </label>
                <input
                  type="number"
                  id="amountRequested"
                  value={applicationDetails.amountRequested || ''}
                  onChange={(e) => updateCommonField('amountRequested', e.target.value)}
                  className="input-field"
                  placeholder="50000"
                  min="0"
                />
                {errors.amountRequested && (
                  <p className="error-text">{errors.amountRequested}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="existingDebts" className="label-text">
                  Existing Business Debts (€)
                </label>
                <input
                  type="number"
                  id="existingDebts"
                  value={applicationDetails.existingDebts || ''}
                  onChange={(e) => updateCommonField('existingDebts', e.target.value)}
                  className="input-field"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include loans, overdrafts, credit cards, etc.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Term Loan / Green Loan Specific */}
        {(hasProduct('term-loan') || hasProduct('green-loan')) && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {hasProduct('green-loan') ? 'Green Loan Details' : 'Term Loan Details'}
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="repaymentTerm" className="label-text">
                    Repayment Term *
                  </label>
                  <select
                    id="repaymentTerm"
                    value={applicationDetails.termLoan?.repaymentTerm || ''}
                    onChange={(e) => updateField('termLoan', 'repaymentTerm', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select term</option>
                    {repaymentTerms.map((term) => (
                      <option key={term.value} value={term.value}>
                        {term.label}
                      </option>
                    ))}
                  </select>
                  {errors.repaymentTerm && (
                    <p className="error-text">{errors.repaymentTerm}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="repaymentFrequency" className="label-text">
                    Repayment Frequency *
                  </label>
                  <select
                    id="repaymentFrequency"
                    value={applicationDetails.termLoan?.repaymentFrequency || ''}
                    onChange={(e) => updateField('termLoan', 'repaymentFrequency', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select frequency</option>
                    {repaymentFrequencies.map((frequency) => (
                      <option key={frequency} value={frequency}>
                        {frequency}
                      </option>
                    ))}
                  </select>
                  {errors.repaymentFrequency && (
                    <p className="error-text">{errors.repaymentFrequency}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="collateralOffered" className="label-text">
                  Collateral Offered (Optional)
                </label>
                <textarea
                  id="collateralOffered"
                  rows={3}
                  value={applicationDetails.termLoan?.collateralOffered || ''}
                  onChange={(e) => updateField('termLoan', 'collateralOffered', e.target.value)}
                  className="input-field"
                  placeholder="Describe any collateral you wish to offer (property, equipment, etc.)"
                />
              </div>

              {hasProduct('green-loan') && (
                <div>
                  <label htmlFor="greenPurposeCategory" className="label-text">
                    Green Purpose Category *
                  </label>
                  <select
                    id="greenPurposeCategory"
                    value={applicationDetails.greenLoan?.greenPurposeCategory || ''}
                    onChange={(e) => updateField('greenLoan', 'greenPurposeCategory', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select green purpose</option>
                    {greenPurposeCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.greenPurposeCategory && (
                    <p className="error-text">{errors.greenPurposeCategory}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Business Overdraft Specific */}
        {hasProduct('business-overdraft') && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Business Overdraft Details
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="overdraftLimit" className="label-text">
                    Overdraft Limit Requested (€) *
                  </label>
                  <input
                    type="number"
                    id="overdraftLimit"
                    value={applicationDetails.overdraft?.limitRequested || ''}
                    onChange={(e) => updateField('overdraft', 'limitRequested', e.target.value)}
                    className="input-field"
                    placeholder="25000"
                    min="0"
                  />
                  {errors.overdraftLimit && (
                    <p className="error-text">{errors.overdraftLimit}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="existingAccount" className="label-text">
                    Existing Account Selection
                  </label>
                  <select
                    id="existingAccount"
                    value={applicationDetails.overdraft?.existingAccount || ''}
                    onChange={(e) => updateField('overdraft', 'existingAccount', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select account or create new</option>
                    <option value="new">Create New Business Account</option>
                    <option value="existing1">Business Current Account (...1234)</option>
                    <option value="existing2">Business Current Account (...5678)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="overdraftPurpose" className="label-text">
                  Overdraft Purpose *
                </label>
                <textarea
                  id="overdraftPurpose"
                  rows={3}
                  value={applicationDetails.overdraft?.overdraftPurpose || ''}
                  onChange={(e) => updateField('overdraft', 'overdraftPurpose', e.target.value)}
                  className="input-field"
                  placeholder="Describe how you plan to use the overdraft facility"
                />
                {errors.overdraftPurpose && (
                  <p className="error-text">{errors.overdraftPurpose}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Business Credit Card Specific */}
        {hasProduct('business-credit-card') && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Business Credit Card Details
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="creditCardLimit" className="label-text">
                    Credit Limit Requested (€) *
                  </label>
                  <input
                    type="number"
                    id="creditCardLimit"
                    value={applicationDetails.creditCard?.creditLimitRequested || ''}
                    onChange={(e) => updateField('creditCard', 'creditLimitRequested', e.target.value)}
                    className="input-field"
                    placeholder="10000"
                    min="0"
                  />
                  {errors.creditCardLimit && (
                    <p className="error-text">{errors.creditCardLimit}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nameOnCard" className="label-text">
                    Name to Appear on Card *
                  </label>
                  <input
                    type="text"
                    id="nameOnCard"
                    value={applicationDetails.creditCard?.nameOnCard || ''}
                    onChange={(e) => updateField('creditCard', 'nameOnCard', e.target.value)}
                    className="input-field"
                    placeholder="John Doe"
                  />
                  {errors.nameOnCard && (
                    <p className="error-text">{errors.nameOnCard}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="companyNameOnCard" className="label-text">
                  Company Name on Card (Optional)
                </label>
                <input
                  type="text"
                  id="companyNameOnCard"
                  value={applicationDetails.creditCard?.companyNameOnCard || ''}
                  onChange={(e) => updateField('creditCard', 'companyNameOnCard', e.target.value)}
                  className="input-field"
                  placeholder="Your Business Name Ltd"
                />
              </div>
            </div>
          </div>
        )}
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
          Continue to Documents
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-green-800 mb-2">
          Application Tips
        </h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Be accurate with requested amounts - this affects your approval chances</li>
          <li>• Green loans offer preferential rates for qualifying environmental projects</li>
          <li>• Overdraft facilities provide flexibility for managing cash flow</li>
          <li>• Credit cards offer rewards and expense management features</li>
        </ul>
      </div>
    </div>
  );
}

export default ApplicationDetails;
