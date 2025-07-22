import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import Layout from './components/Layout/Layout';
import AIAssistant from './components/AIAssistant';
import ProductSelection from './components/Steps/ProductSelection';
import ApplicantTypeSelection from './components/Steps/ApplicantTypeSelection';
import CustomerDetails from './components/Steps/CustomerDetails';
import ApplicationDetails from './components/Steps/ApplicationDetails';
import DocumentUploadAI from './components/Steps/DocumentUploadAI';
import MultiPartyVerification from './components/Steps/MultiPartyVerification';
import ReviewDecision from './components/Steps/ReviewDecision';
import CreditAgreement from './components/Steps/CreditAgreement';
import Completion from './components/Steps/Completion';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import Layout from './components/Layout/Layout';
import AIAssistant from './components/AIAssistant';
import ProductSelection from './components/Steps/ProductSelection';
import ApplicantTypeSelection from './components/Steps/ApplicantTypeSelection';
import CustomerDetails from './components/Steps/CustomerDetails';
import ApplicationDetails from './components/Steps/ApplicationDetails';
import DocumentUploadAI from './components/Steps/DocumentUploadAI';
import MultiPartyVerification from './components/Steps/MultiPartyVerification';
import ReviewDecision from './components/Steps/ReviewDecision';
import CreditAgreement from './components/Steps/CreditAgreement';
import Completion from './components/Steps/Completion';

// Component to get current step for AI Assistant
function AppContent() {
  const location = useLocation();
  const getCurrentStep = () => {
    const path = location.pathname.replace('/', '');
    return path || 'product-selection';
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProductSelection />} />
        <Route path="/applicant-type" element={<ApplicantTypeSelection />} />
        <Route path="/customer-details" element={<CustomerDetails />} />
        <Route path="/application-details" element={<ApplicationDetails />} />
        <Route path="/document-upload" element={<DocumentUploadAI />} />
        <Route path="/multi-party-verification" element={<MultiPartyVerification />} />
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
