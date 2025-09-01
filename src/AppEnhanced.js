import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { useAppStore } from './store/appStore';

// Layout Components
import Header from './components/Layout/Header';

// Demo Controls
import DemoControls from './components/DemoControls';

// New Enhanced Components
import Home from './components/pages/Home';
import EntitySelect from './components/pages/EntitySelect';
import Demographics from './components/pages/Demographics';
import ProductSuitability from './components/pages/ProductSuitability';
import QuoteBuilder from './components/pages/QuoteBuilder';
import ApplicationSummary from './components/pages/ApplicationSummary';
import Decision from './components/pages/Decision';
import Documents from './components/pages/Documents';
import DirectorApproval from './components/pages/DirectorApproval';
import DirectorNotification from './components/pages/DirectorNotification';
import StaffDashboard from './components/pages/StaffDashboard';
import EmailNotifications from './components/pages/EmailNotifications';
import ApplicationUnderReview from './components/pages/ApplicationUnderReview';

// Placeholder components for remaining pages (will be created)
const QuoteSaved = () => <div className="p-8"><h1 className="text-2xl font-bold">Quote Saved - Coming Soon</h1></div>;
const RTLCustomer = () => <div className="p-8"><h1 className="text-2xl font-bold">RTL Customer - Coming Soon</h1></div>;
const RTLStaff = () => <div className="p-8"><h1 className="text-2xl font-bold">RTL Staff - Coming Soon</h1></div>;
const Signing = () => <div className="p-8"><h1 className="text-2xl font-bold">Signing - Coming Soon</h1></div>;
const StatusTracker = () => <div className="p-8"><h1 className="text-2xl font-bold">Status Tracker - Coming Soon</h1></div>;
const Day2 = () => <div className="p-8"><h1 className="text-2xl font-bold">Day 2 Operations - Coming Soon</h1></div>;
const Day2Change = () => <div className="p-8"><h1 className="text-2xl font-bold">Day 2 Change - Coming Soon</h1></div>;
const Day2Restructure = () => <div className="p-8"><h1 className="text-2xl font-bold">Day 2 Restructure - Coming Soon</h1></div>;

// Route Guards
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const { demoMode } = useAppStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Home - Role & Entity Selection, Resume by Reference */}
            <Route path="/" element={<Home />} />
            
            {/* Entity Selection */}
            <Route path="/entity" element={
              <ProtectedRoute>
                <EntitySelect />
              </ProtectedRoute>
            } />
            
            {/* Demographics Review + CRO Validate */}
            <Route path="/demographics" element={
              <ProtectedRoute>
                <Demographics />
              </ProtectedRoute>
            } />
            
            {/* Product Suitability */}
            <Route path="/suitability" element={
              <ProtectedRoute>
                <ProductSuitability />
              </ProtectedRoute>
            } />
            
            {/* Quote Builder + Cart */}
            <Route path="/quote" element={
              <ProtectedRoute>
                <QuoteBuilder />
              </ProtectedRoute>
            } />
            
            {/* Quote Saved - Reference Display */}
            <Route path="/quote/saved" element={
              <ProtectedRoute>
                <QuoteSaved />
              </ProtectedRoute>
            } />
            
            {/* Application Summary + Checklist */}
            <Route path="/application" element={
              <ProtectedRoute>
                <ApplicationSummary />
              </ProtectedRoute>
            } />
            
            {/* Decision Result or RTL State */}
            <Route path="/decision" element={
              <ProtectedRoute>
                <Decision />
              </ProtectedRoute>
            } />
            
            {/* Customer RTL Panel */}
            <Route path="/rtl" element={
              <ProtectedRoute allowedRoles={['DIRECTOR', 'PREPARER']}>
                <RTLCustomer />
              </ProtectedRoute>
            } />
            
            {/* Staff RTL Console */}
            <Route path="/staff/rtl" element={
              <ProtectedRoute allowedRoles={['FLU']}>
                <RTLStaff />
              </ProtectedRoute>
            } />
            
            {/* Documents List + Viewer */}
            <Route path="/documents" element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            } />
            
            {/* Signing Stepper */}
            <Route path="/sign" element={
              <ProtectedRoute allowedRoles={['DIRECTOR']}>
                <Signing />
              </ProtectedRoute>
            } />
            
            {/* Status Tracker */}
            <Route path="/status" element={
              <ProtectedRoute>
                <StatusTracker />
              </ProtectedRoute>
            } />
            
            {/* Day-2 Operations */}
            <Route path="/day2" element={
              <ProtectedRoute>
                <Day2 />
              </ProtectedRoute>
            } />
            
            {/* Change Repayment Date */}
            <Route path="/day2/change" element={
              <ProtectedRoute allowedRoles={['DIRECTOR']}>
                <Day2Change />
              </ProtectedRoute>
            } />
            
            {/* Restructure - Seeded Quote */}
            <Route path="/day2/restructure" element={
              <ProtectedRoute>
                <Day2Restructure />
              </ProtectedRoute>
            } />
            
            {/* Director Approval Portal */}
            <Route path="/director/approvals" element={
              <ProtectedRoute allowedRoles={['DIRECTOR']}>
                <DirectorApproval />
              </ProtectedRoute>
            } />
            
            <Route path="/director/dashboard" element={
              <ProtectedRoute allowedRoles={['DIRECTOR']}>
                <DirectorApproval />
              </ProtectedRoute>
            } />
            
            {/* Staff Dashboard */}
            <Route path="/staff/dashboard" element={
              <ProtectedRoute allowedRoles={['STAFF', 'PREPARER']}>
                <StaffDashboard />
              </ProtectedRoute>
            } />
            
            {/* Director Notification Process */}
            <Route path="/director-notification" element={
              <ProtectedRoute>
                <DirectorNotification />
              </ProtectedRoute>
            } />
            
            {/* Email Notifications */}
            <Route path="/email-notifications" element={
              <ProtectedRoute>
                <EmailNotifications />
              </ProtectedRoute>
            } />
            
            {/* Application Under Review */}
            <Route path="/application-under-review" element={
              <ProtectedRoute allowedRoles={['STAFF', 'PREPARER']}>
                <ApplicationUnderReview />
              </ProtectedRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Demo Controls - Show when in demo mode */}
        {demoMode && <DemoControls />}
      </div>
    </Router>
  );
}

export default App;
