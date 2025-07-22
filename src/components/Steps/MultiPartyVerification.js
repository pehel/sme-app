import React, { useState } from 'react';
import { 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

function MultiPartyVerification({ 
  applicantType, 
  personalInfo, 
  onVerificationComplete, 
  onBack 
}) {
  const [verificationStatus, setVerificationStatus] = useState({});
  const [emailsSent, setEmailsSent] = useState(false);
  const [resendingEmails, setResendingEmails] = useState(false);

  // Get list of parties that need verification based on applicant type
  const getRequiredParties = () => {
    const parties = [];
    
    if (applicantType === 'partnership') {
      personalInfo.partners?.forEach((partner, index) => {
        parties.push({
          id: `partner-${index}`,
          type: 'partner',
          name: partner.fullName || `Partner ${index + 1}`,
          email: partner.email || '',
          role: 'Partner',
          required: true
        });
      });
    } else if (applicantType === 'limited-company') {
      // Add directors (beneficial owners with management roles)
      personalInfo.beneficialOwners?.forEach((owner, index) => {
        if (owner.isDirector || owner.sharePercentage >= 25) {
          parties.push({
            id: `director-${index}`,
            type: 'director',
            name: owner.fullName || `Director ${index + 1}`,
            email: owner.email || '',
            role: owner.isDirector ? 'Director' : 'Beneficial Owner',
            required: owner.isDirector || owner.sharePercentage >= 25
          });
        }
      });
    }
    
    return parties;
  };

  const requiredParties = getRequiredParties();

  const sendVerificationEmails = async () => {
    setResendingEmails(true);
    
    // Simulate sending verification emails
    setTimeout(() => {
      setEmailsSent(true);
      setResendingEmails(false);
      
      // Initialize verification status for each party
      const initialStatus = {};
      requiredParties.forEach(party => {
        initialStatus[party.id] = {
          emailSent: true,
          emailSentAt: new Date().toISOString(),
          verified: false,
          verifiedAt: null
        };
      });
      setVerificationStatus(initialStatus);
    }, 2000);
  };

  const simulateVerification = (partyId) => {
    // Simulate a party completing their verification
    setVerificationStatus(prev => ({
      ...prev,
      [partyId]: {
        ...prev[partyId],
        verified: true,
        verifiedAt: new Date().toISOString()
      }
    }));
  };

  const getVerificationStats = () => {
    const total = requiredParties.length;
    const verified = Object.values(verificationStatus).filter(status => status.verified).length;
    return { total, verified, pending: total - verified };
  };

  const stats = getVerificationStats();
  const allVerified = stats.verified === stats.total && stats.total > 0;

  const handleContinue = () => {
    if (allVerified) {
      onVerificationComplete(verificationStatus);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Multi-Party Verification Required
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          For {applicantType === 'partnership' ? 'partnerships' : 'companies'}, all 
          {applicantType === 'partnership' ? ' partners' : ' directors and beneficial owners'} 
          must verify and consent to this credit application before it can proceed to review.
        </p>
      </div>

      {/* Verification Progress */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-blue-800">
            Verification Progress
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-800">
              {stats.verified}/{stats.total}
            </div>
            <div className="text-sm text-blue-600">Verified</div>
          </div>
        </div>
        
        <div className="w-full bg-blue-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.total > 0 ? (stats.verified / stats.total) * 100 : 0}%` }}
          />
        </div>
        
        <div className="mt-2 text-sm text-blue-700">
          {stats.pending > 0 ? (
            `${stats.pending} verification${stats.pending !== 1 ? 's' : ''} pending`
          ) : (
            'All parties have verified their consent'
          )}
        </div>
      </div>

      {/* Required Parties List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Required Parties for Verification
        </h2>
        
        <div className="space-y-4">
          {requiredParties.map((party) => {
            const status = verificationStatus[party.id];
            const isVerified = status?.verified;
            const emailSent = status?.emailSent;
            
            return (
              <div key={party.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isVerified ? 'bg-green-100' : emailSent ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        {isVerified ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        ) : emailSent ? (
                          <ClockIcon className="h-6 w-6 text-yellow-600" />
                        ) : (
                          <ExclamationTriangleIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {party.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {party.role} • {party.email || 'Email not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isVerified 
                        ? 'bg-green-100 text-green-800'
                        : emailSent
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isVerified ? 'Verified' : emailSent ? 'Pending' : 'Not Sent'}
                    </span>
                    
                    {/* Simulate Verification Button (for demo) */}
                    {emailSent && !isVerified && (
                      <button
                        onClick={() => simulateVerification(party.id)}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Simulate Verify
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Verification Details */}
                {status && (
                  <div className="mt-3 text-xs text-gray-500">
                    {status.emailSent && (
                      <div>Email sent: {new Date(status.emailSentAt).toLocaleString('en-IE')}</div>
                    )}
                    {status.verified && (
                      <div>Verified: {new Date(status.verifiedAt).toLocaleString('en-IE')}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Actions */}
      {!emailsSent ? (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Send Verification Requests
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Click below to send verification emails to all required parties. Each party will receive:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 mb-6">
            <li>• A secure link to review the application details</li>
            <li>• Option to provide consent or raise concerns</li>
            <li>• 48-hour deadline to respond</li>
            <li>• Automatic reminders if no response</li>
          </ul>
          
          <button
            onClick={sendVerificationEmails}
            disabled={resendingEmails || requiredParties.length === 0}
            className="btn-primary flex items-center px-6 py-3"
          >
            {resendingEmails ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Emails...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                Send Verification Emails
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Verification Emails Sent
          </h3>
          <div className="flex items-start space-x-3">
            <EnvelopeIcon className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">
                Verification emails have been sent to all required parties. 
                They have 48 hours to respond. You'll be notified once all verifications are complete.
              </p>
            </div>
          </div>
          
          <button
            onClick={sendVerificationEmails}
            disabled={resendingEmails}
            className="btn-outline text-sm mt-4"
          >
            Resend Emails
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="btn-secondary px-6 py-3"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!allVerified}
          className="btn-primary px-8 py-3"
        >
          Continue to Review
        </button>
      </div>

      {/* Legal Notice */}
      <div className="bg-amber-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-amber-800 mb-2">
          Multi-Party Consent Requirements
        </h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• All partners in a partnership must consent to credit applications</li>
          <li>• Company directors and beneficial owners (≥25%) must provide consent</li>
          <li>• Verification includes identity confirmation and application review</li>
          <li>• All parties will be bound by the credit agreement if approved</li>
          <li>• Failure to obtain all consents will result in application rejection</li>
        </ul>
      </div>
    </div>
  );
}

export default MultiPartyVerification;
