import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useApplication,
  applicationActions,
} from '../../context/ApplicationContext';
import aiService from '../../services/aiService';
import {
  CurrencyEuroIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

const products = [
  {
    id: 'term-loan',
    name: 'Term Loan',
    description:
      'Fixed-term business loan for equipment, expansion, or working capital needs.',
    features: [
      'Competitive rates',
      'Flexible terms up to 10 years',
      'No early repayment fees',
    ],
    icon: CurrencyEuroIcon,
    minAmount: '€5,000',
    maxAmount: '€500,000',
  },
  {
    id: 'green-loan',
    name: 'Green Loan',
    description:
      'Special rates for environmentally sustainable business investments.',
    features: [
      'Reduced interest rates',
      'Support for renewable energy',
      'Sustainability reporting',
    ],
    icon: SparklesIcon,
    minAmount: '€10,000',
    maxAmount: '€1,000,000',
  },
  {
    id: 'business-overdraft',
    name: 'Business Overdraft',
    description: 'Flexible credit facility to manage cash flow fluctuations.',
    features: [
      'Pay interest only on amount used',
      'Immediate access to funds',
      'Flexible repayment',
    ],
    icon: BuildingOfficeIcon,
    minAmount: '€1,000',
    maxAmount: '€100,000',
  },
  {
    id: 'business-credit-card',
    name: 'Business Credit Card',
    description: 'Corporate credit card with expense management and rewards.',
    features: [
      'Cashback rewards',
      'Expense tracking',
      'Multiple employee cards',
    ],
    icon: CreditCardIcon,
    minAmount: '€500',
    maxAmount: '€50,000',
  },
];

function ProductSelection() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const [selectedProducts, setSelectedProducts] = useState(
    state.selectedProducts || []
  );
  const [errors, setErrors] = useState({});

  const handleProductToggle = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
    // Clear validation error when user makes a selection
    if (errors.products) {
      setErrors({});
    }
  };

  const handleNext = () => {
    if (selectedProducts.length === 0) {
      setErrors({
        products: 'Please select at least one product to continue.',
      });
      return;
    }

    dispatch(applicationActions.setSelectedProducts(selectedProducts));
    navigate('/applicant-type');
  };

  const isProductSelected = (productId) => selectedProducts.includes(productId);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Select Your Business Credit Product
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the credit products that best fit your business needs. You can
          select multiple products and we'll create a tailored application for
          each.
        </p>
      </div>

      {/* Product Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {products.map((product) => {
          const Icon = product.icon;
          const isSelected = isProductSelected(product.id);

          return (
            <div
              key={product.id}
              onClick={() => handleProductToggle(product.id)}
              className={`card card-selectable ${
                isSelected ? 'card-selected' : ''
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProductToggle(product.id);
                }
              }}
              aria-pressed={isSelected}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`flex-shrink-0 p-3 rounded-lg ${
                    isSelected ? 'bg-primary-100' : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      isSelected ? 'text-primary-600' : 'text-gray-600'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="h-5 w-5 rounded-full bg-primary-600 flex items-center justify-center">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {product.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Range: {product.minAmount} - {product.maxAmount}
                    </span>
                  </div>

                  <ul className="mt-3 space-y-1">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <svg
                          className="h-3 w-3 text-green-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {errors.products && (
        <div className="text-center">
          <p className="error-text">{errors.products}</p>
        </div>
      )}

      {/* Selected Products Summary */}
      {selectedProducts.length > 0 && (
        <div className="bg-primary-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-primary-800 mb-2">
            Selected Products ({selectedProducts.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((productId) => {
              const product = products.find((p) => p.id === productId);
              return (
                <span
                  key={productId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {product?.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={selectedProducts.length === 0}
          className="btn-primary px-8 py-3"
        >
          Continue to Application
        </button>
      </div>
    </div>
  );
}

export default ProductSelection;
