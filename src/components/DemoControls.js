import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import {
  Cog6ToothIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const DemoControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    simulatedOutcome, 
    setSimulatedOutcome, 
    applicationStatus,
    demoMode,
    toggleDemoMode
  } = useAppStore();

  const outcomes = [
    { 
      value: 'AUTO_APPROVE', 
      label: 'Auto Approve', 
      icon: CheckCircleIcon, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      value: 'AUTO_DECLINE', 
      label: 'Auto Decline', 
      icon: XCircleIcon, 
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    { 
      value: 'RTL', 
      label: 'Refer to Lender', 
      icon: ClockIcon, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  if (!demoMode) {
    return null;
  }

  return (
    <>
      {/* Demo Controls Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 bg-yellow-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          title="Demo Controls"
        >
          <Cog6ToothIcon className="h-6 w-6" />
        </button>
      )}

      {/* Demo Controls Panel */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-yellow-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cog6ToothIcon className="h-5 w-5" />
                <span className="font-semibold">Demo Controls</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="text-xs text-yellow-100 mt-1">
              Control demo behavior for presentations
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 space-y-4">
            {/* Demo Mode Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Demo Mode</span>
              <button
                onClick={toggleDemoMode}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                  demoMode ? 'bg-yellow-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    demoMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Decision Simulator */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Simulated Decision Outcome
              </label>
              <div className="space-y-2">
                {outcomes.map((outcome) => {
                  const IconComponent = outcome.icon;
                  return (
                    <button
                      key={outcome.value}
                      onClick={() => setSimulatedOutcome(outcome.value)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                        simulatedOutcome === outcome.value
                          ? `border-yellow-500 ${outcome.bgColor}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className={`h-5 w-5 ${outcome.color}`} />
                      <span className="font-medium text-gray-900">{outcome.label}</span>
                      {simulatedOutcome === outcome.value && (
                        <CheckCircleIcon className="h-4 w-4 text-yellow-600 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Application Status */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Current Application Status
              </label>
              <div className="bg-gray-100 rounded-lg p-3">
                <span className="text-sm font-mono text-gray-800">
                  {applicationStatus || 'No active application'}
                </span>
              </div>
            </div>

            {/* Demo Instructions */}
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Instructions</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Select outcome before submitting applications</li>
                <li>• Switch roles to test different permissions</li>
                <li>• Use Q-1234 as sample reference to test resume</li>
                <li>• RTL outcome triggers manual review process</li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    // Reset demo state
                    setSimulatedOutcome('AUTO_APPROVE');
                    alert('Demo state reset');
                  }}
                  className="text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors"
                >
                  Reset Demo
                </button>
                <button
                  onClick={() => {
                    // Generate sample quote
                    alert('Sample quote Q-1234 generated');
                  }}
                  className="text-xs bg-blue-100 text-blue-700 py-2 px-3 rounded hover:bg-blue-200 transition-colors"
                >
                  Sample Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoControls;
