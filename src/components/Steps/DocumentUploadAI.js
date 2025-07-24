import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication, applicationActions } from '../../context/ApplicationContext';
import aiService from '../../services/aiService';
import { 
  DocumentIcon, 
  CloudArrowUpIcon, 
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  SparklesIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

// Document types based on applicant type and products
const getRequiredDocuments = (applicantType, selectedProducts) => {
  const baseDocuments = [
    {
      id: 'identity-verification',
      name: 'Identity Verification',
      description: 'Passport or Driver\'s License',
      required: true,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '10MB',
      aiCapable: true,
      aiDescription: 'AI will extract your personal details automatically'
    },
    {
      id: 'address-verification',
      name: 'Address Verification',
      description: 'Recent Utility Bill or Bank Statement (last 3 months)',
      required: true,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '10MB',
      aiCapable: true,
      aiDescription: 'AI will verify your address and extract details'
    }
  ];

  const businessDocuments = [];
  
  if (applicantType === 'sole-trader') {
    businessDocuments.push(
      {
        id: 'business-registration',
        name: 'Business Registration',
        description: 'Certificate of Business Name or Trade License',
        required: true,
        acceptedTypes: '.pdf,.jpg,.jpeg,.png',
        maxSize: '10MB',
        aiCapable: true,
        aiDescription: 'AI will extract business details and verify registration'
      }
    );
  } else if (applicantType === 'partnership') {
    businessDocuments.push(
      {
        id: 'partnership-agreement',
        name: 'Partnership Agreement',
        description: 'Legal Partnership Agreement or Deed',
        required: true,
        acceptedTypes: '.pdf,.doc,.docx',
        maxSize: '15MB',
        aiCapable: true,
        aiDescription: 'AI will extract partner details and ownership structure'
      }
    );
  } else if (applicantType === 'limited-company') {
    businessDocuments.push(
      {
        id: 'certificate-incorporation',
        name: 'Certificate of Incorporation',
        description: 'Companies Registration Office Certificate',
        required: true,
        acceptedTypes: '.pdf,.jpg,.jpeg,.png',
        maxSize: '10MB',
        aiCapable: true,
        aiDescription: 'AI will auto-fill company details from CRO data'
      },
      {
        id: 'directors-details',
        name: 'Directors and Shareholders',
        description: 'List of current directors and beneficial owners',
        required: true,
        acceptedTypes: '.pdf,.doc,.docx',
        maxSize: '10MB',
        aiCapable: true,
        aiDescription: 'AI will extract director information and ownership percentages'
      }
    );
  }

  // Financial documents based on selected products
  const financialDocuments = [
    {
      id: 'bank-statements',
      name: 'Bank Statements',
      description: 'Last 6 months business bank statements',
      required: true,
      acceptedTypes: '.pdf,.csv,.xlsx',
      maxSize: '20MB',
      aiCapable: true,
      aiDescription: 'AI will analyze cash flow, income patterns, and financial health'
    },
    {
      id: 'financial-statements',
      name: 'Financial Statements',
      description: 'Latest audited accounts or management accounts',
      required: selectedProducts.some(p => p.amount > 50000),
      acceptedTypes: '.pdf,.xlsx,.xls',
      maxSize: '15MB',
      aiCapable: true,
      aiDescription: 'AI will extract key financial ratios and performance metrics'
    }
  ];

  if (selectedProducts.some(p => p.type === 'invoice-financing')) {
    financialDocuments.push({
      id: 'accounts-receivable',
      name: 'Accounts Receivable',
      description: 'Outstanding invoices and debtor listing',
      required: true,
      acceptedTypes: '.pdf,.xlsx,.csv',
      maxSize: '10MB',
      aiCapable: true,
      aiDescription: 'AI will assess invoice quality and collection probability'
    });
  }

  return [...baseDocuments, ...businessDocuments, ...financialDocuments];
};

function DocumentUpload() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const [documents, setDocuments] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState({});
  const [extractedData, setExtractedData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState({});
  
  const requiredDocuments = getRequiredDocuments(state.applicantType, state.selectedProducts);

  useEffect(() => {
    // Load previously uploaded documents
    if (state.documents) {
      setDocuments(state.documents);
    }
  }, [state.documents]);

  const analyzeDocument = useCallback(async (documentId, file) => {
    setIsAnalyzing(prev => ({ ...prev, [documentId]: true }));
    
    try {
      // Determine document type for AI analysis
      const docType = getDocumentType(documentId);
      const analysis = await aiService.analyzeDocument(file, docType);
      
      setAiAnalysis(prev => ({ ...prev, [documentId]: analysis }));
      setExtractedData(prev => ({ ...prev, [documentId]: analysis.extracted }));
      
      // Update document status
      setDocuments(prev => ({
        ...prev,
        [documentId]: {
          ...prev[documentId],
          status: 'analyzed',
          aiAnalysis: analysis,
          confidence: analysis.confidence
        }
      }));

      // Auto-fill form data if available
      if (analysis.extracted && documentId === 'bank-statements') {
        // Auto-fill application details from bank statement analysis
        const bankData = await aiService.analyzeBankStatement(file);
        dispatch(applicationActions.updateApplicationFromAI(bankData));
      }

    } catch (error) {
      console.error('AI analysis failed:', error);
      setErrors(prev => ({ 
        ...prev, 
        [documentId]: 'AI analysis failed. Document uploaded but not analyzed.' 
      }));
    }
    
    setIsAnalyzing(prev => ({ ...prev, [documentId]: false }));
  }, [dispatch]);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles, documentId) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const newErrors = { ...errors };
      rejectedFiles.forEach(({ file, errors: fileErrors }) => {
        newErrors[documentId] = fileErrors.map(e => e.message).join(', ');
      });
      setErrors(newErrors);
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    // Clear any previous errors
    setErrors(prev => ({ ...prev, [documentId]: null }));

    // Simulate file upload with progress
    setUploadProgress(prev => ({ ...prev, [documentId]: 0 }));
    
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[documentId] || 0;
        if (currentProgress >= 100) {
          clearInterval(uploadInterval);
          return prev;
        }
        return { ...prev, [documentId]: currentProgress + 10 };
      });
    }, 100);

    // Store file info
    setTimeout(() => {
      const fileInfo = {
        id: documentId,
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        status: 'uploaded'
      };
      
      setDocuments(prev => ({ ...prev, [documentId]: fileInfo }));
      clearInterval(uploadInterval);
      setUploadProgress(prev => ({ ...prev, [documentId]: 100 }));
      
      // Start AI analysis
      analyzeDocument(documentId, file);
    }, 1500);
  }, [errors, analyzeDocument]);

  const getDocumentType = (documentId) => {
    const typeMap = {
      'identity-verification': 'identity',
      'address-verification': 'identity',
      'bank-statements': 'financial',
      'financial-statements': 'financial',
      'certificate-incorporation': 'legal',
      'partnership-agreement': 'legal',
      'directors-details': 'legal'
    };
    return typeMap[documentId] || 'identity';
  };

  const removeDocument = (documentId) => {
    setDocuments(prev => {
      const newDocs = { ...prev };
      delete newDocs[documentId];
      return newDocs;
    });
    setAiAnalysis(prev => {
      const newAnalysis = { ...prev };
      delete newAnalysis[documentId];
      return newAnalysis;
    });
    setExtractedData(prev => {
      const newData = { ...prev };
      delete newData[documentId];
      return newData;
    });
    setErrors(prev => ({ ...prev, [documentId]: null }));
  };

  const validateDocuments = () => {
    const newErrors = {};
    const requiredDocs = requiredDocuments.filter(doc => doc.required);
    
    requiredDocs.forEach(doc => {
      if (!documents[doc.id]) {
        newErrors[doc.id] = `${doc.name} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateDocuments()) {
      // Convert documents object to array for context storage
      const documentsArray = Object.entries(documents).map(([documentType, documentData]) => ({
        id: documentData.id || documentType,
        documentType,
        fileName: documentData.file?.name || documentData.fileName,
        fileType: documentData.file?.type || documentData.fileType,
        fileSize: documentData.file?.size || documentData.fileSize,
        uploadedAt: documentData.uploadedAt || new Date().toISOString(),
        status: documentData.status || 'uploaded',
        aiAnalysis: documentData.aiAnalysis,
        confidence: documentData.confidence
      }));

      dispatch(applicationActions.updateDocuments({
        documents: documentsArray,
        aiAnalysis,
        extractedData
      }));

      // Check if multi-party verification is needed
      if (state.applicantType === 'partnership' || state.applicantType === 'limited-company') {
        navigate('/multi-party-verification');
      } else {
        navigate('/review-decision');
      }
    }
  };

  const getUploadedCount = () => {
    return Object.keys(documents).length;
  };

  const getRequiredCount = () => {
    return requiredDocuments.filter(doc => doc.required).length;
  };

  const DocumentCard = ({ doc }) => {
    const uploaded = documents[doc.id];
    const progress = uploadProgress[doc.id];
    const analyzing = isAnalyzing[doc.id];
    const analysis = aiAnalysis[doc.id];
    const error = errors[doc.id];

    return (
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <DocumentIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">{doc.name}</h3>
              {doc.required && <span className="text-red-500 text-sm">*</span>}
              {doc.aiCapable && (
                <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
                  <SparklesIcon className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-600">AI Enhanced</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
            {doc.aiCapable && (
              <p className="text-xs text-blue-600 mt-1 italic">{doc.aiDescription}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Max size: {doc.maxSize} | Formats: {doc.acceptedTypes}
            </p>
          </div>
        </div>

        {/* Upload Area */}
        {!uploaded && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => document.getElementById(`file-${doc.id}`).click()}
          >
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </p>
            <input
              id={`file-${doc.id}`}
              type="file"
              className="hidden"
              accept={doc.acceptedTypes}
              onChange={(e) => {
                const files = Array.from(e.target.files);
                onDrop(files, [], doc.id);
              }}
            />
          </div>
        )}

        {/* Upload Progress */}
        {progress > 0 && progress < 100 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uploading...</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* AI Analysis Progress */}
        {analyzing && (
          <div className="flex items-center space-x-2 text-blue-600">
            <BeakerIcon className="h-5 w-5 animate-pulse" />
            <span className="text-sm">AI is analyzing document...</span>
          </div>
        )}

        {/* Uploaded Document */}
        {uploaded && (
          <div className="bg-green-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">{uploaded.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPreview(prev => ({ ...prev, [doc.id]: !prev[doc.id] }))}
                  className="text-green-600 hover:text-green-700"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* AI Analysis Results */}
            {analysis && (
              <div className="bg-white rounded-lg p-3 border">
                <div className="flex items-center space-x-2 mb-2">
                  <DocumentMagnifyingGlassIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">AI Analysis Complete</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {Math.round(analysis.confidence * 100)}% confidence
                  </span>
                </div>
                
                {analysis.extracted && (
                  <div className="space-y-1 text-xs text-gray-600">
                    {Object.entries(analysis.extracted).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-medium">{String(value).slice(0, 30)}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {analysis.insights && (
                  <div className="mt-2 text-xs text-blue-600">
                    <div className="font-medium">AI Insights:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.insights.slice(0, 2).map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Preview */}
            {showPreview[doc.id] && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 space-y-1">
                  <div><strong>File:</strong> {uploaded.name}</div>
                  <div><strong>Size:</strong> {(uploaded.size / 1024 / 1024).toFixed(2)} MB</div>
                  <div><strong>Uploaded:</strong> {new Date(uploaded.uploadedAt).toLocaleString()}</div>
                  <div><strong>Status:</strong> {uploaded.status}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Document Upload
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your documents and let our AI extract information automatically to speed up your application.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-blue-800">
            Document Upload Progress
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-800">
              {getUploadedCount()}/{getRequiredCount()}
            </div>
            <div className="text-sm text-blue-600">Required documents</div>
          </div>
        </div>
        
        <div className="w-full bg-blue-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getRequiredCount() > 0 ? (getUploadedCount() / getRequiredCount()) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* AI Features Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="h-8 w-8 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Document Processing</h3>
            <p className="text-gray-600">
              Our AI automatically extracts information from your documents, validates authenticity, 
              and pre-fills your application to save time and reduce errors.
            </p>
          </div>
        </div>
      </div>

      {/* Document Cards */}
      <div className="space-y-6">
        {requiredDocuments.map(doc => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>

      {/* AI Extracted Data Summary */}
      {Object.keys(extractedData).length > 0 && (
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2" />
            AI Extracted Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {Object.entries(extractedData).map(([docId, data]) => (
              <div key={docId} className="bg-white rounded-lg p-3">
                <div className="font-medium text-gray-900 mb-2">
                  {requiredDocuments.find(d => d.id === docId)?.name}
                </div>
                {data && typeof data === 'object' && Object.entries(data).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-gray-600">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-medium">{String(value).slice(0, 25)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/application-details')}
          className="btn-secondary px-6 py-3"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={getUploadedCount() < getRequiredCount()}
          className="btn-primary px-8 py-3 flex items-center"
        >
          Continue to Review
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>

      {/* Requirements Notice */}
      <div className="bg-amber-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-amber-800 mb-2">
          Document Requirements & AI Processing
        </h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• All documents must be clear, complete, and recent (within specified timeframes)</li>
          <li>• AI analysis typically takes 30-60 seconds per document</li>
          <li>• Extracted information will be pre-filled in your application for verification</li>
          <li>• Documents are encrypted and stored securely in compliance with GDPR</li>
          <li>• You can review and edit AI-extracted information before submission</li>
        </ul>
      </div>
    </div>
  );
}

export default DocumentUpload;
