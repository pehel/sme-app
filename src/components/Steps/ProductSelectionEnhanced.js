import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useApplication,
  applicationActions,
} from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import aiService from '../../services/aiService';
import {
  CurrencyEuroIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  RocketLaunchIcon,
  CheckIcon,
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
  const { user } = useAuth();
  const [selectedProducts, setSelectedProducts] = useState(
    state.selectedProducts || []
  );
  const [errors, setErrors] = useState({});
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      message:
        "Hello! I'm your AI banking assistant. I can help you find the perfect credit products for your business. What type of financing are you looking for?",
      timestamp: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

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

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      message: userInput.trim(),
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsAiThinking(true);

    try {
      // Get AI recommendation
      const response = await aiService.getContextualHelp('product-selection', {
        userQuery: userMessage.message,
        selectedProducts,
        availableProducts: products,
      });

      setTimeout(() => {
        const aiMessage = {
          type: 'ai',
          message: response.message,
          timestamp: new Date(),
          suggestions: response.suggestedProducts,
        };
        setChatMessages((prev) => [...prev, aiMessage]);
        setIsAiThinking(false);

        // Auto-select suggested products
        if (
          response.suggestedProducts &&
          response.suggestedProducts.length > 0
        ) {
          setSelectedProducts(response.suggestedProducts);
        }
      }, 1500);
    } catch (error) {
      setIsAiThinking(false);
      const errorMessage = {
        type: 'ai',
        message:
          "I apologize, but I'm having trouble processing your request right now. Please browse our products below or try again.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
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

    // Skip applicant type selection ONLY for existing customers
    if (user?.isExistingCustomer && user?.existingData) {
      console.log('🏃‍♂️ Existing customer, skipping applicant type selection');
      // Set default applicant type for existing customer
      dispatch(applicationActions.setApplicantType('limited-company'));
      navigate('/customer-details');
    } else {
      console.log(
        '🆕 New customer or no existing data, going to applicant type selection'
      );
      navigate('/applicant-type');
    }
  };

  const isProductSelected = (productId) => selectedProducts.includes(productId);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Select Your Business Credit Product
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Browse our products below or chat with our Banking Assistant to find
          the perfect credit solution for your business.
        </p>
      </div>

      {/* AI Chatbot Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className={`flex items-center px-6 py-3 rounded-lg border-2 transition-all ${
            showChatbot
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
          }`}
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
          {showChatbot
            ? 'Hide Banking Assistant'
            : 'Chat with Banking Assistant'}
        </button>
      </div>

      {/* AI Chatbot Interface */}
      {showChatbot && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <div className="h-80 overflow-y-auto border border-gray-100 rounded-lg p-4 mb-4 bg-gray-50">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2 text-xs">
                      <p className="font-medium">Recommended products:</p>
                      <ul className="list-disc list-inside">
                        {msg.suggestions.map((productId) => {
                          const product = products.find(
                            (p) => p.id === productId
                          );
                          return product ? (
                            <li key={productId}>{product.name}</li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isAiThinking && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me about loans, overdrafts, credit cards..."
              className="flex-1 input-field"
              disabled={isAiThinking}
            />
            <button
              type="submit"
              disabled={isAiThinking || !userInput.trim()}
              className="btn-primary px-4 py-2 flex items-center"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {errors.products && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{errors.products}</p>
        </div>
      )}

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
              } cursor-pointer`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-primary-100' : 'bg-gray-100'
                  }`}
                >
                  {isSelected ? (
                    <CheckIcon className="h-6 w-6 text-primary-600" />
                  ) : (
                    <Icon
                      className={`h-6 w-6 ${
                        isSelected ? 'text-primary-600' : 'text-gray-600'
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{product.description}</p>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Amount Range</span>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {product.minAmount} - {product.maxAmount}
                    </div>
                  </div>

                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2"></div>
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

      {/* Selected Products Summary */}
      {selectedProducts.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Selected Products ({selectedProducts.length})
          </h3>
          <div className="space-y-1">
            {selectedProducts.map((productId) => {
              const product = products.find((p) => p.id === productId);
              return product ? (
                <div
                  key={productId}
                  className="flex items-center text-sm text-green-700"
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  {product.name}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={selectedProducts.length === 0}
          className="btn-primary px-8 py-3 flex items-center"
        >
          <RocketLaunchIcon className="h-5 w-5 mr-2" />
          Continue to Application
        </button>
      </div>
    </div>
  );
}

export default ProductSelection;
