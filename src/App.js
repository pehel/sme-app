  import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import { AuthProvider, useAuth, USER_ROLES } from './context/AuthContext';

// Authentication Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MFAVerify from './components/Auth/MFAVerify';

// Dashboard Components
import CustomerDashboard from './components/Dashboard/CustomerDashboard';
import RMDashboard from './components/Dashboard/RMDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';

// Application Components
import Layout from './components/Layout/Layout';
import AIAssistant from './components/AIAssistant';
import ApplicationView from './components/ApplicationView';
import RMReview from './components/RMReview';
import ProductSelectionEnhanced from './components/Steps/ProductSelectionEnhanced';
import ApplicantTypeSelectionEnhanced from './components/Steps/ApplicantTypeSelectionEnhanced';
import CustomerDetailsAI from './components/Steps/CustomerDetailsAI';
import ApplicationDetailsEnhanced from './components/Steps/ApplicationDetailsEnhanced';
import DocumentUploadSimplified from './components/Steps/DocumentUploadSimplified';
import MultiPartyVerificationWrapper from './components/Steps/MultiPartyVerificationWrapper';
import ReviewDecision from './components/Steps/ReviewDecision';
import CreditAgreement from './components/Steps/CreditAgreement';
import Completion from './components/Steps/Completion';

// Route Guards
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth();

  console.log('🛡️ ProtectedRoute - Auth state:', { 
    isAuthenticated, 
    user: user?.email, 
    role: user?.role, 
    allowedRoles 
  });

  if (!isAuthenticated) {
    console.log('🛡️ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('🛡️ Role not allowed, redirecting to appropriate dashboard');
    // Redirect to appropriate dashboard based on user role
    switch (user?.role) {
      case USER_ROLES.CUSTOMER:
        return <Navigate to="/customer/dashboard" replace />;
      case USER_ROLES.RM:
        return <Navigate to="/rm/dashboard" replace />;
      case USER_ROLES.SUPERUSER:
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  console.log('🛡️ Access granted');
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // Redirect authenticated users to their appropriate dashboard
    switch (user?.role) {
      case USER_ROLES.CUSTOMER:
        return <Navigate to="/customer/dashboard" replace />;
      case USER_ROLES.RM:
        return <Navigate to="/rm/dashboard" replace />;
      case USER_ROLES.SUPERUSER:
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
}

// Default Route Component
function DefaultRoute() {
  const { isAuthenticated, user } = useAuth();

  console.log('🏠 DefaultRoute - Auth state:', { isAuthenticated, user: user?.email, role: user?.role });

  if (!isAuthenticated) {
    console.log('🏠 Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Redirect authenticated users to their appropriate dashboard
  switch (user?.role) {
    case USER_ROLES.CUSTOMER:
      console.log('🏠 Redirecting customer to dashboard');
      return <Navigate to="/customer/dashboard" replace />;
    case USER_ROLES.RM:
      console.log('🏠 Redirecting RM to dashboard');
      return <Navigate to="/rm/dashboard" replace />;
    case USER_ROLES.SUPERUSER:
      console.log('🏠 Redirecting admin to dashboard');
      return <Navigate to="/admin/dashboard" replace />;
    default:
      console.log('🏠 Unknown role, redirecting to login');
      return <Navigate to="/login" replace />;
  }
}

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/mfa-verify" element={<MFAVerify />} />

      {/* Dashboard Routes */}
      <Route path="/customer/dashboard" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/rm/dashboard" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.RM]}>
          <RMDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.SUPERUSER]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* RM Review Route */}
      <Route path="/rm/review/:applicationId" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.RM, USER_ROLES.SUPERUSER]}>
          <RMReview />
        </ProtectedRoute>
      } />

      {/* Application View Route */}
      <Route path="/application/:applicationId" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER, USER_ROLES.RM, USER_ROLES.SUPERUSER]}>
          <ApplicationView />
        </ProtectedRoute>
      } />

      {/* Application Flow Routes - Direct routing without nested ApplicationFlow */}
      <Route path="/new-application" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
          <Layout>
            <ProductSelectionEnhanced />
            <AIAssistant currentStep="business-info" />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/business-info" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
          <Layout>
            <ProductSelectionEnhanced />
            <AIAssistant currentStep="business-info" />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/applicant-type" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
          <Layout>
            <ApplicantTypeSelectionEnhanced />
            <AIAssistant currentStep="applicant-type" />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/customer-details" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
          <Layout>
            <CustomerDetailsAI />
            <AIAssistant currentStep="customer-details" />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/application-details" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
          <Layout>
            <ApplicationDetailsEnhanced />
            <AIAssistant currentStep="application-details" />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/document-upload" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
          <Layout>
            <DocumentUploadSimplified />
            <AIAssistant currentStep="document-upload" />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/multi-party-verification" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
          <Layout>
            <MultiPartyVerificationWrapper />
            <AIAssistant currentStep="multi-party-verification" />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/review-decision" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
          <Layout>
            <ReviewDecision />
            <AIAssistant currentStep="review-decision" />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/credit-agreement" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
          <Layout>
            <CreditAgreement />
            <AIAssistant currentStep="credit-agreement" />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/completion" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
          <Layout>
            <Completion />
            <AIAssistant currentStep="completion" />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Default Route */}
      <Route path="/" element={<DefaultRoute />} />
      
      {/* 404 Route */}
      <Route path="*" element={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-8">Page not found</p>
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <Router>
          <AppContent />
        </Router>
      </ApplicationProvider>
    </AuthProvider>
  );
}

export default App;
