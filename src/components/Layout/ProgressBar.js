import React from 'react';
import { useLocation } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/solid';

const steps = [
  { name: 'Product Selection', path: '/' },
  { name: 'Applicant Type', path: '/applicant-type' },
  { name: 'Customer Details', path: '/customer-details' },
  { name: 'Application Details', path: '/application-details' },
  { name: 'Document Upload', path: '/document-upload' },
  { name: 'Review & Decision', path: '/review-decision' },
  { name: 'Credit Agreement', path: '/credit-agreement' },
  { name: 'Completion', path: '/completion' }
];

function ProgressBar() {
  const location = useLocation();
  
  const getCurrentStepIndex = () => {
    const currentStep = steps.findIndex(step => step.path === location.pathname);
    return currentStep === -1 ? 0 : currentStep;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="py-4">
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <li key={step.name} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                {/* Connector line */}
                {index !== steps.length - 1 && (
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className={`h-0.5 w-full ${isCompleted ? 'bg-primary-600' : 'bg-gray-200'}`} />
                  </div>
                )}

                {/* Step indicator */}
                <div className="relative flex items-center justify-center">
                  {isCompleted ? (
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                  ) : isCurrent ? (
                    <div className="h-8 w-8 rounded-full border-2 border-primary-600 bg-white flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-primary-600" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-gray-300" />
                    </div>
                  )}
                </div>

                {/* Step name */}
                <div className="absolute -bottom-6 w-max">
                  <span className={`text-xs font-medium ${
                    isCompleted ? 'text-primary-600' : 
                    isCurrent ? 'text-primary-600' : 
                    'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

export default ProgressBar;
