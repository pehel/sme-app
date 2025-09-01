import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  BuildingOfficeIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const EntitySelect = () => {
  const navigate = useNavigate();
  const { entities, selectedEntity, selectEntity } = useAppStore();

  const handleEntitySelect = (entityId) => {
    selectEntity(entityId);
    navigate('/demographics');
  };

  const handleInviteDirector = (entityId) => {
    // In a real app, this would trigger an invitation process
    alert(`Invitation sent to directors for entity ${entityId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Select Your Business Entity
        </h1>
        <p className="text-lg text-gray-600">
          Choose the business entity you want to create an application for.
        </p>
      </div>

      {/* Entity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {entities.map((entity) => (
          <div
            key={entity.id}
            className={`bg-white rounded-lg shadow-lg border-2 transition-all duration-200 ${
              selectedEntity?.id === entity.id
                ? 'border-blue-500 shadow-xl'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <div className="p-6">
              {/* Entity Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-3">
                    <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{entity.name}</h3>
                    <p className="text-sm text-gray-600">CRO: {entity.croNumber}</p>
                  </div>
                </div>
                
                {/* Status Indicator */}
                {entity.hasDirector ? (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Ready</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <span>No Director</span>
                  </div>
                )}
              </div>

              {/* Entity Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Segment:</span>
                  <span className="font-medium text-gray-900">{entity.segment}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT Number:</span>
                  <span className="font-medium text-gray-900">{entity.vatNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Established:</span>
                  <span className="font-medium text-gray-900">{entity.established}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium text-gray-900 mt-1">{entity.address}</p>
                </div>
              </div>

              {/* Directors */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Directors ({entity.directors.length})
                </h4>
                <div className="space-y-2">
                  {entity.directors.map((director, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div>
                        <div className="font-medium text-gray-900">{director.name}</div>
                        <div className="text-sm text-gray-600">{director.role}</div>
                      </div>
                      <div className="text-sm text-gray-500">{director.email}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {entity.hasDirector ? (
                <button
                  onClick={() => handleEntitySelect(entity.id)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Select This Entity</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-yellow-800">Director Required</h5>
                        <p className="text-sm text-yellow-700 mt-1">
                          This entity needs at least one director to proceed with credit applications.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInviteDirector(entity.id)}
                    className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Invite Director
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Entity */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <div className="p-8 text-center">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BuildingOfficeIcon className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Entity</h3>
          <p className="text-gray-600 mb-4">
            Register a new business entity to start applications.
          </p>
          <button className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors">
            Add Entity
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
        <p className="text-blue-800 text-sm mb-4">
          If you can't find your business entity or need to add new directors, our support team can help.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Contact Support
          </button>
          <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-sm">
            View Help Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntitySelect;
