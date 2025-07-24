import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useApplication,
  applicationActions,
} from '../../context/ApplicationContext';
import {
  DocumentIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

// Document types based on applicant type and products
const getRequiredDocuments = (applicantType, selectedProducts) => {
  const baseDocuments = [
    {
      id: 'identity-verification',
      name: 'Identity Verification',
      description: "Passport or Driver's License",
      required: true,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '10MB',
    },
    {
      id: 'address-verification',
      name: 'Address Verification',
      description: 'Recent Utility Bill or Bank Statement (last 3 months)',
      required: true,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '10MB',
    },
  ];

  const businessDocuments = [
    {
      id: 'financial-statements',
      name: 'Financial Statements',
      description: 'Last Year-End Financials',
      required: true,
      acceptedTypes: '.pdf',
      maxSize: '10MB',
    },
    {
      id: 'bank-statements',
      name: 'Bank Statements',
      description: '6 months business bank statements',
      required: true,
      acceptedTypes: '.pdf',
      maxSize: '10MB',
    },
    {
      id: 'cash-flow-forecast',
      name: 'Cash Flow Forecast',
      description: '12-month cash flow projection',
      required: false,
      acceptedTypes: '.pdf,.xlsx,.xls',
      maxSize: '10MB',
    },
  ];

  // Applicant-specific documents
  const applicantSpecificDocs = [];

  if (applicantType === 'limited-company') {
    applicantSpecificDocs.push({
      id: 'certificate-incorporation',
      name: 'Certificate of Incorporation',
      description: 'Company registration certificate',
      required: true,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '10MB',
    });
    applicantSpecificDocs.push({
      id: 'memorandum-articles',
      name: 'Memorandum & Articles',
      description: 'Memorandum and Articles of Association',
      required: true,
      acceptedTypes: '.pdf',
      maxSize: '10MB',
    });
  }

  if (applicantType === 'partnership') {
    applicantSpecificDocs.push({
      id: 'partnership-agreement',
      name: 'Partnership Agreement',
      description: 'Partnership agreement or deed',
      required: true,
      acceptedTypes: '.pdf',
      maxSize: '10MB',
    });
  }

  // Product-specific documents
  const productSpecificDocs = [];

  if (selectedProducts.includes('green-loan')) {
    productSpecificDocs.push({
      id: 'ber-certificate',
      name: 'BER Certificate',
      description:
        'Building Energy Rating Certificate (for property improvements)',
      required: false,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '10MB',
    });
    productSpecificDocs.push({
      id: 'environmental-impact',
      name: 'Environmental Impact Assessment',
      description: 'Documentation showing environmental benefits',
      required: false,
      acceptedTypes: '.pdf',
      maxSize: '10MB',
    });
  }

  // Optional documents
  const optionalDocuments = [
    {
      id: 'tax-clearance',
      name: 'Tax Clearance Certificate',
      description: 'Current tax clearance certificate',
      required: false,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '10MB',
    },
    {
      id: 'invoices-quotes',
      name: 'Invoices/Quotes',
      description: 'For specific purchases or equipment',
      required: false,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '10MB',
    },
    {
      id: 'collateral-docs',
      name: 'Collateral Documentation',
      description: 'Property deeds, ownership documents',
      required: false,
      acceptedTypes: '.pdf',
      maxSize: '10MB',
    },
    {
      id: 'additional-documents',
      name: 'Additional Supporting Documents',
      description: 'Any other relevant documentation',
      required: false,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png,.xlsx,.xls',
      maxSize: '10MB',
    },
  ];

  return [
    ...baseDocuments,
    ...applicantSpecificDocs,
    ...businessDocuments,
    ...productSpecificDocs,
    ...optionalDocuments,
  ];
};

function DocumentUpload() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const [uploadedDocuments, setUploadedDocuments] = useState(
    state.uploadedDocuments || []
  );
  const [dragOver, setDragOver] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!state.applicantType || state.selectedProducts.length === 0) {
      navigate('/');
    }
  }, [state.applicantType, state.selectedProducts, navigate]);

  const documentTypes = getRequiredDocuments(
    state.applicantType,
    state.selectedProducts
  );
  const requiredDocuments = documentTypes.filter((doc) => doc.required);
  const optionalDocuments = documentTypes.filter((doc) => !doc.required);

  const validateFiles = () => {
    const newErrors = {};

    // Check if all required documents are uploaded
    const uploadedDocIds = uploadedDocuments.map((doc) => doc.documentType);
    const missingRequired = requiredDocuments.filter(
      (doc) => !uploadedDocIds.includes(doc.id)
    );

    if (missingRequired.length > 0) {
      newErrors.required = `Please upload the following required documents: ${missingRequired
        .map((doc) => doc.name)
        .join(', ')}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateFiles()) {
      dispatch(
        applicationActions.updateApplicationDetails({ uploadedDocuments })
      );
      navigate('/review-decision');
    }
  };

  const handleBack = () => {
    navigate('/application-details');
  };

  const handleFileUpload = (documentType, files) => {
    const fileList = Array.from(files);

    fileList.forEach((file, index) => {
      const docType = documentTypes.find((d) => d.id === documentType);

      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!docType.acceptedTypes.includes(fileExtension)) {
        setErrors((prev) => ({
          ...prev,
          [documentType]: `Invalid file type. Accepted types: ${docType.acceptedTypes}`,
        }));
        return;
      }

      // Validate file size (10MB = 10 * 1024 * 1024 bytes)
      const maxSizeBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setErrors((prev) => ({
          ...prev,
          [documentType]: `File size exceeds ${docType.maxSize} limit`,
        }));
        return;
      }

      // Clear errors for this document type
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[documentType];
        return newErrors;
      });

      // Simulate file upload with progress
      const documentId = `${documentType}-${Date.now()}-${index}`;

      setUploadProgress((prev) => ({ ...prev, [documentId]: 0 }));

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const currentProgress = prev[documentId] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);

            // Add document to uploaded list
            const newDocument = {
              id: documentId,
              documentType,
              fileName: file.name,
              fileSize: file.size,
              uploadDate: new Date().toISOString(),
              status: 'uploaded',
              file: file, // In real app, this would be a URL or file reference
            };

            setUploadedDocuments((prev) => {
              // Remove existing document of same type if replacing
              const filtered = prev.filter(
                (doc) => doc.documentType !== documentType
              );
              return [...filtered, newDocument];
            });

            // Remove from progress tracking
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[documentId];
              return newProgress;
            });

            return prev;
          }

          return { ...prev, [documentId]: currentProgress + 10 };
        });
      }, 200);
    });
  };

  const handleDragOver = (e, documentType) => {
    e.preventDefault();
    setDragOver(documentType);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e, documentType) => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    handleFileUpload(documentType, files);
  };

  const removeDocument = (documentId) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  const isDocumentUploaded = (documentType) => {
    return uploadedDocuments.some((doc) => doc.documentType === documentType);
  };

  const getUploadedDocument = (documentType) => {
    return uploadedDocuments.find((doc) => doc.documentType === documentType);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const DocumentUploadCard = ({ docType, isRequired }) => {
    const isUploaded = isDocumentUploaded(docType.id);
    const uploadedDoc = getUploadedDocument(docType.id);
    const hasError = errors[docType.id];
    const progressKeys = Object.keys(uploadProgress).filter((key) =>
      key.startsWith(docType.id)
    );
    const inProgress = progressKeys.length > 0;

    return (
      <div
        className={`card ${
          isUploaded
            ? 'border-green-200 bg-green-50'
            : hasError
            ? 'border-red-200 bg-red-50'
            : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <DocumentIcon className="h-5 w-5 text-gray-600" />
              <h3 className="text-md font-medium text-gray-900">
                {docType.name}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </h3>
              {isUploaded && (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              )}
            </div>

            <p className="text-sm text-gray-600 mb-3">{docType.description}</p>

            <div className="text-xs text-gray-500">
              Accepted: {docType.acceptedTypes} • Max size: {docType.maxSize}
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {!isUploaded && !inProgress && (
          <div
            className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${
                dragOver === docType.id
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-gray-300'
              }
              ${hasError ? 'border-red-300' : 'hover:border-primary-400'}
            `}
            onDragOver={(e) => handleDragOver(e, docType.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, docType.id)}
          >
            <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your file here, or{' '}
              <label className="text-primary-600 cursor-pointer hover:text-primary-700">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept={docType.acceptedTypes}
                  onChange={(e) => handleFileUpload(docType.id, e.target.files)}
                />
              </label>
            </p>
          </div>
        )}

        {/* Progress Indicator */}
        {inProgress && (
          <div className="mt-4">
            {progressKeys.map((key) => (
              <div key={key} className="space-y-2">
                <div className="text-sm text-gray-600">Uploading...</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress[key]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Document Info */}
        {isUploaded && uploadedDoc && (
          <div className="mt-4 flex items-center justify-between bg-white rounded-lg p-3 border">
            <div className="flex items-center space-x-3">
              <DocumentIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {uploadedDoc.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(uploadedDoc.fileSize)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  /* Implement file preview */
                }}
                className="text-primary-600 hover:text-primary-700"
                title="Preview"
              >
                <EyeIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => removeDocument(uploadedDoc.id)}
                className="text-red-600 hover:text-red-700"
                title="Remove"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {hasError && (
          <div className="mt-3 text-sm text-red-600">{hasError}</div>
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
          Please upload the required documents to complete your application.
          Documents marked with * are mandatory.
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Upload Progress
            </h3>
            <p className="text-sm text-blue-600">
              {
                uploadedDocuments.filter((doc) =>
                  requiredDocuments.some((req) => req.id === doc.documentType)
                ).length
              }{' '}
              of {requiredDocuments.length} required documents uploaded
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-800">
              {Math.round(
                (uploadedDocuments.filter((doc) =>
                  requiredDocuments.some((req) => req.id === doc.documentType)
                ).length /
                  requiredDocuments.length) *
                  100
              )}
              %
            </div>
            <div className="text-xs text-blue-600">Complete</div>
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Required Documents
        </h2>
        <div className="space-y-4">
          {requiredDocuments.map((docType) => (
            <DocumentUploadCard
              key={docType.id}
              docType={docType}
              isRequired={true}
            />
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Optional Documents
          <span className="text-sm font-normal text-gray-600 ml-2">
            (Can improve your application)
          </span>
        </h2>
        <div className="space-y-4">
          {optionalDocuments.map((docType) => (
            <DocumentUploadCard
              key={docType.id}
              docType={docType}
              isRequired={false}
            />
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errors.required && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{errors.required}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={handleBack} className="btn-secondary px-6 py-3">
          Back
        </button>
        <button onClick={handleNext} className="btn-primary px-8 py-3">
          Continue to Review
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-green-800 mb-2">
          Document Security & Privacy
        </h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• All documents are encrypted during upload and storage</li>
          <li>
            • Files are processed securely in Ireland under GDPR compliance
          </li>
          <li>
            • Documents are automatically deleted after application processing
          </li>
          <li>• Only authorized personnel can access your documentation</li>
        </ul>
      </div>
    </div>
  );
}

export default DocumentUpload;
