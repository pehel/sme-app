import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useApplication,
  applicationActions,
} from '../../context/ApplicationContext';
import {
  CurrencyEuroIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  CalculatorIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

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
  'Other',
];

const repaymentTerms = [
  { value: '12', label: '1 Year' },
  { value: '24', label: '2 Years' },
  { value: '36', label: '3 Years' },
  { value: '48', label: '4 Years' },
  { value: '60', label: '5 Years' },
  { value: '84', label: '7 Years' },
  { value: '120', label: '10 Years' },
];

const repaymentFrequencies = [
  { value: 'monthly', label: 'Monthly', multiplier: 12 },
  { value: 'quarterly', label: 'Quarterly', multiplier: 4 },
  { value: 'semi-annually', label: 'Semi-Annually', multiplier: 2 },
  { value: 'annually', label: 'Annually', multiplier: 1 },
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
  'Other Environmental Projects',
];

function ApplicationDetailsEnhanced() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const [applicationDetails, setApplicationDetails] = useState(
    state.applicationDetails || {}
  );
  const [errors, setErrors] = useState({});
  const [quotes, setQuotes] = useState({});

  useEffect(() => {
    if (!state.applicantType || state.selectedProducts.length === 0) {
      navigate('/');
    }
  }, [state.applicantType, state.selectedProducts, navigate]);

  const hasProduct = useCallback(
    (productId) => state.selectedProducts.includes(productId),
    [state.selectedProducts]
  );

  // Calculate loan quotes in real-time
  const calculateQuote = (
    amount,
    termMonths,
    frequency = 'monthly',
    isGreen = false
  ) => {
    const principal = parseFloat(amount) || 0;
    if (principal <= 0 || !termMonths) return null;

    // Base interest rates
    let annualRate = isGreen ? 0.045 : 0.055; // Green loans get better rates

    // Adjust rate based on term
    if (termMonths <= 24) annualRate -= 0.005;
    if (termMonths >= 84) annualRate += 0.01;

    const frequencyMultiplier =
      repaymentFrequencies.find((f) => f.value === frequency)?.multiplier || 12;
    const paymentsPerYear = frequencyMultiplier;
    const totalPayments = (termMonths / 12) * paymentsPerYear;
    const periodRate = annualRate / paymentsPerYear;

    // Calculate payment using loan formula
    const payment =
      (principal * (periodRate * Math.pow(1 + periodRate, totalPayments))) /
      (Math.pow(1 + periodRate, totalPayments) - 1);
    const totalAmount = payment * totalPayments;
    const totalInterest = totalAmount - principal;

    return {
      payment: Math.round(payment * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      annualRate: (annualRate * 100).toFixed(2),
      paymentsPerYear,
    };
  };

  // Update quotes when details change
  useEffect(() => {
    const newQuotes = {};

    if (
      hasProduct('term-loan') &&
      applicationDetails.termLoan?.amountRequested &&
      applicationDetails.termLoan?.repaymentTerm
    ) {
      newQuotes.termLoan = calculateQuote(
        applicationDetails.termLoan.amountRequested,
        parseInt(applicationDetails.termLoan.repaymentTerm),
        applicationDetails.termLoan.repaymentFrequency || 'monthly'
      );
    }

    if (
      hasProduct('green-loan') &&
      applicationDetails.greenLoan?.amountRequested &&
      applicationDetails.greenLoan?.repaymentTerm
    ) {
      newQuotes.greenLoan = calculateQuote(
        applicationDetails.greenLoan.amountRequested,
        parseInt(applicationDetails.greenLoan.repaymentTerm),
        applicationDetails.greenLoan.repaymentFrequency || 'monthly',
        true // Green loan gets better rate
      );
    }

    setQuotes(newQuotes);
  }, [applicationDetails, hasProduct]);

  const updateApplicationDetails = (field, value, productType = null) => {
    if (productType) {
      setApplicationDetails((prev) => ({
        ...prev,
        [productType]: {
          ...prev[productType],
          [field]: value,
        },
      }));
    } else {
      setApplicationDetails((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear validation error when user makes a change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Term Loan validation
    if (hasProduct('term-loan')) {
      if (!applicationDetails.termLoan?.amountRequested) {
        newErrors.termLoanAmount = 'Term loan amount is required';
      }
      if (!applicationDetails.termLoan?.purposeOfCredit) {
        newErrors.termLoanPurpose = 'Term loan purpose is required';
      }
      if (!applicationDetails.termLoan?.repaymentTerm) {
        newErrors.termLoanTerm = 'Repayment term is required';
      }
      if (!applicationDetails.termLoan?.repaymentFrequency) {
        newErrors.termLoanFrequency = 'Repayment frequency is required';
      }
    }

    // Green Loan validation
    if (hasProduct('green-loan')) {
      if (!applicationDetails.greenLoan?.amountRequested) {
        newErrors.greenLoanAmount = 'Green loan amount is required';
      }
      if (!applicationDetails.greenLoan?.greenPurposeCategory) {
        newErrors.greenLoanCategory = 'Green purpose category is required';
      }
      if (!applicationDetails.greenLoan?.repaymentTerm) {
        newErrors.greenLoanTerm = 'Repayment term is required';
      }
      if (!applicationDetails.greenLoan?.repaymentFrequency) {
        newErrors.greenLoanFrequency = 'Repayment frequency is required';
      }
    }

    // Business Overdraft validation
    if (hasProduct('business-overdraft')) {
      if (!applicationDetails.overdraft?.limitRequested) {
        newErrors.overdraftLimit = 'Overdraft limit is required';
      }
      if (!applicationDetails.overdraft?.overdraftPurpose) {
        newErrors.overdraftPurpose = 'Overdraft purpose is required';
      }
    }

    // Business Credit Card validation
    if (hasProduct('business-credit-card')) {
      if (!applicationDetails.creditCard?.limitRequested) {
        newErrors.creditCardLimit = 'Credit card limit is required';
      }
      if (!applicationDetails.creditCard?.cardPurpose) {
        newErrors.creditCardPurpose = 'Card purpose is required';
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const QuoteDisplay = ({ quote, productName, frequency }) => {
    if (!quote) return null;

    const frequencyLabel =
      repaymentFrequencies.find((f) => f.value === frequency)?.label ||
      'Monthly';

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <CalculatorIcon className="h-5 w-5 text-green-600 mr-2" />
          <h4 className="text-sm font-medium text-green-800">
            Live Quote - {productName}
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-green-600">Interest Rate:</span>
            <div className="font-semibold text-green-800">
              {quote.annualRate}% APR
            </div>
          </div>
          <div>
            <span className="text-green-600">{frequencyLabel} Payment:</span>
            <div className="font-semibold text-green-800">
              {formatCurrency(quote.payment)}
            </div>
          </div>
          <div>
            <span className="text-green-600">Total Interest:</span>
            <div className="font-semibold text-green-800">
              {formatCurrency(quote.totalInterest)}
            </div>
          </div>
          <div>
            <span className="text-green-600">Total Amount:</span>
            <div className="font-semibold text-green-800">
              {formatCurrency(quote.totalAmount)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Application Details
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Configure your credit products with real-time quotes and payment
          calculations.
        </p>
      </div>

      {/* Term Loan Section */}
      {hasProduct('term-loan') && (
        <div className="card">
          <div className="flex items-center mb-6">
            <CurrencyEuroIcon className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Term Loan</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="termLoanAmount" className="label-text">
                  Loan Amount (€) *
                </label>
                <input
                  type="number"
                  id="termLoanAmount"
                  value={applicationDetails.termLoan?.amountRequested || ''}
                  onChange={(e) =>
                    updateApplicationDetails(
                      'amountRequested',
                      e.target.value,
                      'termLoan'
                    )
                  }
                  className="input-field"
                  placeholder="50000"
                  min="5000"
                  max="500000"
                />
                {errors.termLoanAmount && (
                  <p className="error-text">{errors.termLoanAmount}</p>
                )}
              </div>

              <div>
                <label htmlFor="termLoanPurpose" className="label-text">
                  Purpose of Credit *
                </label>
                <select
                  id="termLoanPurpose"
                  value={applicationDetails.termLoan?.purposeOfCredit || ''}
                  onChange={(e) =>
                    updateApplicationDetails(
                      'purposeOfCredit',
                      e.target.value,
                      'termLoan'
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select purpose</option>
                  {purposeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.termLoanPurpose && (
                  <p className="error-text">{errors.termLoanPurpose}</p>
                )}
              </div>

              <div>
                <label htmlFor="termLoanTerm" className="label-text">
                  Repayment Term *
                </label>
                <select
                  id="termLoanTerm"
                  value={applicationDetails.termLoan?.repaymentTerm || ''}
                  onChange={(e) =>
                    updateApplicationDetails(
                      'repaymentTerm',
                      e.target.value,
                      'termLoan'
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select term</option>
                  {repaymentTerms.map((term) => (
                    <option key={term.value} value={term.value}>
                      {term.label}
                    </option>
                  ))}
                </select>
                {errors.termLoanTerm && (
                  <p className="error-text">{errors.termLoanTerm}</p>
                )}
              </div>

              <div>
                <label htmlFor="termLoanFrequency" className="label-text">
                  Payment Frequency *
                </label>
                <select
                  id="termLoanFrequency"
                  value={applicationDetails.termLoan?.repaymentFrequency || ''}
                  onChange={(e) =>
                    updateApplicationDetails(
                      'repaymentFrequency',
                      e.target.value,
                      'termLoan'
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select frequency</option>
                  {repaymentFrequencies.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
                {errors.termLoanFrequency && (
                  <p className="error-text">{errors.termLoanFrequency}</p>
                )}
              </div>
            </div>

            {/* Term Loan Quote */}
            {quotes.termLoan && (
              <QuoteDisplay
                quote={quotes.termLoan}
                productName="Term Loan"
                frequency={applicationDetails.termLoan?.repaymentFrequency}
              />
            )}
          </div>
        </div>
      )}

      {/* Green Loan Section */}
      {hasProduct('green-loan') && (
        <div className="card">
          <div className="flex items-center mb-6">
            <SparklesIcon className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Green Loan</h2>
            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              Reduced Rate
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="greenLoanAmount" className="label-text">
                  Loan Amount (€) *
                </label>
                <input
                  type="number"
                  id="greenLoanAmount"
                  value={applicationDetails.greenLoan?.amountRequested || ''}
                  onChange={(e) =>
                    updateApplicationDetails(
                      'amountRequested',
                      e.target.value,
                      'greenLoan'
                    )
                  }
                  className="input-field"
                  placeholder="100000"
                  min="10000"
                  max="1000000"
                />
                {errors.greenLoanAmount && (
                  <p className="error-text">{errors.greenLoanAmount}</p>
                )}
              </div>

              <div>
                <label htmlFor="greenLoanCategory" className="label-text">
                  Green Purpose Category *
                </label>
                <select
                  id="greenLoanCategory"
                  value={
                    applicationDetails.greenLoan?.greenPurposeCategory || ''
                  }
                  onChange={(e) =>
                    updateApplicationDetails(
                      'greenPurposeCategory',
                      e.target.value,
                      'greenLoan'
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select green category</option>
                  {greenPurposeCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.greenLoanCategory && (
                  <p className="error-text">{errors.greenLoanCategory}</p>
                )}
              </div>

              <div>
                <label htmlFor="greenLoanTerm" className="label-text">
                  Repayment Term *
                </label>
                <select
                  id="greenLoanTerm"
                  value={applicationDetails.greenLoan?.repaymentTerm || ''}
                  onChange={(e) =>
                    updateApplicationDetails(
                      'repaymentTerm',
                      e.target.value,
                      'greenLoan'
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select term</option>
                  {repaymentTerms.map((term) => (
                    <option key={term.value} value={term.value}>
                      {term.label}
                    </option>
                  ))}
                </select>
                {errors.greenLoanTerm && (
                  <p className="error-text">{errors.greenLoanTerm}</p>
                )}
              </div>

              <div>
                <label htmlFor="greenLoanFrequency" className="label-text">
                  Payment Frequency *
                </label>
                <select
                  id="greenLoanFrequency"
                  value={applicationDetails.greenLoan?.repaymentFrequency || ''}
                  onChange={(e) =>
                    updateApplicationDetails(
                      'repaymentFrequency',
                      e.target.value,
                      'greenLoan'
                    )
                  }
                  className="input-field"
                >
                  <option value="">Select frequency</option>
                  {repaymentFrequencies.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
                {errors.greenLoanFrequency && (
                  <p className="error-text">{errors.greenLoanFrequency}</p>
                )}
              </div>
            </div>

            {/* Green Loan Quote */}
            {quotes.greenLoan && (
              <QuoteDisplay
                quote={quotes.greenLoan}
                productName="Green Loan"
                frequency={applicationDetails.greenLoan?.repaymentFrequency}
              />
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-700">
                  <p className="font-medium mb-1">Green Loan Benefits:</p>
                  <ul className="space-y-1">
                    <li>• Reduced interest rate for sustainable projects</li>
                    <li>• Priority processing for environmental initiatives</li>
                    <li>• Access to government green incentives</li>
                    <li>• Carbon footprint reporting included</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Overdraft Section */}
      {hasProduct('business-overdraft') && (
        <div className="card">
          <div className="flex items-center mb-6">
            <BuildingOfficeIcon className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Business Overdraft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="overdraftLimit" className="label-text">
                Overdraft Limit (€) *
              </label>
              <input
                type="number"
                id="overdraftLimit"
                value={applicationDetails.overdraft?.limitRequested || ''}
                onChange={(e) =>
                  updateApplicationDetails(
                    'limitRequested',
                    e.target.value,
                    'overdraft'
                  )
                }
                className="input-field"
                placeholder="25000"
                min="1000"
                max="100000"
              />
              {errors.overdraftLimit && (
                <p className="error-text">{errors.overdraftLimit}</p>
              )}
            </div>

            <div>
              <label htmlFor="overdraftPurpose" className="label-text">
                Purpose *
              </label>
              <select
                id="overdraftPurpose"
                value={applicationDetails.overdraft?.overdraftPurpose || ''}
                onChange={(e) =>
                  updateApplicationDetails(
                    'overdraftPurpose',
                    e.target.value,
                    'overdraft'
                  )
                }
                className="input-field"
              >
                <option value="">Select purpose</option>
                <option value="cash-flow">Cash Flow Management</option>
                <option value="seasonal">Seasonal Business Needs</option>
                <option value="working-capital">Working Capital</option>
                <option value="emergency">Emergency Fund</option>
                <option value="opportunity">Business Opportunities</option>
              </select>
              {errors.overdraftPurpose && (
                <p className="error-text">{errors.overdraftPurpose}</p>
              )}
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-purple-700">
              <strong>Overdraft Features:</strong> Pay interest only on the
              amount used • Immediate access to funds • Variable interest rate
              starting at 6.5% APR
            </p>
          </div>
        </div>
      )}

      {/* Business Credit Card Section */}
      {hasProduct('business-credit-card') && (
        <div className="card">
          <div className="flex items-center mb-6">
            <CreditCardIcon className="h-6 w-6 text-orange-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Business Credit Card
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="creditCardLimit" className="label-text">
                Credit Limit (€) *
              </label>
              <input
                type="number"
                id="creditCardLimit"
                value={applicationDetails.creditCard?.limitRequested || ''}
                onChange={(e) =>
                  updateApplicationDetails(
                    'limitRequested',
                    e.target.value,
                    'creditCard'
                  )
                }
                className="input-field"
                placeholder="10000"
                min="500"
                max="50000"
              />
              {errors.creditCardLimit && (
                <p className="error-text">{errors.creditCardLimit}</p>
              )}
            </div>

            <div>
              <label htmlFor="creditCardPurpose" className="label-text">
                Primary Use *
              </label>
              <select
                id="creditCardPurpose"
                value={applicationDetails.creditCard?.cardPurpose || ''}
                onChange={(e) =>
                  updateApplicationDetails(
                    'cardPurpose',
                    e.target.value,
                    'creditCard'
                  )
                }
                className="input-field"
              >
                <option value="">Select primary use</option>
                <option value="expenses">Business Expenses</option>
                <option value="travel">Travel & Entertainment</option>
                <option value="online">Online Purchases</option>
                <option value="fuel">Fuel & Fleet</option>
                <option value="general">General Business Use</option>
              </select>
              {errors.creditCardPurpose && (
                <p className="error-text">{errors.creditCardPurpose}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      {Object.keys(quotes).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Application Summary
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            {quotes.termLoan && (
              <div>
                Term Loan:{' '}
                {formatCurrency(applicationDetails.termLoan?.amountRequested)}{' '}
                at {quotes.termLoan.annualRate}% APR
              </div>
            )}
            {quotes.greenLoan && (
              <div>
                Green Loan:{' '}
                {formatCurrency(applicationDetails.greenLoan?.amountRequested)}{' '}
                at {quotes.greenLoan.annualRate}% APR
              </div>
            )}
            {applicationDetails.overdraft?.limitRequested && (
              <div>
                Overdraft:{' '}
                {formatCurrency(applicationDetails.overdraft.limitRequested)}{' '}
                limit
              </div>
            )}
            {applicationDetails.creditCard?.limitRequested && (
              <div>
                Credit Card:{' '}
                {formatCurrency(applicationDetails.creditCard.limitRequested)}{' '}
                limit
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={handleBack} className="btn-secondary px-6 py-3">
          Back
        </button>
        <button onClick={handleNext} className="btn-primary px-8 py-3">
          Continue to Documents
        </button>
      </div>
    </div>
  );
}

export default ApplicationDetailsEnhanced;
