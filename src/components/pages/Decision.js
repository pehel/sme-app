import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const Decision = () => {
  const navigate = useNavigate();
  const { currentApplication, simulatedOutcome, processDecision, setApplicationStatus } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [decision, setDecision] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Generate decision based on simulated outcome
    const generateDecision = () => {
      const baseDecision = {
        timestamp: new Date().toISOString(),
        applicationId: currentApplication?.id || 'APP-' + Date.now(),
        processingTime: '2.3 seconds',
        confidenceScore: Math.floor(Math.random() * 20) + 80
      };

      switch (simulatedOutcome) {
        case 'AUTO_APPROVE':
          return {
            ...baseDecision,
            outcome: 'APPROVED',
            type: 'AUTOMATIC',
            message: 'Congratulations! Your application has been automatically approved.',
            reasons: [
              'Excellent credit score',
              'Strong business performance',
              'Low risk profile',
              'Meets all lending criteria'
            ],
            conditions: [],
            nextSteps: [
              'Review and sign loan agreements',
              'Complete final verification',
              'Funds will be transferred within 1-2 business days'
            ],
            approvedAmount: currentApplication?.totalAmount || 100000,
            approvedRate: 5.2,
            approvedTerm: 36
          };

        case 'CONDITIONAL_APPROVE':
          return {
            ...baseDecision,
            outcome: 'CONDITIONAL_APPROVAL',
            type: 'CONDITIONAL',
            message: 'Your application has been approved subject to conditions.',
            reasons: [
              'Good credit profile',
              'Adequate business performance',
              'Acceptable risk level'
            ],
            conditions: [
              'Provide additional financial statements',
              'Personal guarantee required',
              'Insurance policy assignment'
            ],
            nextSteps: [
              'Complete the required conditions',
              'Submit additional documentation',
              'Final approval will be processed within 2-3 days'
            ],
            approvedAmount: Math.floor((currentApplication?.totalAmount || 100000) * 0.8),
            approvedRate: 6.5,
            approvedTerm: 30
          };

        case 'MANUAL_REVIEW':
          return {
            ...baseDecision,
            outcome: 'MANUAL_REVIEW',
            type: 'MANUAL',
            message: 'Your application requires manual review by our underwriting team.',
            reasons: [
              'Complex business structure',
              'Recent changes in financial performance',
              'Industry-specific considerations'
            ],
            conditions: [],
            nextSteps: [
              'Underwriting team will review within 2-3 business days',
              'You may be contacted for additional information',
              'Decision will be communicated via email and portal'
            ],
            estimatedDecisionTime: '2-3 business days'
          };

        case 'DECLINE':
        default:
          return {
            ...baseDecision,
            outcome: 'DECLINED',
            type: 'AUTOMATIC',
            message: 'Unfortunately, we cannot approve your application at this time.',
            reasons: [
              'Current financial position does not meet criteria',
              'Insufficient trading history',
              'High risk industry classification'
            ],
            conditions: [],
            nextSteps: [
              'Review our feedback and recommendations',
              'Consider reapplying in 6 months',
              'Speak with our advisors for improvement suggestions'
            ],
            appealProcess: 'You can request a manual review within 30 days'
          };
      }
    };

    // Simulate decision processing
    setIsProcessing(true);
    
    const timer = setTimeout(() => {
      const mockDecision = generateDecision();
      setDecision(mockDecision);
      setIsProcessing(false);
      processDecision();
    }, 3000);

    return () => clearTimeout(timer);
  }, [processDecision, simulatedOutcome, currentApplication]);

  const getDecisionIcon = (outcome) => {
    switch (outcome) {
      case 'APPROVED':
        return <CheckCircleIcon className="h-16 w-16 text-green-600" />;
      case 'CONDITIONAL_APPROVAL':
        return <ExclamationTriangleIcon className="h-16 w-16 text-yellow-600" />;
      case 'MANUAL_REVIEW':
        return <ClockIcon className="h-16 w-16 text-blue-600" />;
      case 'DECLINED':
        return <XCircleIcon className="h-16 w-16 text-red-600" />;
      default:
        return <ClockIcon className="h-16 w-16 text-gray-600" />;
    }
  };

  const getDecisionColor = (outcome) => {
    switch (outcome) {
      case 'APPROVED':
        return 'bg-green-50 border-green-200';
      case 'CONDITIONAL_APPROVAL':
        return 'bg-yellow-50 border-yellow-200';
      case 'MANUAL_REVIEW':
        return 'bg-blue-50 border-blue-200';
      case 'DECLINED':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleContinue = () => {
    if (decision?.outcome === 'APPROVED' || decision?.outcome === 'CONDITIONAL_APPROVAL') {
      setApplicationStatus('approved');
      navigate('/documents');
    } else if (decision?.outcome === 'MANUAL_REVIEW') {
      setApplicationStatus('under_review');
      navigate('/status-tracker');
    } else {
      setApplicationStatus('declined');
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Decision Engine
        </h1>
        <p className="text-lg text-gray-600">
          AI-powered instant decision on your loan application
        </p>
      </div>

      {/* Processing or Decision */}
      {isProcessing ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <SparklesIcon className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Application</h2>
              <p className="text-gray-600">Our AI is analyzing your application and making a decision...</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Analyzing business profile</span>
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Checking credit history</span>
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Assessing financial capacity</span>
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Applying decision rules</span>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            </div>

            <div className="mt-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Processing... 75% complete</p>
            </div>
          </div>
        </div>
      ) : decision ? (
        <div className="space-y-6">
          {/* Decision Result */}
          <div className={`border-2 rounded-lg p-8 ${getDecisionColor(decision.outcome)}`}>
            <div className="text-center mb-6">
              {getDecisionIcon(decision.outcome)}
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                {decision.outcome.replace('_', ' ')}
              </h2>
              <p className="text-lg text-gray-700">{decision.message}</p>
            </div>

            {/* Approved Amount (if applicable) */}
            {(decision.outcome === 'APPROVED' || decision.outcome === 'CONDITIONAL_APPROVAL') && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Approved Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      €{decision.approvedAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Approved Amount</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {decision.approvedRate}%
                    </div>
                    <div className="text-sm text-gray-600">Interest Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {decision.approvedTerm} months
                    </div>
                    <div className="text-sm text-gray-600">Term</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Decision Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Decision Details</h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            {showDetails && (
              <div className="space-y-6">
                {/* Decision Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Decision Type:</span>
                    <span className="ml-2 font-medium">{decision.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="ml-2 font-medium">{decision.processingTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence Score:</span>
                    <span className="ml-2 font-medium">{decision.confidenceScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Application ID:</span>
                    <span className="ml-2 font-mono text-xs">{decision.applicationId}</span>
                  </div>
                </div>

                {/* Reasons */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Decision Factors</h4>
                  <ul className="space-y-1">
                    {decision.reasons.map((reason, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conditions (if any) */}
                {decision.conditions && decision.conditions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Required Conditions</h4>
                    <ul className="space-y-1">
                      {decision.conditions.map((condition, index) => (
                        <li key={index} className="flex items-center text-sm text-yellow-700">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Next Steps</h3>
            <div className="space-y-3">
              {decision.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>

            {decision.appealProcess && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Appeal Process</p>
                    <p className="text-sm text-gray-600">{decision.appealProcess}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Navigation */}
      {decision && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/application-summary')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Application
          </button>
          
          <button
            onClick={handleContinue}
            className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {decision.outcome === 'APPROVED' || decision.outcome === 'CONDITIONAL_APPROVAL' ? 'Continue to Documents' :
             decision.outcome === 'MANUAL_REVIEW' ? 'Track Application' : 'Return to Home'}
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Decision;
