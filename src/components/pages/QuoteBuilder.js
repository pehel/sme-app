import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  ShoppingCartIcon,
  TrashIcon,
  CurrencyEuroIcon,
  CalendarIcon,
  CalculatorIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const QuoteBuilder = () => {
  const navigate = useNavigate();
  const { selectedProducts, addToQuote } = useAppStore();
  const [currentQuote, setCurrentQuote] = useState({
    items: [],
    totalAmount: 0,
    totalMonthlyPayment: 0,
    savings: 0
  });

  useEffect(() => {
    // Initialize quote items from selected products
    if (selectedProducts.length > 0) {
      const quoteItems = selectedProducts.map(product => ({
        id: product.id,
        productName: product.name,
        category: product.category,
        requestedAmount: Math.min(50000, product.maxAmount), // Default to 50k or max
        term: parseInt(product.term.split('-')[0]) || 12, // Default to minimum term
        rate: parseFloat(product.rate.replace('From ', '').replace('%', '')),
        monthlyPayment: 0,
        fees: {
          arrangement: 0,
          valuation: 0,
          legal: 0
        },
        customizations: {
          repaymentType: 'monthly',
          securityRequired: product.category === 'Asset Finance',
          earlyRepaymentAllowed: true
        }
      }));

      // Calculate payments for each item
      const calculatedItems = quoteItems.map(item => {
        const monthlyPayment = calculateMonthlyPayment(
          item.requestedAmount, 
          item.rate, 
          item.term
        );
        return { ...item, monthlyPayment };
      });

      setCurrentQuote({
        items: calculatedItems,
        totalAmount: calculatedItems.reduce((sum, item) => sum + item.requestedAmount, 0),
        totalMonthlyPayment: calculatedItems.reduce((sum, item) => sum + item.monthlyPayment, 0),
        savings: Math.floor(Math.random() * 5000) + 1000 // Mock savings calculation
      });
    }
  }, [selectedProducts]);

  const calculateMonthlyPayment = (amount, annualRate, termMonths) => {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return amount / termMonths;
    
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                   (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    return Math.round(payment * 100) / 100;
  };

  const updateQuoteItem = (itemId, field, value) => {
    setCurrentQuote(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalculate monthly payment if amount or term changed
          if (field === 'requestedAmount' || field === 'term') {
            updatedItem.monthlyPayment = calculateMonthlyPayment(
              updatedItem.requestedAmount,
              updatedItem.rate,
              updatedItem.term
            );
          }
          
          return updatedItem;
        }
        return item;
      });

      return {
        ...prev,
        items: updatedItems,
        totalAmount: updatedItems.reduce((sum, item) => sum + item.requestedAmount, 0),
        totalMonthlyPayment: updatedItems.reduce((sum, item) => sum + item.monthlyPayment, 0)
      };
    });
  };

  const removeQuoteItem = (itemId) => {
    setCurrentQuote(prev => {
      const updatedItems = prev.items.filter(item => item.id !== itemId);
      return {
        ...prev,
        items: updatedItems,
        totalAmount: updatedItems.reduce((sum, item) => sum + item.requestedAmount, 0),
        totalMonthlyPayment: updatedItems.reduce((sum, item) => sum + item.monthlyPayment, 0)
      };
    });
  };

  const handleSaveQuote = () => {
    const quote = {
      id: `quote_${Date.now()}`,
      created: new Date().toISOString(),
      status: 'draft',
      ...currentQuote
    };
    
    addToQuote(quote);
    navigate('/application-summary');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (!selectedProducts || selectedProducts.length === 0) {
    navigate('/suitability');
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Build Your Quote
        </h1>
        <p className="text-lg text-gray-600">
          Customize your selected products and calculate repayment options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quote Items */}
        <div className="lg:col-span-2 space-y-6">
          {currentQuote.items.map((item, index) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
              {/* Item Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{item.productName}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
                <button
                  onClick={() => removeQuoteItem(item.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Amount and Term */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Amount
                  </label>
                  <div className="relative">
                    <CurrencyEuroIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={item.requestedAmount}
                      onChange={(e) => updateQuoteItem(item.id, 'requestedAmount', parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1000"
                      max={selectedProducts.find(p => p.id === item.id)?.maxAmount}
                      step="1000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Max: {formatCurrency(selectedProducts.find(p => p.id === item.id)?.maxAmount)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Term (months)
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      value={item.term}
                      onChange={(e) => updateQuoteItem(item.id, 'term', parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                      <option value="48">48 months</option>
                      <option value="60">60 months</option>
                      <option value="84">84 months</option>
                      <option value="120">120 months</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Repayment Calculation */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <CalculatorIcon className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Repayment Calculation</h4>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Interest Rate</div>
                    <div className="font-medium text-gray-900">{item.rate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Monthly Payment</div>
                    <div className="font-medium text-blue-600">{formatCurrency(item.monthlyPayment)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Interest</div>
                    <div className="font-medium text-gray-900">
                      {formatCurrency((item.monthlyPayment * item.term) - item.requestedAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Repayable</div>
                    <div className="font-medium text-gray-900">
                      {formatCurrency(item.monthlyPayment * item.term)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customization Options */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Customization Options</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Repayment Type</label>
                    <select
                      value={item.customizations.repaymentType}
                      onChange={(e) => updateQuoteItem(item.id, 'customizations', {
                        ...item.customizations,
                        repaymentType: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="seasonal">Seasonal</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`early-repayment-${item.id}`}
                      checked={item.customizations.earlyRepaymentAllowed}
                      onChange={(e) => updateQuoteItem(item.id, 'customizations', {
                        ...item.customizations,
                        earlyRepaymentAllowed: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`early-repayment-${item.id}`} className="text-sm text-gray-700">
                      Allow early repayment
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quote Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <div className="flex items-center space-x-2 mb-6">
              <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Quote Summary</h3>
            </div>

            {/* Totals */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatCurrency(currentQuote.totalAmount)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Payment</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatCurrency(currentQuote.totalMonthlyPayment)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Savings</span>
                <span className="font-bold text-lg text-green-600">
                  {formatCurrency(currentQuote.savings)}
                </span>
              </div>
            </div>

            <hr className="my-6" />

            {/* Quote Details */}
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-gray-900">Quote Details</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Products</span>
                  <span className="text-gray-900">{currentQuote.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valid Until</span>
                  <span className="text-gray-900">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quote ID</span>
                  <span className="text-gray-900 font-mono">QTE-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-green-900 mb-2">Package Benefits</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Bundled discount applied
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Free setup fees
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Dedicated relationship manager
                </li>
              </ul>
            </div>

            {/* Important Note */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium text-blue-900 mb-1">Important</p>
                  <p>This is an indicative quote. Final terms subject to approval and credit assessment.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleSaveQuote}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Quote & Continue
              </button>
              
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Download PDF Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/suitability')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Product Selection
        </button>
        
        <div className="text-sm text-gray-500">
          Quote will be saved automatically as you make changes
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilder;
