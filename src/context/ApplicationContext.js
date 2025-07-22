import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  currentStep: 0,
  selectedProducts: [],
  applicantType: '',
  businessInfo: {
    businessName: '',
    tradingName: '',
    registeredAddress: '',
    tradingAddress: '',
    phone: '',
    email: '',
    businessIdentifiers: {},
    industryType: '',
    numberOfEmployees: '',
    annualTurnover: '',
    yearEstablished: '',
    bankAccount: ''
  },
  personalInfo: {
    owners: [],
    partners: [],
    beneficialOwners: []
  },
  applicationDetails: {
    purposeOfCredit: '',
    amountRequested: '',
    annualTurnover: '',
    existingDebts: '',
    // Product specific fields will be added dynamically
    termLoan: {},
    greenLoan: {},
    overdraft: {},
    creditCard: {}
  },
  uploadedDocuments: [],
  documents: [],
  declarations: {
    truthfulness: false,
    gdprConsent: false,
    creditCheckConsent: false,
    termsAndConditions: false
  },
  decisionOutcome: null,
  creditAgreement: {
    signed: false,
    agreementText: '',
    signatureData: null
  },
  multiPartyVerification: null
};

// Action types
const actionTypes = {
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  SET_SELECTED_PRODUCTS: 'SET_SELECTED_PRODUCTS',
  SET_APPLICANT_TYPE: 'SET_APPLICANT_TYPE',
  UPDATE_BUSINESS_INFO: 'UPDATE_BUSINESS_INFO',
  UPDATE_PERSONAL_INFO: 'UPDATE_PERSONAL_INFO',
  UPDATE_APPLICATION_DETAILS: 'UPDATE_APPLICATION_DETAILS',
  ADD_UPLOADED_DOCUMENT: 'ADD_UPLOADED_DOCUMENT',
  REMOVE_UPLOADED_DOCUMENT: 'REMOVE_UPLOADED_DOCUMENT',
  UPDATE_DECLARATIONS: 'UPDATE_DECLARATIONS',
  SET_DECISION_OUTCOME: 'SET_DECISION_OUTCOME',
  UPDATE_CREDIT_AGREEMENT: 'UPDATE_CREDIT_AGREEMENT',
  RESET_APPLICATION: 'RESET_APPLICATION',
  // AI-specific actions
  UPDATE_DOCUMENTS: 'UPDATE_DOCUMENTS',
  UPDATE_APPLICATION_FROM_AI: 'UPDATE_APPLICATION_FROM_AI',
  SET_AI_ANALYSIS: 'SET_AI_ANALYSIS',
  UPDATE_MULTI_PARTY_VERIFICATION: 'UPDATE_MULTI_PARTY_VERIFICATION'
};

