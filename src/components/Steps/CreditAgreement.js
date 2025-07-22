import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication, applicationActions } from '../../context/ApplicationContext';
import MultiPartySignature from './MultiPartySignature';
import { 
  DocumentTextIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const sampleCreditAgreement = `
CREDIT AGREEMENT

This Credit Agreement ("Agreement") is entered into between SME Banking Solutions ("Bank") and the Applicant(s) as detailed in the application.

TERMS AND CONDITIONS

1. CREDIT FACILITY
Subject to the terms and conditions set forth herein, the Bank agrees to provide credit facilities as approved in your application.

2. INTEREST RATES AND CHARGES
- Interest will be charged at the rates specified in your approval letter
- All fees and charges are detailed in the fee schedule
- Interest is calculated daily and charged monthly

3. REPAYMENT TERMS
- Repayments are due as per the schedule provided
- Late payment charges apply as per our standard terms
- Early repayment is permitted without penalty

4. SECURITY
Any security requirements are as detailed in your approval documentation.

5. REPRESENTATIONS AND WARRANTIES
The Borrower represents and warrants that all information provided is accurate and complete.

6. DEFAULT
Events of default include failure to make payments when due, breach of any terms, or insolvency.

7. GOVERNING LAW
This Agreement is governed by Irish law and subject to the jurisdiction of Irish courts.

8. DATA PROTECTION
Your personal data will be processed in accordance with our Privacy Policy and GDPR requirements.

9. COMPLAINTS PROCEDURE
If you have any complaints, please contact our Customer Service team or the Financial Services and Pensions Ombudsman.

10. COOLING-OFF PERIOD
You have 14 days from signing this agreement to withdraw without penalty.

By signing below, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions of this Credit Agreement.

This agreement complies with the Consumer Credit Act 1995, Central Bank regulations, and EU consumer credit directives.
`;

function CreditAgreement() {
  const navigate = useNavigate();
  const { state, dispatch } = useApplication();
  const [hasReadAgreement, setHasReadAgreement] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if multi-party signature is required
  const requiresMultiPartySignature = state.applicantType === 'partnership' || state.applicantType === 'limited-company';

  useEffect(() => {
    // Redirect if not approved
    if (!state.decisionOutcome || state.decisionOutcome.type !== 'approved') {
      navigate('/review-decision');
    }
  }, [state.decisionOutcome, navigate]);

  const handleScrollToBottom = () => {
    const agreementElement = document.getElementById('agreement-text');
    if (agreementElement) {
      const isAtBottom = agreementElement.scrollTop + agreementElement.clientHeight >= agreementElement.scrollHeight - 10;
      if (isAtBottom && !hasReadAgreement) {
        setHasReadAgreement(true);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!hasReadAgreement) {
      newErrors.agreement = 'Please read the complete agreement by scrolling to the bottom';
    }
    
    if (!agreementAccepted) {
      newErrors.acceptance = 'You must accept the agreement terms to continue';
    }
    
    if (!signatureData.trim()) {
      newErrors.signature = 'Electronic signature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSign = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSigning(true);
    
    // Simulate DocuSign or similar e-signature process
    setTimeout(() => {
      const agreementData = {
        signed: true,
        agreementText: sampleCreditAgreement,
        signatureData: signatureData,
        signedDate: new Date().toISOString(),
        documentId: `AGR-${Date.now()}`,
        ipAddress: '192.168.1.1', // Would be real IP in production
        timestamp: new Date().toISOString(),
        singleParty: true
      };
      
      dispatch(applicationActions.updateCreditAgreement(agreementData));
      setSigned(true);
      setIsSigning(false);
    }, 2000);
  };

  const handleMultiPartySignComplete = (multiPartySignatureData) => {
    dispatch(applicationActions.updateCreditAgreement({
      signed: true,
      agreementText: sampleCreditAgreement,
      multiPartySignature: true,
      signatureData: multiPartySignatureData,
      signedDate: multiPartySignatureData.signedDate,
      documentId: multiPartySignatureData.documentId,
      timestamp: new Date().toISOString()
    }));
    setSigned(true);
  };

  const handleContinue = () => {
    navigate('/completion');
  };

  const handleDownloadAgreement = () => {
    // In real implementation, this would download the signed PDF
    const element = document.createElement('a');
    const file = new Blob([sampleCreditAgreement], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `credit-agreement-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Show multi-party signature workflow if required and not yet signed
  if (requiresMultiPartySignature && !signed) {
    return (
      <MultiPartySignature
        applicantType={state.applicantType}
        personalInfo={state.personalInfo}
        agreementText={sampleCreditAgreement}
        onAllPartiesSigned={handleMultiPartySignComplete}
        onBack={() => navigate('/review-decision')}
      />
    );
  }

  if (signed) {
    const isMultiParty = state.creditAgreement?.multiPartySignature;
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-green-800 sm:text-4xl mb-4">
            Agreement Signed Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            {isMultiParty 
              ? 'All parties have electronically signed the credit agreement and it is now legally binding.'
              : 'Your credit agreement has been electronically signed and is now legally binding.'
            }
          </p>
          
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            You will receive a copy via email, and funds will be disbursed according to the agreed terms.
          </p>
        </div>

        {/* Signed Agreement Details */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Agreement Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Document ID:</span>
              <div className="font-mono text-gray-900">
                {isMultiParty 
                  ? state.creditAgreement.signatureData.documentId 
                  : state.creditAgreement.documentId}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Signed Date:</span>
              <div className="font-medium text-gray-900">
                {new Date(state.creditAgreement.signedDate).toLocaleDateString('en-IE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Signature Type:</span>
              <div className="font-medium text-gray-900">
                {isMultiParty ? 'Multi-Party Electronic Signature' : 'Single Party Electronic Signature'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">Legally Binding</span>
              </div>
            </div>
          </div>

          {/* Multi-party signature details */}
          {isMultiParty && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Signatory Details</h3>
              <div className="space-y-3">
                {state.creditAgreement.signatureData.parties?.map((party, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{party.name}</div>
                        <div className="text-sm text-gray-600">{party.role}</div>
                        <div className="font-cursive text-lg text-gray-800 mt-1">
                          {party.signature?.signatureData}
                        </div>
                      </div>
                      <div className="text-right">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mb-1" />
                        <div className="text-xs text-gray-500">
                          {new Date(party.signature?.signedDate).toLocaleDateString('en-IE')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Single party signature details */}
          {!isMultiParty && (
            <div className="mt-6">
              <div>
                <span className="text-gray-500">Signature:</span>
                <div className="font-cursive text-lg text-gray-900">{state.creditAgreement.signatureData}</div>
              </div>
            </div>
          )}
        </div>

        {/* Download Agreement */}
        <div className="flex justify-center">
          <button
            onClick={handleDownloadAgreement}
            className="btn-outline flex items-center px-6 py-3"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download Signed Agreement
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="btn-primary px-8 py-3"
          >
            Complete Application
          </button>
        </div>

        {/* Legal Notice */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Important Information
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• This agreement is legally binding and enforceable</li>
            <li>• You have a 14-day cooling-off period from the signing date</li>
            <li>• Electronic signatures are legally equivalent to handwritten signatures under eIDAS regulation</li>
            {isMultiParty && <li>• All parties are jointly and severally liable under this agreement</li>}
            <li>• Keep this document for your records</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Credit Agreement
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Please review the credit agreement terms carefully before signing. 
          This document is legally binding once signed.
        </p>
      </div>

      {/* Agreement Document */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-6 w-6 mr-2" />
            Credit Agreement Document
          </h2>
          <div className="text-sm text-gray-500">
            eIDAS Compliant
          </div>
        </div>
        
        {/* Agreement Text */}
        <div 
          id="agreement-text"
          className="bg-gray-50 border rounded-lg p-6 h-96 overflow-y-auto text-sm"
          onScroll={handleScrollToBottom}
        >
          <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
            {sampleCreditAgreement}
          </pre>
        </div>
        
        {/* Reading Status */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            {hasReadAgreement ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-2" />
            )}
            <span className={`text-sm ${hasReadAgreement ? 'text-green-600' : 'text-gray-500'}`}>
              {hasReadAgreement ? 'Agreement read completely' : 'Please scroll to read the complete agreement'}
            </span>
          </div>
          
          {!hasReadAgreement && (
            <span className="text-xs text-gray-400">
              Scroll to bottom to continue
            </span>
          )}
        </div>
        
        {errors.agreement && (
          <p className="error-text mt-2">{errors.agreement}</p>
        )}
      </div>

      {/* Agreement Acceptance */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Agreement Acceptance
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreementAccepted"
              checked={agreementAccepted}
              onChange={(e) => {
                setAgreementAccepted(e.target.checked);
                if (errors.acceptance) {
                  setErrors(prev => ({ ...prev, acceptance: undefined }));
                }
              }}
              disabled={!hasReadAgreement}
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50"
            />
            <label htmlFor="agreementAccepted" className={`text-sm ${!hasReadAgreement ? 'text-gray-400' : 'text-gray-700'}`}>
              I have read, understood, and agree to all terms and conditions of this Credit Agreement. 
              I acknowledge that this agreement is legally binding and enforceable.
            </label>
          </div>
          {errors.acceptance && (
            <p className="error-text ml-7">{errors.acceptance}</p>
          )}
        </div>
      </div>

      {/* Electronic Signature */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <PencilSquareIcon className="h-6 w-6 mr-2" />
          Electronic Signature
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="signature" className="label-text">
              Type your full name as your electronic signature *
            </label>
            <input
              type="text"
              id="signature"
              value={signatureData}
              onChange={(e) => {
                setSignatureData(e.target.value);
                if (errors.signature) {
                  setErrors(prev => ({ ...prev, signature: undefined }));
                }
              }}
              disabled={!agreementAccepted}
              className="input-field font-cursive text-lg"
              placeholder="Type your full legal name"
            />
            {errors.signature && (
              <p className="error-text">{errors.signature}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              By typing your name, you are providing a legally binding electronic signature
            </p>
          </div>
          
          {signatureData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Signature Preview:</h4>
              <div className="font-cursive text-xl text-gray-900 border-b-2 border-gray-300 pb-2 inline-block min-w-48">
                {signatureData}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/review-decision')}
          disabled={isSigning}
          className="btn-secondary px-6 py-3"
        >
          Back to Review
        </button>
        <button
          onClick={handleSign}
          disabled={!hasReadAgreement || !agreementAccepted || !signatureData.trim() || isSigning}
          className="btn-primary px-8 py-3 flex items-center"
        >
          {isSigning ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing Agreement...
            </>
          ) : (
            'Sign Agreement'
          )}
        </button>
      </div>

      {/* Legal Information */}
      <div className="bg-amber-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-amber-800 mb-2">
          Legal & Compliance Information
        </h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Electronic signatures comply with eIDAS (EU) No 910/2014 regulation</li>
          <li>• This process creates a legally binding agreement equivalent to handwritten signatures</li>
          <li>• Your signature is timestamped and includes IP address verification</li>
          <li>• You can withdraw from this agreement within 14 days (cooling-off period)</li>
        </ul>
      </div>
    </div>
  );
}

export default CreditAgreement;
