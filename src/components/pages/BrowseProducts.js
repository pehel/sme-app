import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication, applicationActions } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import NavigationHeader from '../Layout/NavigationHeader';
import {
  CurrencyEuroIcon,
  CreditCardIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  SparklesIcon,
  DocumentTextIcon,
  ClockIcon,
  BanknotesIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const BrowseProducts = () => {
  const navigate = useNavigate();
  const { dispatch } = useApplication();
  const { user } = useAuth();
  const [selectedProducts, setSelectedProducts] = useState([]);

  const productCategories = [
    {
      id: 'business-loans',
      name: 'Business Loans',
      icon: CurrencyEuroIcon,
      description: 'Finance your business growth with flexible loan solutions',
      color: 'blue',
      products: [
        {
          id: 'term-loan',
          name: 'Term Loan',
          description: 'Fixed-term financing for equipment, expansion, or working capital',
          features: ['Flexible repayment terms', 'Competitive rates', 'Up to €500k'],
          minAmount: 10000,
          maxAmount: 500000,
          term: '1-7 years',
          rate: 'From 4.5% APR'
        },
        {
          id: 'working-capital',
          name: 'Working Capital Loan',
          description: 'Short-term funding to manage cash flow and operational expenses',
          features: ['Quick approval', 'Flexible drawdown', 'Up to €250k'],
          minAmount: 5000,
          maxAmount: 250000,
          term: '6-24 months',
          rate: 'From 5.2% APR'
        },
        {
          id: 'equipment-finance',
          name: 'Equipment Finance',
          description: 'Specialized financing for machinery, vehicles, and equipment',
          features: ['Asset-based security', 'Tax benefits', 'Up to €1M'],
          minAmount: 15000,
          maxAmount: 1000000,
          term: '2-10 years',
          rate: 'From 4.8% APR'
        }
      ]
    },
    {
      id: 'business-accounts',
      name: 'Business Accounts',
      icon: CreditCardIcon,
      description: 'Comprehensive banking solutions for day-to-day operations',
      color: 'green',
      products: [
        {
          id: 'business-overdraft',
          name: 'Business Overdraft',
          description: 'Flexible credit facility linked to your current account',
          features: ['Instant access', 'Interest only on usage', 'Up to €100k'],
          minAmount: 1000,
          maxAmount: 100000,
          term: 'Ongoing',
          rate: 'From 7.5% APR'
        },
        {
          id: 'business-credit-card',
          name: 'Business Credit Card',
          description: 'Flexible spending power with cashback rewards and expense management',
          features: ['Up to 56 days interest-free', 'Cashback rewards', 'Expense tracking'],
          minAmount: 500,
          maxAmount: 50000,
          term: 'Ongoing',
          rate: 'From 12.9% APR'
        }
      ]
    },
    {
      id: 'specialized',
      name: 'Specialized Solutions',
      icon: ChartBarIcon,
      description: 'Tailored financial products for specific business needs',
      color: 'purple',
      products: [
        {
          id: 'green-loan',
          name: 'Green Business Loan',
          description: 'Environmentally focused financing with preferential rates',
          features: ['Reduced rates', 'Sustainability focus', 'EU Green taxonomy'],
          minAmount: 25000,
          maxAmount: 750000,
          term: '2-7 years',
          rate: 'From 3.9% APR'
        },
        {
          id: 'invoice-finance',
          name: 'Invoice Finance',
          description: 'Release cash tied up in outstanding invoices',
          features: ['Immediate cash flow', 'Up to 90% advance', 'Flexible terms'],
          minAmount: 5000,
          maxAmount: 500000,
          term: 'Ongoing',
          rate: 'From 1.5% per month'
        }
      ]
    }
  ];

  const handleProductToggle = (productId, categoryId) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === productId);
      if (isSelected) {
        return prev.filter(p => p.id !== productId);
      } else {
        const category = productCategories.find(c => c.id === categoryId);
        const product = category.products.find(p => p.id === productId);
        return [...prev, { ...product, categoryId }];
      }
    });
  };

  const handleStartApplication = () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product to continue');
      return;
    }

    // Save selected products to application context
    dispatch(applicationActions.setSelectedProducts(selectedProducts.map(p => p.id)));

    // Check if user is existing customer
    if (user?.isExistingCustomer && user?.existingData) {
      console.log('🏃‍♂️ Existing customer, skipping applicant type selection');
      // For existing customers, skip applicant type and go directly to customer details
      // Set default applicant type for existing customer (usually limited-company)
      dispatch(applicationActions.setApplicantType('limited-company'));
      navigate('/customer-details');
    } else {
      console.log('🆕 New customer, going to applicant type selection');
      // For new customers, go to applicant type selection
      navigate('/applicant-type');
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        text: 'text-blue-900',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        text: 'text-green-900',
        button: 'bg-green-600 hover:bg-green-700'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        text: 'text-purple-900',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    };
    return colors[color] || colors.blue;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBagIcon className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Browse Our Products</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the right financial solutions for your business. Select the products you're interested in and start your application.
          </p>
        </div>

        {/* Existing Customer Notice */}
        {user?.isExistingCustomer && user?.existingData && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-900">
                  Welcome back, {user.name}!
                </h3>
                <p className="text-green-700 mt-1">
                  We have your business details on file. Once you select products, we'll fast-track your application.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Categories */}
        <div className="space-y-12">
          {productCategories.map((category) => {
            const colorClasses = getColorClasses(category.color);
            
            return (
              <div key={category.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`${colorClasses.bg} ${colorClasses.border} border-b px-8 py-6`}>
                  <div className="flex items-center">
                    <category.icon className={`h-8 w-8 ${colorClasses.icon} mr-4`} />
                    <div>
                      <h2 className={`text-2xl font-bold ${colorClasses.text}`}>{category.name}</h2>
                      <p className="text-gray-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {category.products.map((product) => {
                      const isSelected = selectedProducts.some(p => p.id === product.id);
                      
                      return (
                        <div
                          key={product.id}
                          className={`relative bg-white border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                            isSelected
                              ? `${colorClasses.border} shadow-md`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleProductToggle(product.id, category.id)}
                        >
                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="absolute top-4 right-4">
                              <CheckCircleIcon className={`h-6 w-6 ${colorClasses.icon}`} />
                            </div>
                          )}

                          {/* Product Info */}
                          <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                          </div>

                          {/* Key Details */}
                          <div className="space-y-2 mb-4">
                            {product.minAmount && (
                              <div className="flex items-center text-sm">
                                <BanknotesIcon className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-gray-600">
                                  {formatCurrency(product.minAmount)}
                                  {product.maxAmount ? ` - ${formatCurrency(product.maxAmount)}` : '+'}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center text-sm">
                              <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-600">{product.term}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-600">{product.rate}</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="border-t border-gray-100 pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                            <ul className="space-y-1">
                              {product.features.map((feature, index) => (
                                <li key={index} className="text-xs text-gray-600 flex items-center">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Products Summary */}
        {selectedProducts.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Selected Products</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {selectedProducts.map((product) => (
                <div key={product.id} className="flex items-center bg-blue-50 rounded-lg p-4">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.rate}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center bg-blue-50 rounded-lg p-4">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  You've selected {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''}. 
                  Ready to start your application?
                </p>
              </div>
              
              <button
                onClick={handleStartApplication}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                {user?.isExistingCustomer ? 'Start Fast-Track Application' : 'Start Application'}
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
          <div className="text-center">
            <BuildingOfficeIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Choosing?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our business banking experts are here to help you find the right products for your needs. 
              Get personalized recommendations based on your business profile.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Speak with an Expert
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowseProducts;
