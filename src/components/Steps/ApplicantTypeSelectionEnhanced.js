import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useApplication,
  applicationActions,
} from '../../context/ApplicationContext';
import aiService from '../../services/aiService';
import {
  UserIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  CheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const applicantTypes = [
  {
    id: 'sole-trader',
    name: 'Sole Trader',
    description:
      'Individual trading in their own name or under a business name.',
    icon: UserIcon,
    requirements: [
      'Personal identification',
      'Business registration (if applicable)',
      'Tax reference number',
    ],
    suitable:
      'Perfect for individual professionals, consultants, and small businesses',
    aiKeywords: [
      'individual',
      'myself',
      'solo',
      'freelancer',
      'consultant',
      'personal',
      'one person',
    ],
  },
  {
    id: 'partnership',
    name: 'Partnership',
    description:
      'Two or more people trading together with shared profits and losses.',
    icon: UsersIcon,
    requirements: [
      'Partnership agreement',
      'All partners identification',
      'Partnership tax number',
    ],
    suitable:
      'Ideal for professional services, joint ventures, and family businesses',
    aiKeywords: [
      'partnership',
      'partners',
      'two people',
      'multiple owners',
      'family business',
      'joint venture',
    ],
  },
  {
    id: 'limited-company',
    name: 'Limited Company',
    description:
      'Incorporated company with limited liability for shareholders.',
    icon: BuildingOfficeIcon,
    requirements: [
      'Certificate of incorporation',
      'CRO number',
      'Directors identification',
    ],
    suitable:
      'Best for established businesses seeking growth capital and limited liability',
    aiKeywords: [
      'limited',
      'company',
      'incorporated',
      'ltd',
      'limited liability',
      'cro',
      'directors',
      'shareholders',
    ],
  },
  {
    id: 'other-organization',
    name: 'Other Organization',
    description: 'Clubs, societies, charities, or other legal entities.',
    icon: BuildingLibraryIcon,
    requirements: [
      'Constitution/articles',
      'Registration certificates',
      'Authorized representatives ID',
    ],
    suitable:
      'For non-profits, clubs, societies, and specialized business structures',
    aiKeywords: [
      'charity',
      'non-profit',
      'club',
      'society',
      'organization',
      'community',
      'association',
    ],
  },
];

function ApplicantTypeSelectionEnhanced() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const [selectedType, setSelectedType] = useState(state.applicantType || '');
  const [errors, setErrors] = useState({});
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      message:
        "Hi! I can help you quickly identify your business structure. Just tell me about your business - for example: 'I run a company with shareholders' or 'It's just me working as a consultant'.",
      timestamp: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    // Clear validation error when user makes a selection
    if (errors.applicantType) {
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
      // AI logic to determine applicant type
      const query = userMessage.message.toLowerCase();
      let suggestedType = null;
      let aiResponse =
        'I need a bit more information to help identify your business structure.';

      // Check for keywords to determine type
      for (const type of applicantTypes) {
        if (type.aiKeywords.some((keyword) => query.includes(keyword))) {
          suggestedType = type.id;
          aiResponse = `Based on your description, it sounds like you're a **${type.name}**. ${type.suitable}`;
          break;
        }
      }

      // Specific business structure questions
      if (
        query.includes('how many') ||
        query.includes('owners') ||
        query.includes('people')
      ) {
        aiResponse =
          "Great question! If it's just you working alone, you're likely a Sole Trader. If you have business partners sharing profits, that's a Partnership. If you have an incorporated company with shareholders and directors, that's a Limited Company.";
      } else if (
        query.includes('difference') ||
        query.includes('which') ||
        query.includes('should')
      ) {
        aiResponse =
          'The main differences: **Sole Trader** = just you, simplest setup. **Partnership** = 2+ people sharing business. **Limited Company** = incorporated business with shareholders and directors. **Other** = charities, clubs, etc.';
      }

      setTimeout(() => {
        const aiMessage = {
          type: 'ai',
          message: aiResponse,
          timestamp: new Date(),
          suggestedType,
        };
        setChatMessages((prev) => [...prev, aiMessage]);
        setIsAiThinking(false);

        // Auto-select suggested type
        if (suggestedType) {
          setSelectedType(suggestedType);
        }
      }, 1000);
    } catch (error) {
      setIsAiThinking(false);
      const errorMessage = {
        type: 'ai',
        message:
          "I apologize, but I'm having trouble processing your request right now. Please review the options below or try again.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleNext = () => {
    if (!selectedType) {
      setErrors({
        applicantType: 'Please select your applicant type to continue.',
      });
      return;
    }

    dispatch(applicationActions.setApplicantType(selectedType));
    navigate('/customer-details');
  };

  const handleBack = () => {
    navigate('/');
  };

  const isTypeSelected = (typeId) => selectedType === typeId;

  // Quick select buttons for AI
  const quickSelects = [
    { text: "It's just me", type: 'sole-trader' },
    { text: 'I have business partners', type: 'partnership' },
    { text: "We're an incorporated company", type: 'limited-company' },
    { text: "We're a charity/club", type: 'other-organization' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Select Your Applicant Type
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Not sure which type? Use our Banking Assistant for quick guidance, or
          browse the detailed options below.
        </p>
      </div>

      {/* AI Quick Selection */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Click the option that best describes your business:
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {quickSelects.map((quick, index) => (
            <button
              key={index}
              onClick={() => handleTypeSelect(quick.type)}
              className={`p-3 text-sm rounded-lg border-2 transition-all ${
                selectedType === quick.type
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {quick.text}
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className={`inline-flex items-center px-4 py-2 text-sm rounded-lg border-2 transition-all ${
              showChatbot
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
            }`}
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
            {showChatbot
              ? 'Hide Banking Assistant'
              : 'Need Help? Ask Assistant'}
          </button>
        </div>
      </div>

      {/* AI Chatbot Interface */}
      {showChatbot && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <div className="h-64 overflow-y-auto border border-gray-100 rounded-lg p-4 mb-4 bg-gray-50">
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
                  <p
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: msg.message.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong>$1</strong>'
                      ),
                    }}
                  ></p>
                  {msg.suggestedType && (
                    <div className="mt-2 text-xs">
                      <span className="font-medium">
                        Suggested:{' '}
                        {
                          applicantTypes.find((t) => t.id === msg.suggestedType)
                            ?.name
                        }
                      </span>
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
              placeholder="e.g., 'I have 2 business partners' or 'What's the difference?'"
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

      {errors.applicantType && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{errors.applicantType}</p>
        </div>
      )}

      {/* Detailed Applicant Type Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {applicantTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = isTypeSelected(type.id);

          return (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={`card card-selectable text-left w-full ${
                isSelected ? 'card-selected' : ''
              }`}
              aria-pressed={isSelected}
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
                    {type.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{type.description}</p>

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Best for:
                    </h4>
                    <p className="text-sm text-gray-600">{type.suitable}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Required documents:
                    </h4>
                    <ul className="space-y-0.5">
                      {type.requirements.map((req, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Type Summary */}
      {selectedType && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <CheckIcon className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-lg font-medium text-green-800">
                {applicantTypes.find((t) => t.id === selectedType)?.name}{' '}
                Selected
              </h3>
              <p className="text-sm text-green-700">
                {applicantTypes.find((t) => t.id === selectedType)?.suitable}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={handleBack} className="btn-secondary px-6 py-3">
          Back to Products
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedType}
          className="btn-primary px-8 py-3 flex items-center"
        >
          Continue to Details
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-amber-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-amber-800 mb-2">
          Why we need this information
        </h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>
            • Different business structures have different regulatory
            requirements
          </li>
          <li>
            • This helps us prepare the correct documentation and verification
            process
          </li>
          <li>
            • Ensures compliance with Irish banking and business regulations
          </li>
          <li>
            • Allows us to provide the most relevant credit products for your
            structure
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ApplicantTypeSelectionEnhanced;