// Reducer function
function applicationReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_CURRENT_STEP:
      return { ...state, currentStep: action.payload };
    
    case actionTypes.SET_SELECTED_PRODUCTS:
      return { ...state, selectedProducts: action.payload };
    
    case actionTypes.SET_APPLICANT_TYPE:
      return { ...state, applicantType: action.payload };
    
    case actionTypes.UPDATE_BUSINESS_INFO:
      return {
        ...state,
        businessInfo: { ...state.businessInfo, ...action.payload }
      };
    
    case actionTypes.UPDATE_PERSONAL_INFO:
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload }
      };
    
    case actionTypes.UPDATE_APPLICATION_DETAILS:
      return {
        ...state,
        applicationDetails: { ...state.applicationDetails, ...action.payload }
      };
    
    case actionTypes.ADD_UPLOADED_DOCUMENT:
      return {
        ...state,
        uploadedDocuments: [...state.uploadedDocuments, action.payload]
      };
    
    case actionTypes.REMOVE_UPLOADED_DOCUMENT:
      return {
        ...state,
        uploadedDocuments: state.uploadedDocuments.filter(doc => doc.id !== action.payload)
      };
    
    case actionTypes.UPDATE_DECLARATIONS:
      return {
        ...state,
        declarations: { ...state.declarations, ...action.payload }
      };
    
    case actionTypes.SET_DECISION_OUTCOME:
      return { ...state, decisionOutcome: action.payload };
    
    case actionTypes.UPDATE_CREDIT_AGREEMENT:
      return {
        ...state,
        creditAgreement: { ...state.creditAgreement, ...action.payload }
      };
    
    case actionTypes.RESET_APPLICATION:
      return initialState;
    
    // AI-specific cases
    case actionTypes.UPDATE_DOCUMENTS:
      return {
        ...state,
        uploadedDocuments: action.payload.documents || [],
        documents: action.payload.documents || [],
        aiAnalysis: action.payload.aiAnalysis,
        extractedData: action.payload.extractedData
      };
    
    case actionTypes.UPDATE_APPLICATION_FROM_AI:
      return {
        ...state,
        applicationDetails: {
          ...state.applicationDetails,
          ...action.payload.applicationDetails
        },
        businessInfo: {
          ...state.businessInfo,
          ...action.payload.businessInfo
        },
        aiExtracted: true
      };
    
    case actionTypes.SET_AI_ANALYSIS:
      return {
        ...state,
        aiAnalysis: { ...state.aiAnalysis, ...action.payload }
      };
    
    case actionTypes.UPDATE_MULTI_PARTY_VERIFICATION:
      return {
        ...state,
        multiPartyVerification: action.payload
      };
    
    default:
      return state;
  }
}

// Create context
const ApplicationContext = createContext();

// Provider component
export function ApplicationProvider({ children }) {
  const [state, dispatch] = useReducer(applicationReducer, initialState);

  const value = {
    state,
    dispatch,
    actionTypes
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

// Custom hook to use the context
export function useApplication() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
}

// Helper functions for common actions
export const applicationActions = {
  setCurrentStep: (step) => ({ type: actionTypes.SET_CURRENT_STEP, payload: step }),
  setSelectedProducts: (products) => ({ type: actionTypes.SET_SELECTED_PRODUCTS, payload: products }),
  setApplicantType: (type) => ({ type: actionTypes.SET_APPLICANT_TYPE, payload: type }),
  updateBusinessInfo: (info) => ({ type: actionTypes.UPDATE_BUSINESS_INFO, payload: info }),
  updatePersonalInfo: (info) => ({ type: actionTypes.UPDATE_PERSONAL_INFO, payload: info }),
  updateApplicationDetails: (details) => ({ type: actionTypes.UPDATE_APPLICATION_DETAILS, payload: details }),
  addUploadedDocument: (document) => ({ type: actionTypes.ADD_UPLOADED_DOCUMENT, payload: document }),
  removeUploadedDocument: (documentId) => ({ type: actionTypes.REMOVE_UPLOADED_DOCUMENT, payload: documentId }),
  updateDeclarations: (declarations) => ({ type: actionTypes.UPDATE_DECLARATIONS, payload: declarations }),
  setDecisionOutcome: (outcome) => ({ type: actionTypes.SET_DECISION_OUTCOME, payload: outcome }),
  updateCreditAgreement: (agreement) => ({ type: actionTypes.UPDATE_CREDIT_AGREEMENT, payload: agreement }),
  resetApplication: () => ({ type: actionTypes.RESET_APPLICATION }),
  // AI-specific actions
  updateDocuments: (data) => ({ type: actionTypes.UPDATE_DOCUMENTS, payload: data }),
  updateApplicationFromAI: (data) => ({ type: actionTypes.UPDATE_APPLICATION_FROM_AI, payload: data }),
  setAIAnalysis: (analysis) => ({ type: actionTypes.SET_AI_ANALYSIS, payload: analysis }),
  updateMultiPartyVerification: (data) => ({ type: actionTypes.UPDATE_MULTI_PARTY_VERIFICATION, payload: data })
};
