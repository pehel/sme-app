import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import Layout from './components/Layout/Layout';
import AIAssistant from './components/AIAssistant';
import ProductSelectionEnhanced from './components/Steps/ProductSelectionEnhanced';
import ApplicantTypeSelectionEnhanced from './components/Steps/ApplicantTypeSelectionEnhanced';
import CustomerDetailsAI from './components/Steps/CustomerDetailsAI';
import ApplicationDetailsEnhanced from './components/Steps/ApplicationDetailsEnhanced';
import DocumentUploadSimplified from './components/Steps/DocumentUploadSimplified';
import MultiPartyVerificationWrapper from './components/Steps/MultiPartyVerificationWrapper';
import ReviewDecision from './components/Steps/ReviewDecision';
import CreditAgreement from './components/Steps/CreditAgreement';
import Completion from './components/Steps/Completion';

// Component to get current step for Banking Assistant
function AppContent() {
  const location = useLocation();
  const getCurrentStep = () => {
    const path = location.pathname.replace('/', '');
    return path || 'product-selection';
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProductSelectionEnhanced />} />
        <Route
          path="/applicant-type"
          element={<ApplicantTypeSelectionEnhanced />}
        />
        <Route path="/customer-details" element={<CustomerDetailsAI />} />
        <Route
          path="/application-details"
          element={<ApplicationDetailsEnhanced />}
        />
        <Route path="/document-upload" element={<DocumentUploadSimplified />} />
        <Route
          path="/multi-party-verification"
          element={<MultiPartyVerificationWrapper />}
        />
        <Route path="/review-decision" element={<ReviewDecision />} />
        <Route path="/credit-agreement" element={<CreditAgreement />} />
        <Route path="/completion" element={<Completion />} />
      </Routes>
      <AIAssistant currentStep={getCurrentStep()} />
    </Layout>
  );
}

function App() {
  return (
    <ApplicationProvider>
      <Router>
        <AppContent />
      </Router>
    </ApplicationProvider>
  );
}

export default App;
