import React, { useState, useEffect } from 'react';
import { 
  PencilSquareIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';

function MultiPartySignature({ 
  applicantType, 
  personalInfo, 
  agreementText, 
  onAllPartiesSigned, 
  onBack 
}) {
  const [signatures, setSignatures] = useState({});
  const [currentSigningParty, setCurrentSigningParty] = useState(null);
  const [signatureData, setSignatureData] = useState('');
  const [hasReadAgreement, setHasReadAgreement] = useState({});
  const [agreementAccepted, setAgreementAccepted] = useState({});
  const [isSigning, setIsSigning] = useState(false);
  const [errors, setErrors] = useState({});

  // Get list of parties that need to sign
  const getSigningParties = () => {
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
      // Add directors who need to sign
      personalInfo.beneficialOwners?.forEach((owner, index) => {
        if (owner.isDirector) {
          parties.push({
            id: `director-${index}`,
            type: 'director',
            name: owner.fullName || `Director ${index + 1}`,
            email: owner.email || '',
            role: 'Director',
            required: true
          });
        }
      });
    } else if (applicantType === 'sole-trader') {
      // For sole traders, just the owner signs
      parties.push({
        id: 'owner-0',
        type: 'owner',
        name: personalInfo.owners?.[0]?.fullName || 'Business Owner',
        email: personalInfo.owners?.[0]?.email || '',
        role: 'Business Owner',
        required: true
      });
    }
    
    return parties;
  };

  const signingParties = getSigningParties();

  const handleScrollToBottom = (partyId) => {
    const agreementElement = document.getElementById(`agreement-text-${partyId}`);
    if (agreementElement) {
      const isAtBottom = agreementElement.scrollTop + agreementElement.clientHeight >= agreementElement.scrollHeight - 10;
      if (isAtBottom && !hasReadAgreement[partyId]) {
        setHasReadAgreement(prev => ({ ...prev, [partyId]: true }));
      }
    }
  };

  const validateSignature = (partyId) => {
    const newErrors = {};
    
    if (!hasReadAgreement[partyId]) {
      newErrors[`${partyId}-agreement`] = 'Party must read the complete agreement';
    }
    
    if (!agreementAccepted[partyId]) {
      newErrors[`${partyId}-acceptance`] = 'Party must accept the agreement terms';
    }
    
    if (!signatureData.trim()) {
      newErrors[`${partyId}-signature`] = 'Electronic signature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSign = async (partyId) => {
    if (!validateSignature(partyId)) {
      return;
    }

    setIsSigning(true);
    
    // Simulate signing process
    setTimeout(() => {
      const signatureInfo = {
        signed: true,
        signatureData: signatureData,
        signedDate: new Date().toISOString(),
        partyId: partyId,
        ipAddress: '192.168.1.1', // Would be real IP in production
        timestamp: new Date().toISOString()
      };
      
      setSignatures(prev => ({
        ...prev,
        [partyId]: signatureInfo
      }));
      
      setCurrentSigningParty(null);
      setSignatureData('');
      setIsSigning(false);
      
      // Clear errors for this party
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${partyId}-agreement`];
        delete newErrors[`${partyId}-acceptance`];
        delete newErrors[`${partyId}-signature`];
        return newErrors;
      });
    }, 2000);
  };

  const getSignatureStats = () => {
    const total = signingParties.length;
    const signed = Object.keys(signatures).length;
    return { total, signed, pending: total - signed };
  };

  const stats = getSignatureStats();
  const allSigned = stats.signed === stats.total && stats.total > 0;

  useEffect(() => {
    if (allSigned) {
      // All parties have signed, prepare final signature data
      const finalSignatureData = {
        allPartiesSigned: true,
        signatures: signatures,
        signedDate: new Date().toISOString(),
        documentId: `AGR-MULTI-${Date.now()}`,
        parties: signingParties.map(party => ({
          ...party,
          signature: signatures[party.id]
        }))
      };
      
      onAllPartiesSigned(finalSignatureData);
    }
  }, [allSigned, signatures, signingParties, onAllPartiesSigned]);

  const startSigning = (partyId) => {
    setCurrentSigningParty(partyId);
    setSignatureData('');
    setErrors({});
  };

  const cancelSigning = () => {
    setCurrentSigningParty(null);
    setSignatureData('');
    setErrors({});
  };

  if (currentSigningParty) {
    const party = signingParties.find(p => p.id === currentSigningParty);
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <PencilSquareIcon className="h-8 w-8 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Electronic Signature Required
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {party?.name} ({party?.role}) must review and sign the credit agreement.
          </p>
        </div>

        {/* Agreement Document for Current Party */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <DocumentTextIcon className="h-6 w-6 mr-2" />
              Credit Agreement Document
            </h2>
            <div className="text-sm text-gray-500">
              Signing as: {party?.role}
            </div>
          </div>
          
          {/* Agreement Text */}
          <div 
            id={`agreement-text-${currentSigningParty}`}
            className="bg-gray-50 border rounded-lg p-6 h-96 overflow-y-auto text-sm"
            onScroll={() => handleScrollToBottom(currentSigningParty)}
          >
            <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
              {agreementText}
            </pre>
          </div>
          
          {/* Reading Status */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              {hasReadAgreement[currentSigningParty] ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-2" />
              )}
              <span className={`text-sm ${hasReadAgreement[currentSigningParty] ? 'text-green-600' : 'text-gray-500'}`}>
                {hasReadAgreement[currentSigningParty] ? 'Agreement read completely' : 'Please scroll to read the complete agreement'}
              </span>
            </div>
          </div>
          
          {errors[`${currentSigningParty}-agreement`] && (
            <p className="error-text mt-2">{errors[`${currentSigningParty}-agreement`]}</p>
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
                id={`agreementAccepted-${currentSigningParty}`}
                checked={agreementAccepted[currentSigningParty] || false}
                onChange={(e) => {
                  setAgreementAccepted(prev => ({
                    ...prev,
                    [currentSigningParty]: e.target.checked
                  }));
                  if (errors[`${currentSigningParty}-acceptance`]) {
                    setErrors(prev => ({ ...prev, [`${currentSigningParty}-acceptance`]: undefined }));
                  }
                }}
                disabled={!hasReadAgreement[currentSigningParty]}
                className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50"
              />
              <label htmlFor={`agreementAccepted-${currentSigningParty}`} className={`text-sm ${!hasReadAgreement[currentSigningParty] ? 'text-gray-400' : 'text-gray-700'}`}>
                I, {party?.name}, have read, understood, and agree to all terms and conditions of this Credit Agreement 
                in my capacity as {party?.role}. I acknowledge that this agreement is legally binding and enforceable.
              </label>
            </div>
            {errors[`${currentSigningParty}-acceptance`] && (
              <p className="error-text ml-7">{errors[`${currentSigningParty}-acceptance`]}</p>
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
                  if (errors[`${currentSigningParty}-signature`]) {
                    setErrors(prev => ({ ...prev, [`${currentSigningParty}-signature`]: undefined }));
                  }
                }}
                disabled={!agreementAccepted[currentSigningParty]}
                className="input-field font-cursive text-lg"
                placeholder={party?.name || "Type your full legal name"}
              />
              {errors[`${currentSigningParty}-signature`] && (
                <p className="error-text">{errors[`${currentSigningParty}-signature`]}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                By typing your name, you are providing a legally binding electronic signature as {party?.role}
              </p>
            </div>
            
            {signatureData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Signature Preview:</h4>
                <div className="font-cursive text-xl text-gray-900 border-b-2 border-gray-300 pb-2 inline-block min-w-48">
                  {signatureData}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Signing as: {party?.role}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={cancelSigning}
            disabled={isSigning}
            className="btn-secondary px-6 py-3"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSign(currentSigningParty)}
            disabled={!hasReadAgreement[currentSigningParty] || !agreementAccepted[currentSigningParty] || !signatureData.trim() || isSigning}
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
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Multi-Party Signature Required
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          All {applicantType === 'partnership' ? 'partners' : 'authorized parties'} must 
          provide their electronic signature to make this credit agreement legally binding.
        </p>
      </div>

      {/* Signature Progress */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-blue-800">
            Signature Progress
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-800">
              {stats.signed}/{stats.total}
            </div>
            <div className="text-sm text-blue-600">Signed</div>
          </div>
        </div>
        
        <div className="w-full bg-blue-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.total > 0 ? (stats.signed / stats.total) * 100 : 0}%` }}
          />
        </div>
        
        <div className="mt-2 text-sm text-blue-700">
          {stats.pending > 0 ? (
            `${stats.pending} signature${stats.pending !== 1 ? 's' : ''} pending`
          ) : (
            'All parties have signed the agreement'
          )}
        </div>
      </div>

      {/* Signing Parties List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Required Signatures
        </h2>
        
        <div className="space-y-4">
          {signingParties.map((party) => {
            const signature = signatures[party.id];
            const isSigned = !!signature;
            
            return (
              <div key={party.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isSigned ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {isSigned ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        ) : (
                          <UserIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {party.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {party.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isSigned 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isSigned ? 'Signed' : 'Pending'}
                    </span>
                    
                    {/* Sign Button */}
                    {!isSigned && (
                      <button
                        onClick={() => startSigning(party.id)}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Sign Now
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Signature Details */}
                {signature && (
                  <div className="mt-3 bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-cursive text-lg text-gray-900">
                          {signature.signatureData}
                        </div>
                        <div className="text-xs text-gray-500">
                          Signed: {new Date(signature.signedDate).toLocaleString('en-IE')}
                        </div>
                      </div>
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="btn-secondary px-6 py-3"
        >
          Back
        </button>
        <button
          disabled={!allSigned}
          className="btn-primary px-8 py-3"
        >
          {allSigned ? 'Agreement Complete' : 'Waiting for All Signatures'}
        </button>
      </div>

      {/* Legal Notice */}
      <div className="bg-amber-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-amber-800 mb-2">
          Multi-Party Signature Requirements
        </h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• All parties must sign individually and in their respective capacity</li>
          <li>• Electronic signatures are legally binding under eIDAS regulation</li>
          <li>• Each signature is timestamped and includes identity verification</li>
          <li>• All parties are jointly and severally liable under this agreement</li>
          <li>• The agreement becomes effective only when all parties have signed</li>
        </ul>
      </div>
    </div>
  );
}

export default MultiPartySignature;
