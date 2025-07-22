import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import Layout from './components/Layout/Layout';
import ProductSelection from './components/Steps/ProductSelection';
import ApplicantTypeSelection from './components/Steps/ApplicantTypeSelection';
import CustomerDetails from './components/Steps/CustomerDetails';
import ApplicationDetails from './components/Steps/ApplicationDetails';
import DocumentUpload from './components/Steps/DocumentUpload';
import ReviewDecision from './components/Steps/ReviewDecision';
import CreditAgreement from './components/Steps/CreditAgreement';
import Completion from './components/Steps/Completion';

function App() {
  return (
    <ApplicationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ProductSelection />} />
            <Route path="/applicant-type" element={<ApplicantTypeSelection />} />
            <Route path="/customer-details" element={<CustomerDetails />} />
            <Route path="/application-details" element={<ApplicationDetails />} />
            <Route path="/document-upload" element={<DocumentUpload />} />
            <Route path="/review-decision" element={<ReviewDecision />} />
            <Route path="/credit-agreement" element={<CreditAgreement />} />
            <Route path="/completion" element={<Completion />} />
          </Routes>
        </Layout>
      </Router>
    </ApplicationProvider>
  );
}

export default App;
