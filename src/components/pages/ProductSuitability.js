import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CurrencyEuroIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const ProductSuitability = () => {
  const navigate = useNavigate();
  const { selectedEntity, setSelectedProducts } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // All available products - memoized to prevent re-renders
  const allProducts = useMemo(() => [
    {
      id: 'working_capital',
      name: 'Working Capital Loan',
      category: 'Loans',
      maxAmount: 250000,
      term: '12-36 months',
      rate: 'From 5.5%',
      description: 'Flexible funding for day-to-day operations',
      features: ['Flexible repayment', 'Quick approval', 'No early repayment fees'],
      eligibility: {
        minTurnover: 100000,
        minYearsTrading: 2,
        maxAge: 65,
        creditScore: 'Good'
      },
      suitable: false,
      reason: ''
    },
    {
      id: 'equipment_finance',
      name: 'Equipment Finance',
      category: 'Asset Finance',
      maxAmount: 500000,
      term: '24-84 months',
      rate: 'From 4.9%',
      description: 'Finance for machinery, vehicles, and equipment',
      features: ['Asset-backed security', 'Tax advantages', 'Flexible terms'],
      eligibility: {
        minTurnover: 50000,
        minYearsTrading: 1,
        maxAge: 70,
        creditScore: 'Fair'
      },
      suitable: false,
      reason: ''
    },
    {
      id: 'term_loan',
      name: 'Term Loan',
      category: 'Loans',
      maxAmount: 1000000,
      term: '12-120 months',
      rate: 'From 6.2%',
      description: 'Long-term funding for growth and expansion',
      features: ['Fixed monthly payments', 'Competitive rates', 'No hidden fees'],
      eligibility: {
        minTurnover: 200000,
        minYearsTrading: 3,
        maxAge: 60,
        creditScore: 'Excellent'
      },
      suitable: false,
      reason: ''
    },
    {
      id: 'green_loan',
      name: 'Green Business Loan',
      category: 'Sustainable Finance',
      maxAmount: 300000,
      term: '24-60 months',
      rate: 'From 4.5%',
      description: 'Preferential rates for environmentally friendly projects',
      features: ['Reduced rates', 'Government support', 'Impact reporting'],
      eligibility: {
        minTurnover: 75000,
        minYearsTrading: 1,
        maxAge: 65,
        greenProject: true
      },
      suitable: false,
      reason: ''
    },
    {
      id: 'business_credit_card',
      name: 'Business Credit Card',
      category: 'Credit Facilities',
      maxAmount: 50000,
      term: 'Revolving',
      rate: 'From 12.9%',
      description: 'Flexible credit for business expenses',
      features: ['Cashback rewards', 'Online management', 'Interest-free period'],
      eligibility: {
        minTurnover: 25000,
        minYearsTrading: 1,
        maxAge: 70,
        creditScore: 'Fair'
      },
      suitable: false,
      reason: ''
    },
    {
      id: 'invoice_finance',
      name: 'Invoice Finance',
      category: 'Cash Flow',
      maxAmount: 2000000,
      term: 'Ongoing',
      rate: 'From 2.5%',
      description: 'Unlock cash tied up in unpaid invoices',
      features: ['Immediate cash flow', 'Credit protection', 'Confidential service'],
      eligibility: {
        minTurnover: 100000,
        minYearsTrading: 1,
        b2bCustomers: true,
        creditScore: 'Good'
      },
      suitable: false,
      reason: ''
    }
  ], []);

  useEffect(() => {
    // Simulate AI-powered suitability analysis
    const analyzeProducts = () => {
      setLoading(true);
      
      setTimeout(() => {
        const analyzedProducts = allProducts.map(product => {
          let suitable = true;
          let reasons = [];
          
          // Business age check
          const businessAge = new Date().getFullYear() - parseInt(selectedEntity.established);
          if (product.eligibility.minYearsTrading && businessAge < product.eligibility.minYearsTrading) {
            suitable = false;
            reasons.push(`Business needs ${product.eligibility.minYearsTrading}+ years trading`);
          }
          
          // Turnover check (using mock data)
          const mockTurnover = 150000; // In real app, this would come from financial data
          if (product.eligibility.minTurnover && mockTurnover < product.eligibility.minTurnover) {
            suitable = false;
            reasons.push(`Minimum turnover €${product.eligibility.minTurnover.toLocaleString()} required`);
          }
          
          // Special requirements
          if (product.eligibility.greenProject && !selectedEntity.greenFocus) {
            suitable = false;
            reasons.push('Requires environmental/green business focus');
          }
          
          if (product.eligibility.b2bCustomers && selectedEntity.segment === 'SME_Retail') {
            // Retail might not have B2B invoices
            reasons.push('Best suited for B2B businesses');
          }
          
          return {
            ...product,
            suitable,
            reason: suitable ? 'Meets all eligibility criteria' : reasons.join(', '),
            score: suitable ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 40
          };
        });
        
        // Sort by suitability and score
        const sorted = analyzedProducts.sort((a, b) => {
          if (a.suitable && !b.suitable) return -1;
          if (!a.suitable && b.suitable) return 1;
          return b.score - a.score;
        });
        
        setRecommendations(sorted);
        setLoading(false);
      }, 2000);
    };

    if (selectedEntity) {
      analyzeProducts();
    }
  }, [selectedEntity, allProducts]);

  const handleProductToggle = (productId) => {
    setSelectedProductIds(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleContinue = () => {
    const selectedProducts = recommendations.filter(p => selectedProductIds.includes(p.id));
    setSelectedProducts(selectedProducts);
    navigate('/quote-builder');
  };

  if (!selectedEntity) {
    navigate('/demographics');
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Product Suitability Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Our AI has analyzed your business profile to recommend the most suitable products
        </p>
      </div>

      {/* Analysis Status */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">AI Analysis Complete</h2>
              <p className="text-gray-600">
                Analyzed {allProducts.length} products based on your business profile
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {recommendations.filter(p => p.suitable).length}
            </div>
            <div className="text-sm text-gray-600">Suitable Products</div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-lg font-medium text-gray-900">Analyzing Products...</div>
            <div className="text-gray-600">Checking eligibility and suitability</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-lg p-6 border-2 transition-all ${
                selectedProductIds.includes(product.id)
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              } ${
                !product.suitable ? 'opacity-75' : ''
              }`}
            >
              {/* Product Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                    {product.suitable ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{product.category}</div>
                  <div className="text-sm text-gray-700">{product.description}</div>
                </div>
                
                {product.suitable && (
                  <label className="flex items-center ml-4">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => handleProductToggle(product.id)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                )}
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <CurrencyEuroIcon className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-600">Max Amount</div>
                    <div className="font-medium">€{product.maxAmount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-600">Term</div>
                    <div className="font-medium">{product.term}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-600">Rate</div>
                    <div className="font-medium">{product.rate}</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-900 mb-2">Key Features</div>
                <div className="space-y-1">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suitability Status */}
              <div className={`rounded-lg p-3 ${
                product.suitable 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start space-x-2">
                  <InformationCircleIcon className={`h-4 w-4 mt-0.5 ${
                    product.suitable ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div>
                    <div className={`text-sm font-medium ${
                      product.suitable ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {product.suitable ? 'Suitable' : 'Not Suitable'}
                    </div>
                    <div className={`text-xs ${
                      product.suitable ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {product.reason}
                    </div>
                  </div>
                </div>
                
                {product.suitable && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-700">Suitability Score</span>
                      <span className="font-medium text-green-900">{product.score}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${product.score}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {!loading && selectedProductIds.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Selection Summary</h3>
          <p className="text-blue-700 mb-4">
            You've selected {selectedProductIds.length} product{selectedProductIds.length !== 1 ? 's' : ''} to include in your quote.
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedProductIds.map(id => {
              const product = recommendations.find(p => p.id === id);
              return (
                <span key={id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/demographics')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Demographics
        </button>
        
        <button
          onClick={handleContinue}
          disabled={selectedProductIds.length === 0}
          className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Build Quote ({selectedProductIds.length} selected)
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ProductSuitability;
