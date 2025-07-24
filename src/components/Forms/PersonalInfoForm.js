import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

function PersonalInfoForm({ applicantType, personalInfo, updatePersonalInfo, errors }) {
  
  // Sole Trader Functions
  const updateOwnerInfo = (field, value) => {
    const currentOwner = personalInfo.owners?.[0] || {};
    updatePersonalInfo({
      owners: [{ ...currentOwner, [field]: value }]
    });
  };

  // Partnership Functions
  const addPartner = () => {
    const currentPartners = personalInfo.partners || [];
    updatePersonalInfo({
      partners: [...currentPartners, { fullName: '', dateOfBirth: '', ppsn: '', address: '', email: '' }]
    });
  };

  const updatePartner = (index, field, value) => {
    const currentPartners = [...(personalInfo.partners || [])];
    currentPartners[index] = { ...currentPartners[index], [field]: value };
    updatePersonalInfo({ partners: currentPartners });
  };

  const removePartner = (index) => {
    const currentPartners = personalInfo.partners || [];
    const updatedPartners = currentPartners.filter((_, i) => i !== index);
    updatePersonalInfo({ partners: updatedPartners });
  };

  // Beneficial Owner Functions
  const addBeneficialOwner = () => {
    const currentOwners = personalInfo.beneficialOwners || [];
    updatePersonalInfo({
      beneficialOwners: [...currentOwners, { 
        fullName: '', 
        dateOfBirth: '', 
        sharePercentage: '', 
        address: '',
        nationality: '',
        occupation: '',
        email: ''
      }]
    });
  };

  const updateBeneficialOwner = (index, field, value) => {
    const currentOwners = [...(personalInfo.beneficialOwners || [])];
    currentOwners[index] = { ...currentOwners[index], [field]: value };
    updatePersonalInfo({ beneficialOwners: currentOwners });
  };

  const removeBeneficialOwner = (index) => {
    const currentOwners = personalInfo.beneficialOwners || [];
    const updatedOwners = currentOwners.filter((_, i) => i !== index);
    updatePersonalInfo({ beneficialOwners: updatedOwners });
  };

  return (
    <div className="space-y-6">
      {/* Sole Trader */}
      {applicantType === 'sole-trader' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Owner Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ownerFullName" className="label-text">
                Full Name *
              </label>
              <input
                type="text"
                id="ownerFullName"
                value={personalInfo.owners?.[0]?.fullName || ''}
                onChange={(e) => updateOwnerInfo('fullName', e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
              />
              {errors.ownerName && (
                <p className="error-text">{errors.ownerName}</p>
              )}
            </div>

            <div>
              <label htmlFor="ownerDob" className="label-text">
                Date of Birth *
              </label>
              <input
                type="date"
                id="ownerDob"
                value={personalInfo.owners?.[0]?.dateOfBirth || ''}
                onChange={(e) => updateOwnerInfo('dateOfBirth', e.target.value)}
                className="input-field"
              />
              {errors.ownerDob && (
                <p className="error-text">{errors.ownerDob}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="ownerAddress" className="label-text">
              Residential Address *
            </label>
            <textarea
              id="ownerAddress"
              rows={3}
              value={personalInfo.owners?.[0]?.address || ''}
              onChange={(e) => updateOwnerInfo('address', e.target.value)}
              className="input-field"
              placeholder="Enter your residential address"
            />
            {errors.ownerAddress && (
              <p className="error-text">{errors.ownerAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ownerPpsn" className="label-text">
                PPSN *
              </label>
              <input
                type="text"
                id="ownerPpsn"
                value={personalInfo.owners?.[0]?.ppsn || ''}
                onChange={(e) => updateOwnerInfo('ppsn', e.target.value)}
                className="input-field"
                placeholder="1234567T"
              />
              {errors.ownerPpsn && (
                <p className="error-text">{errors.ownerPpsn}</p>
              )}
            </div>

            <div>
              <label htmlFor="ownerNationality" className="label-text">
                Nationality
              </label>
              <input
                type="text"
                id="ownerNationality"
                value={personalInfo.owners?.[0]?.nationality || ''}
                onChange={(e) => updateOwnerInfo('nationality', e.target.value)}
                className="input-field"
                placeholder="Irish"
              />
            </div>
          </div>
        </div>
      )}

      {/* Partnership */}
      {applicantType === 'partnership' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Partners Information</h3>
            <button
              type="button"
              onClick={addPartner}
              className="btn-outline text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Partner
            </button>
          </div>

          {errors.partners && (
            <p className="error-text">{errors.partners}</p>
          )}

          {personalInfo.partners?.map((partner, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-800">
                  Partner {index + 1}
                </h4>
                {personalInfo.partners.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePartner(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={`partner${index}Name`} className="label-text">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id={`partner${index}Name`}
                    value={partner.fullName || ''}
                    onChange={(e) => updatePartner(index, 'fullName', e.target.value)}
                    className="input-field"
                    placeholder="Enter partner's full name"
                  />
                  {errors[`partner${index}Name`] && (
                    <p className="error-text">{errors[`partner${index}Name`]}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`partner${index}Dob`} className="label-text">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id={`partner${index}Dob`}
                    value={partner.dateOfBirth || ''}
                    onChange={(e) => updatePartner(index, 'dateOfBirth', e.target.value)}
                    className="input-field"
                  />
                  {errors[`partner${index}Dob`] && (
                    <p className="error-text">{errors[`partner${index}Dob`]}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`partner${index}Ppsn`} className="label-text">
                    PPSN *
                  </label>
                  <input
                    type="text"
                    id={`partner${index}Ppsn`}
                    value={partner.ppsn || ''}
                    onChange={(e) => updatePartner(index, 'ppsn', e.target.value)}
                    className="input-field"
                    placeholder="1234567T"
                  />
                  {errors[`partner${index}Ppsn`] && (
                    <p className="error-text">{errors[`partner${index}Ppsn`]}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`partner${index}Email`} className="label-text">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id={`partner${index}Email`}
                    value={partner.email || ''}
                    onChange={(e) => updatePartner(index, 'email', e.target.value)}
                    className="input-field"
                    placeholder="partner@example.com"
                  />
                  {errors[`partner${index}Email`] && (
                    <p className="error-text">{errors[`partner${index}Email`]}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor={`partner${index}Address`} className="label-text">
                  Residential Address
                </label>
                <textarea
                  id={`partner${index}Address`}
                  rows={3}
                  value={partner.address || ''}
                  onChange={(e) => updatePartner(index, 'address', e.target.value)}
                  className="input-field"
                  placeholder="Enter partner's residential address"
                />
              </div>
            </div>
          )) || (
            <div className="text-center py-4">
              <p className="text-gray-500">No partners added yet. Click "Add Partner" to start.</p>
            </div>
          )}
        </div>
      )}

      {/* Limited Company - Beneficial Owners */}
      {applicantType === 'limited-company' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Beneficial Owners</h3>
              <p className="text-sm text-gray-600">
                Individuals who own 25% or more of the company shares or have control
              </p>
            </div>
            <button
              type="button"
              onClick={addBeneficialOwner}
              className="btn-outline text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Owner
            </button>
          </div>

          {errors.beneficialOwners && (
            <p className="error-text">{errors.beneficialOwners}</p>
          )}

          {personalInfo.beneficialOwners?.map((owner, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-800">
                  Beneficial Owner {index + 1}
                </h4>
                {personalInfo.beneficialOwners.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBeneficialOwner(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={`owner${index}Name`} className="label-text">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id={`owner${index}Name`}
                    value={owner.fullName || ''}
                    onChange={(e) => updateBeneficialOwner(index, 'fullName', e.target.value)}
                    className="input-field"
                    placeholder="Enter full name"
                  />
                  {errors[`owner${index}Name`] && (
                    <p className="error-text">{errors[`owner${index}Name`]}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`owner${index}Dob`} className="label-text">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id={`owner${index}Dob`}
                    value={owner.dateOfBirth || ''}
                    onChange={(e) => updateBeneficialOwner(index, 'dateOfBirth', e.target.value)}
                    className="input-field"
                  />
                  {errors[`owner${index}Dob`] && (
                    <p className="error-text">{errors[`owner${index}Dob`]}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`owner${index}Share`} className="label-text">
                    Share Percentage (%) *
                  </label>
                  <input
                    type="number"
                    id={`owner${index}Share`}
                    value={owner.sharePercentage || ''}
                    onChange={(e) => updateBeneficialOwner(index, 'sharePercentage', e.target.value)}
                    className="input-field"
                    placeholder="25"
                    min="0"
                    max="100"
                  />
                  {errors[`owner${index}Share`] && (
                    <p className="error-text">{errors[`owner${index}Share`]}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`owner${index}Nationality`} className="label-text">
                    Nationality
                  </label>
                  <input
                    type="text"
                    id={`owner${index}Nationality`}
                    value={owner.nationality || ''}
                    onChange={(e) => updateBeneficialOwner(index, 'nationality', e.target.value)}
                    className="input-field"
                    placeholder="Irish"
                  />
                </div>

                <div>
                  <label htmlFor={`owner${index}Occupation`} className="label-text">
                    Occupation
                  </label>
                  <input
                    type="text"
                    id={`owner${index}Occupation`}
                    value={owner.occupation || ''}
                    onChange={(e) => updateBeneficialOwner(index, 'occupation', e.target.value)}
                    className="input-field"
                    placeholder="Managing Director"
                  />
                </div>

                <div>
                  <label htmlFor={`owner${index}Email`} className="label-text">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id={`owner${index}Email`}
                    value={owner.email || ''}
                    onChange={(e) => updateBeneficialOwner(index, 'email', e.target.value)}
                    className="input-field"
                    placeholder="director@company.com"
                  />
                  {errors[`owner${index}Email`] && (
                    <p className="error-text">{errors[`owner${index}Email`]}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor={`owner${index}Address`} className="label-text">
                  Residential Address
                </label>
                <textarea
                  id={`owner${index}Address`}
                  rows={3}
                  value={owner.address || ''}
                  onChange={(e) => updateBeneficialOwner(index, 'address', e.target.value)}
                  className="input-field"
                  placeholder="Enter residential address"
                />
              </div>
            </div>
          )) || (
            <div className="text-center py-4">
              <p className="text-gray-500">No beneficial owners added yet. Click "Add Owner" to start.</p>
            </div>
          )}

          {/* Share Percentage Total */}
          {personalInfo.beneficialOwners && personalInfo.beneficialOwners.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  Total Share Percentage:
                </span>
                <span className="text-sm font-bold text-blue-800">
                  {personalInfo.beneficialOwners.reduce((total, owner) => 
                    total + (parseFloat(owner.sharePercentage) || 0), 0
                  )}%
                </span>
              </div>
              {personalInfo.beneficialOwners.reduce((total, owner) => 
                total + (parseFloat(owner.sharePercentage) || 0), 0
              ) !== 100 && (
                <p className="text-xs text-blue-700 mt-1">
                  Note: Total should equal 100% for complete ownership structure
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Other Organization */}
      {applicantType === 'other-organization' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Authorized Representatives</h3>
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="text-sm text-amber-700">
              Please add the authorized representatives who can act on behalf of the organization. 
              At least one representative must be designated for this application.
            </p>
          </div>
          
          <div className="text-center py-8">
            <p className="text-gray-500">
              Representative management will be implemented based on organization type.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonalInfoForm;
