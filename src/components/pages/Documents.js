import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Documents = () => {
  const navigate = useNavigate();
  const { currentApplication } = useAppStore();
  
  const [documents] = useState([
    {
      id: 'loan_agreement',
      name: 'Loan Agreement',
      type: 'PDF',
      size: '2.3 MB',
      status: 'ready',
      required: true,
      description: 'Main loan agreement with terms and conditions',
      lastModified: new Date().toISOString()
    },
    {
      id: 'personal_guarantee',
      name: 'Personal Guarantee',
      type: 'PDF',
      size: '1.1 MB',
      status: 'ready',
      required: true,
      description: 'Personal guarantee from company directors',
      lastModified: new Date().toISOString()
    },
    {
      id: 'security_deed',
      name: 'Security Deed',
      type: 'PDF',
      size: '1.8 MB',
      status: 'generating',
      required: true,
      description: 'Security documentation for collateral',
      lastModified: new Date().toISOString()
    },
    {
      id: 'direct_debit',
      name: 'Direct Debit Mandate',
      type: 'PDF',
      size: '0.8 MB',
      status: 'ready',
      required: true,
      description: 'Authorization for automatic payments',
      lastModified: new Date().toISOString()
    },
    {
      id: 'terms_conditions',
      name: 'Terms & Conditions',
      type: 'PDF',
      size: '3.2 MB',
      status: 'ready',
      required: false,
      description: 'General terms and conditions',
      lastModified: new Date().toISOString()
    },
    {
      id: 'privacy_policy',
      name: 'Privacy Policy',
      type: 'PDF',
      size: '1.5 MB',
      status: 'ready',
      required: false,
      description: 'Data protection and privacy information',
      lastModified: new Date().toISOString()
    }
  ]);

  const [selectedDocs, setSelectedDocs] = useState([]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'generating':
        return <ClockIcon className="h-5 w-5 text-yellow-600 animate-spin" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
    }
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <DocumentTextIcon className="h-8 w-8 text-red-600" />;
      case 'doc':
      case 'docx':
        return <DocumentTextIcon className="h-8 w-8 text-blue-600" />;
      default:
        return <DocumentTextIcon className="h-8 w-8 text-gray-600" />;
    }
  };

  const handleDocumentSelect = (docId) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    const readyDocs = documents.filter(doc => doc.status === 'ready').map(doc => doc.id);
    setSelectedDocs(readyDocs);
  };

  const handleDownloadSelected = () => {
    // In a real app, this would trigger document download
    alert(`Downloading ${selectedDocs.length} documents...`);
  };

  const handleContinueToSigning = () => {
    const requiredReady = documents.filter(doc => doc.required && doc.status === 'ready');
    if (requiredReady.length === documents.filter(doc => doc.required).length) {
      // Navigate to director notification page to show email process
      navigate('/director-notification');
    } else {
      alert('Please wait for all required documents to be generated.');
    }
  };

  const readyCount = documents.filter(doc => doc.status === 'ready').length;
  const totalCount = documents.length;
  const requiredReady = documents.filter(doc => doc.required && doc.status === 'ready').length;
  const totalRequired = documents.filter(doc => doc.required).length;

  if (!currentApplication) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Document Generation
        </h1>
        <p className="text-lg text-gray-600">
          Review and download your loan documents before signing
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {readyCount}/{totalCount}
            </div>
            <div className="text-sm text-gray-600">Documents Ready</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {requiredReady}/{totalRequired}
            </div>
            <div className="text-sm text-gray-600">Required Documents</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {Math.round((readyCount / totalCount) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(readyCount / totalCount) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Progress</span>
            <span>{readyCount} of {totalCount} documents ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Documents List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Generated Documents</h2>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  Select All Ready
                </button>
                
                {selectedDocs.length > 0 && (
                  <button
                    onClick={handleDownloadSelected}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Download ({selectedDocs.length})
                  </button>
                )}
              </div>
            </div>

            {/* Documents Grid */}
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`border rounded-lg p-4 transition-all ${
                    selectedDocs.includes(doc.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${doc.status !== 'ready' ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {doc.status === 'ready' && (
                        <input
                          type="checkbox"
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => handleDocumentSelect(doc.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      )}
                      
                      <div className="flex items-center space-x-3">
                        {getFileIcon(doc.type)}
                        <div>
                          <div className="font-medium text-gray-900 flex items-center">
                            {doc.name}
                            {doc.required && <span className="text-red-500 ml-1">*</span>}
                          </div>
                          <div className="text-sm text-gray-600">{doc.description}</div>
                          <div className="text-xs text-gray-500">
                            {doc.type} • {doc.size}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusIcon(doc.status)}
                      
                      {doc.status === 'ready' && (
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 transition-colors">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      
                      {doc.status === 'generating' && (
                        <div className="text-sm text-yellow-600">Generating...</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <span className="text-red-500">*</span> Required for loan completion
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Document Status</h3>
            
            {/* Status Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ready to Download</span>
                <span className="font-medium text-green-600">{readyCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Generating</span>
                <span className="font-medium text-yellow-600">
                  {documents.filter(doc => doc.status === 'generating').length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Required Complete</span>
                <span className="font-medium text-blue-600">
                  {requiredReady}/{totalRequired}
                </span>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Important</p>
                  <p className="text-blue-700">
                    Please review all documents carefully before proceeding to signing.
                  </p>
                </div>
              </div>
            </div>

            {/* Document Info */}
            <div className="space-y-3 mb-6 text-sm">
              <h4 className="font-medium text-gray-900">Document Types</h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                  Loan agreements
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Security documents
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Payment authorizations
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                  Terms & conditions
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleContinueToSigning}
                disabled={requiredReady !== totalRequired}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Continue to Signing
              </button>
              
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Download All (ZIP)
              </button>
            </div>

            {/* Help */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Questions about the documents? Our team can help explain any terms.
              </p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/decision')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Decision
        </button>
        
        <div className="text-sm text-gray-500">
          Documents generated automatically • Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Documents;
