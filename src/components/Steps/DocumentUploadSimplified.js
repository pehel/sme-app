import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useApplication,
  applicationActions,
} from '../../context/ApplicationContext';
import {
  DocumentArrowUpIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BanknotesIcon,
  SparklesIcon,
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const requiredDocuments = {
  all: [
    {
      id: 'financial-statements',
      name: 'Financial Statements',
      description: 'Latest audited financial statements (2-3 years)',
      icon: BanknotesIcon,
      required: true,
    },
    {
      id: 'bank-statements',
      name: 'Bank Statements',
      description: 'Business bank statements (last 6 months)',
      icon: CreditCardIcon,
      required: true,
    },
  ],
  'term-loan': [
    {
      id: 'asset-valuation',
      name: 'Asset Valuation',
      description: 'Professional valuation of assets (if applicable)',
      icon: DocumentTextIcon,
      required: false,
    },
    {
      id: 'purchase-agreement',
      name: 'Purchase Agreement',
      description: 'Equipment or property purchase agreement',
      icon: DocumentTextIcon,
      required: false,
    },
  ],
  'green-loan': [
    {
      id: 'environmental-impact',
      name: 'Environmental Impact Assessment',
      description: 'Assessment of environmental benefits and impact',
      icon: SparklesIcon,
      required: true,
    },
    {
      id: 'green-certification',
      name: 'Green Certification',
      description: 'Environmental certifications or compliance documents',
      icon: SparklesIcon,
      required: false,
    },
    {
      id: 'energy-audit',
      name: 'Energy Audit Report',
      description: 'Current energy usage and efficiency plans',
      icon: SparklesIcon,
      required: false,
    },
  ],
};

const mockDocumentContent = {
  'business-plan':
    'Executive Summary: TechGreen Solutions is a growing SME specializing in sustainable technology solutions...',
  'financial-statements':
    'INCOME STATEMENT - Year Ending 2023\nRevenue: €2,450,000\nCost of Goods Sold: €1,470,000\nGross Profit: €980,000...',
  'bank-statements':
    'BUSINESS ACCOUNT STATEMENT - November 2024\nOpening Balance: €245,670\nTotal Credits: €387,420\nTotal Debits: €298,150...',
  'management-accounts':
    'MANAGEMENT ACCOUNTS - Q3 2024\nOperating Revenue: €612,000\nOperating Expenses: €456,000\nEBITDA: €156,000...',
  'environmental-impact':
    'ENVIRONMENTAL IMPACT ASSESSMENT\nProject: Solar Panel Installation\nCO2 Reduction: 45 tonnes annually...',
  'asset-valuation':
    'ASSET VALUATION REPORT\nEquipment: Manufacturing Line\nCurrent Market Value: €485,000...',
  'purchase-agreement':
    'EQUIPMENT PURCHASE AGREEMENT\nVendor: GreenTech Manufacturing\nTotal Cost: €125,000...',
  'green-certification':
    'ISO 14001 ENVIRONMENTAL MANAGEMENT CERTIFICATION\nCertified Company: TechGreen Solutions...',
  'energy-audit':
    'ENERGY AUDIT REPORT 2024\nCurrent Annual Consumption: 145,000 kWh\nPotential Savings: 35%...',
};

function DocumentUploadSimplified() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [editingDocument, setEditingDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState({});

  useEffect(() => {
    if (!state.applicantType || state.selectedProducts.length === 0) {
      navigate('/');
    }
  }, [state.applicantType, state.selectedProducts, navigate]);

  const hasProduct = (productId) => state.selectedProducts.includes(productId);

  const getRequiredDocuments = () => {
    let documents = [...requiredDocuments.all];

    if (hasProduct('term-loan')) {
      documents = [...documents, ...requiredDocuments['term-loan']];
    }

    if (hasProduct('green-loan')) {
      documents = [...documents, ...requiredDocuments['green-loan']];
    }

    return documents;
  };

  const handleDocumentUpload = (documentId) => {
    // Simulate document upload
    const mockDocument = {
      id: documentId,
      name: `${documentId}-document.pdf`,
      size: Math.floor(Math.random() * 1000) + 500, // Random size between 500-1500 KB
      uploadDate: new Date(),
      status: 'uploaded',
      content:
        mockDocumentContent[documentId] ||
        'Document content would appear here...',
    };

    setUploadedDocuments((prev) => ({
      ...prev,
      [documentId]: mockDocument,
    }));

    setDocumentContent((prev) => ({
      ...prev,
      [documentId]: mockDocument.content,
    }));

    // Simulate AI processing
    setTimeout(() => {
      setUploadedDocuments((prev) => ({
        ...prev,
        [documentId]: {
          ...prev[documentId],
          status: 'processed',
          aiAnalysis: {
            keyFindings: getAIAnalysis(documentId),
            confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
            suggestions: getAISuggestions(documentId),
          },
        },
      }));
    }, 2000);
  };

  const getAIAnalysis = (documentId) => {
    const analyses = {
      'business-plan': [
        'Strong revenue projections',
        'Clear market strategy',
        'Experienced management team',
      ],
      'financial-statements': [
        'Healthy profit margins',
        'Strong cash position',
        'Low debt-to-equity ratio',
      ],
      'bank-statements': [
        'Consistent cash flow',
        'Regular customer payments',
        'Good banking history',
      ],
      'management-accounts': [
        'EBITDA trending upward',
        'Cost control improving',
        'Revenue growth 15% YoY',
      ],
      'environmental-impact': [
        'Significant CO2 reduction',
        'Measurable environmental benefits',
        'Compliance with regulations',
      ],
      'asset-valuation': [
        'Fair market valuation',
        'Assets in good condition',
        'Adequate collateral coverage',
      ],
      'purchase-agreement': [
        'Competitive pricing',
        'Reputable vendor',
        'Standard terms and conditions',
      ],
      'green-certification': [
        'Valid certifications',
        'Environmental compliance',
        'Sustainability commitment',
      ],
      'energy-audit': [
        'High efficiency potential',
        'Quick payback period',
        'Substantial energy savings',
      ],
    };
    return (
      analyses[documentId] || [
        'Document processed successfully',
        'Information extracted',
        'Ready for review',
      ]
    );
  };

  const getAISuggestions = (documentId) => {
    const suggestions = {
      'business-plan':
        'Consider adding more specific market share targets for the next 3 years.',
      'financial-statements':
        'Strong financials support your loan application. Consider highlighting cash flow stability.',
      'bank-statements':
        'Excellent banking history. This strengthens your creditworthiness significantly.',
      'management-accounts':
        'Recent performance trends are very positive for loan approval.',
      'environmental-impact':
        'Environmental benefits exceed minimum requirements for green loan qualification.',
      'asset-valuation':
        'Asset values provide excellent security for the requested loan amount.',
      'purchase-agreement':
        'Purchase terms are favorable and support the business case.',
      'green-certification':
        'Certifications qualify you for preferential green loan rates.',
      'energy-audit':
        'Energy savings projections support the loan business case strongly.',
    };
    return (
      suggestions[documentId] ||
      'Document meets all requirements for loan application.'
    );
  };

  const handleEditDocument = (documentId) => {
    setEditingDocument(documentId);
  };

  const handleSaveEdit = (documentId, newContent) => {
    setDocumentContent((prev) => ({
      ...prev,
      [documentId]: newContent,
    }));

    setUploadedDocuments((prev) => ({
      ...prev,
      [documentId]: {
        ...prev[documentId],
        content: newContent,
        lastModified: new Date(),
        status: 'edited',
      },
    }));

    setEditingDocument(null);
  };

  const handleDeleteDocument = (documentId) => {
    setUploadedDocuments((prev) => {
      const newDocs = { ...prev };
      delete newDocs[documentId];
      return newDocs;
    });

    setDocumentContent((prev) => {
      const newContent = { ...prev };
      delete newContent[documentId];
      return newContent;
    });
  };

  const isFormValid = () => {
    const documents = getRequiredDocuments();
    const requiredDocs = documents.filter((doc) => doc.required);
    return requiredDocs.every((doc) => uploadedDocuments[doc.id]);
  };

  const handleNext = () => {
    if (isFormValid()) {
      console.log('Documents being saved:', uploadedDocuments);
      console.log('Document count:', Object.keys(uploadedDocuments).length);

      const payload = {
        documents: uploadedDocuments,
        documentCount: Object.keys(uploadedDocuments).length,
      };

      console.log('Payload being dispatched:', payload);
      dispatch(applicationActions.updateDocuments(payload));
      navigate('/review-decision');
    }
  };

  const handleBack = () => {
    navigate('/application-details');
  };

  const formatFileSize = (sizeInKB) => {
    if (sizeInKB < 1000) {
      return `${sizeInKB} KB`;
    }
    return `${(sizeInKB / 1000).toFixed(1)} MB`;
  };

  const requiredDocs = getRequiredDocuments();
  const uploadedCount = Object.keys(uploadedDocuments).length;
  const requiredCount = requiredDocs.filter((doc) => doc.required).length;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Document Upload
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your business documents for AI-powered analysis and instant
          processing.
        </p>

        <div className="mt-6 flex justify-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <span className="text-sm font-medium text-blue-800">
              Progress: {uploadedCount} of {requiredCount} required documents
              uploaded
            </span>
          </div>
        </div>
      </div>

      {/* AI Processing Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <SparklesIcon className="h-6 w-6 text-purple-600 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-purple-800 mb-2">
              AI-Powered Document Processing
            </h3>
            <div className="text-sm text-purple-700 space-y-1">
              <p>
                • <strong>Instant Analysis:</strong> Documents are analyzed
                immediately upon upload
              </p>
              <p>
                • <strong>Key Information Extraction:</strong> Important
                financial metrics and data are automatically identified
              </p>
              <p>
                • <strong>Compliance Checking:</strong> Documents are verified
                against regulatory requirements
              </p>
              <p>
                • <strong>Risk Assessment:</strong> AI evaluates
                creditworthiness and application strength
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requiredDocs.map((document) => {
          const IconComponent = document.icon;
          const isUploaded = uploadedDocuments[document.id];
          const isProcessed = isUploaded?.status === 'processed';
          const isEdited = isUploaded?.status === 'edited';

          return (
            <div
              key={document.id}
              className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
                isUploaded
                  ? 'border-green-300 bg-green-50'
                  : document.required
                  ? 'border-gray-300 hover:border-blue-400 bg-white'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Document Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <IconComponent
                    className={`h-6 w-6 ${
                      isUploaded ? 'text-green-600' : 'text-gray-400'
                    }`}
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {document.name}
                      {document.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {document.description}
                    </p>
                  </div>
                </div>

                {isUploaded && (
                  <div className="flex items-center space-x-2">
                    {isProcessed && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    )}
                    <button
                      onClick={() => handleEditDocument(document.id)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Edit document"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(document.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete document"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Button or Document Info */}
              {!isUploaded ? (
                <button
                  onClick={() => handleDocumentUpload(document.id)}
                  className="w-full flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <DocumentArrowUpIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Click to Upload
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, DOC, XLS (Max 10MB)
                  </span>
                </button>
              ) : (
                <div className="space-y-3">
                  {/* Document Details */}
                  <div className="bg-white rounded-md p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {isUploaded.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(isUploaded.size)}
                      </span>
                    </div>

                    {editingDocument === document.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={documentContent[document.id] || ''}
                          onChange={(e) =>
                            setDocumentContent((prev) => ({
                              ...prev,
                              [document.id]: e.target.value,
                            }))
                          }
                          className="w-full h-24 text-xs border rounded px-2 py-1 resize-none"
                          placeholder="Document content..."
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleSaveEdit(
                                document.id,
                                documentContent[document.id]
                              )
                            }
                            className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingDocument(null)}
                            className="text-xs px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600 bg-gray-50 rounded p-2 max-h-20 overflow-y-auto">
                        {documentContent[document.id]?.substring(0, 200)}
                        {documentContent[document.id]?.length > 200 && '...'}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          isProcessed
                            ? 'bg-green-100 text-green-800'
                            : isEdited
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {isProcessed
                          ? 'AI Processed'
                          : isEdited
                          ? 'Edited'
                          : 'Processing...'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(isUploaded.uploadDate).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* AI Analysis Results */}
                  {isProcessed && isUploaded.aiAnalysis && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <SparklesIcon className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-xs font-medium text-blue-800">
                          AI Analysis ({isUploaded.aiAnalysis.confidence}%
                          confidence)
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="text-xs font-medium text-blue-700 mb-1">
                            Key Findings:
                          </div>
                          <ul className="text-xs text-blue-600 space-y-0.5">
                            {isUploaded.aiAnalysis.keyFindings.map(
                              (finding, index) => (
                                <li key={index}>• {finding}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div>
                          <div className="text-xs font-medium text-blue-700 mb-1">
                            AI Suggestion:
                          </div>
                          <p className="text-xs text-blue-600">
                            {isUploaded.aiAnalysis.suggestions}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Summary */}
      {Object.keys(uploadedDocuments).length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-800 mb-4 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Upload Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {uploadedCount}
              </div>
              <div className="text-green-700">Documents Uploaded</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  Object.values(uploadedDocuments).filter(
                    (doc) => doc.status === 'processed'
                  ).length
                }
              </div>
              <div className="text-green-700">AI Processed</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  Object.values(uploadedDocuments).reduce(
                    (acc, doc) => acc + (doc.aiAnalysis?.confidence || 0),
                    0
                  ) / Object.keys(uploadedDocuments).length
                ) || 0}
                %
              </div>
              <div className="text-green-700">Avg. AI Confidence</div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Message */}
      {!isFormValid() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">
              Please upload all required documents to continue.
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={handleBack} className="btn-secondary px-6 py-3">
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isFormValid()}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            isFormValid()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Review Application
        </button>
      </div>
    </div>
  );
}

export default DocumentUploadSimplified;
