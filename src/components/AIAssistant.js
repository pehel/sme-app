import React, { useState, useEffect } from 'react';
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  LightBulbIcon,
  DocumentMagnifyingGlassIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import aiService from '../services/aiService';

function AIAssistant({ currentStep, isVisible = true, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get contextual help when step changes
    const loadHelp = async () => {
      if (currentStep && messages.length === 0) {
        setIsLoading(true);
        try {
          const help = await aiService.getContextualHelp(currentStep);

          setMessages([
            {
              id: 1,
              type: 'ai',
              content: help.message,
              suggestions: help.suggestions,
              timestamp: new Date(),
            },
          ]);
        } catch (error) {
          console.error('Failed to load contextual help:', error);
        }
        setIsLoading(false);
      }
    };

    loadHelp();
  }, [currentStep, messages.length]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(userInput),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (query) => {
    const responses = {
      help: "I'm here to help you through your credit application. I can analyze documents, suggest form data, and answer questions about the process.",
      documents:
        "I can automatically extract information from your bank statements, identity documents, and business certificates. Just upload them and I'll fill in the details for you.",
      amount:
        'Based on your cash flow analysis, I recommend a loan amount between €50,000 - €75,000. This ensures comfortable repayment while meeting your business needs.',
      time: "With AI automation, your application can be processed instantly. I'm analyzing your data in real-time to speed up the decision process.",
      requirements:
        "For your business type, you'll need: bank statements (6 months), identity documents for all directors, Certificate of Incorporation, and recent financial statements.",
      default:
        'I can help you with document analysis, form filling, risk assessment, and application guidance. What specific area would you like assistance with?',
    };

    const lowercaseQuery = query.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowercaseQuery.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  const handleSuggestionClick = (suggestion) => {
    const suggestionMessage = {
      id: Date.now(),
      type: 'user',
      content: suggestion,
      timestamp: new Date(),
    };

    const aiResponse = {
      id: Date.now() + 1,
      type: 'ai',
      content: generateAIResponse(suggestion),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, suggestionMessage, aiResponse]);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Banking Assistant Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="relative">
            <SparklesIcon className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </button>
      )}

      {/* Banking Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-5 w-5" />
                <span className="font-semibold">AI Banking Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="text-xs text-blue-100 mt-1">
              Smart assistance for your credit application
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-blue-50 border-b border-gray-200 p-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-600">AI Active</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                Step:{' '}
                {currentStep
                  ? currentStep.replace('-', ' ')
                  : 'Getting Started'}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}

                  {/* AI Suggestions */}
                  {message.type === 'ai' && message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={`suggestion-${index}-${suggestion.slice(0, 10)}`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs bg-white text-gray-600 p-2 rounded border hover:bg-gray-50 transition-colors"
                        >
                          <LightBulbIcon className="h-3 w-3 inline mr-1" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isLoading}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() =>
                  handleSuggestionClick('What documents do I need?')
                }
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                <DocumentMagnifyingGlassIcon className="h-3 w-3 inline mr-1" />
                Documents needed
              </button>
              <button
                onClick={() =>
                  handleSuggestionClick('Help me with loan amount')
                }
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                <LightBulbIcon className="h-3 w-3 inline mr-1" />
                Loan guidance
              </button>
              <button
                onClick={() =>
                  handleSuggestionClick('How long does this take?')
                }
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="h-3 w-3 inline mr-1" />
                Processing time
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AIAssistant;
