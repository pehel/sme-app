import React from 'react';

const industryTypes = [
  'Agriculture, Forestry and Fishing',
  'Mining and Quarrying',
  'Manufacturing',
  'Electricity, Gas, Steam and Air Conditioning',
  'Water Supply, Sewerage, Waste Management',
  'Construction',
  'Wholesale and Retail Trade',
  'Transportation and Storage',
  'Accommodation and Food Service',
  'Information and Communication',
  'Financial and Insurance Activities',
  'Real Estate Activities',
  'Professional, Scientific and Technical',
  'Administrative and Support Services',
  'Public Administration and Defence',
  'Education',
  'Human Health and Social Work',
  'Arts, Entertainment and Recreation',
  'Other Service Activities'
];

const employeeRanges = [
  '1',
  '2-5',
  '6-10',
  '11-25',
  '26-50',
  '51-100',
  '101-250',
  '250+'
];

function BusinessInfoForm({ applicantType, businessInfo, updateBusinessInfo, errors }) {
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateBusinessInfo({
        [parent]: {
          ...businessInfo[parent],
          [child]: value
        }
      });
    } else {
      updateBusinessInfo({ [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      {/* Business Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="businessName" className="label-text">
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            value={businessInfo.businessName || ''}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            className="input-field"
            placeholder="Enter your business name"
          />
          {errors.businessName && (
            <p className="error-text">{errors.businessName}</p>
          )}
        </div>

        <div>
          <label htmlFor="tradingName" className="label-text">
            Trading Name (if different)
          </label>
          <input
            type="text"
            id="tradingName"
            value={businessInfo.tradingName || ''}
            onChange={(e) => handleInputChange('tradingName', e.target.value)}
            className="input-field"
            placeholder="Enter trading name"
          />
        </div>
      </div>

      {/* Addresses */}
      <div className="space-y-4">
        <div>
          <label htmlFor="registeredAddress" className="label-text">
            Registered Address *
          </label>
          <textarea
            id="registeredAddress"
            rows={3}
            value={businessInfo.registeredAddress || ''}
            onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
            className="input-field"
            placeholder="Enter your registered business address"
          />
          {errors.registeredAddress && (
            <p className="error-text">{errors.registeredAddress}</p>
          )}
        </div>

        <div>
          <label htmlFor="tradingAddress" className="label-text">
            Trading Address (if different from registered)
          </label>
          <textarea
            id="tradingAddress"
            rows={3}
            value={businessInfo.tradingAddress || ''}
            onChange={(e) => handleInputChange('tradingAddress', e.target.value)}
            className="input-field"
            placeholder="Enter your trading address"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="label-text">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={businessInfo.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="input-field"
            placeholder="+353 1 234 5678"
          />
          {errors.phone && (
            <p className="error-text">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="label-text">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={businessInfo.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="input-field"
            placeholder="business@example.com"
          />
          {errors.email && (
            <p className="error-text">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Business Identifiers - Dynamic based on applicant type */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-md font-medium text-gray-900 mb-4">
          Business Identifiers
        </h3>
        
        {applicantType === 'sole-trader' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ppsn" className="label-text">
                PPSN *
              </label>
              <input
                type="text"
                id="ppsn"
                value={businessInfo.businessIdentifiers?.ppsn || ''}
                onChange={(e) => handleInputChange('businessIdentifiers.ppsn', e.target.value)}
                className="input-field"
                placeholder="1234567T"
              />
              {errors.ppsn && (
                <p className="error-text">{errors.ppsn}</p>
              )}
            </div>
            <div>
              <label htmlFor="taxRef" className="label-text">
                Tax Reference Number
              </label>
              <input
                type="text"
                id="taxRef"
                value={businessInfo.businessIdentifiers?.taxRef || ''}
                onChange={(e) => handleInputChange('businessIdentifiers.taxRef', e.target.value)}
                className="input-field"
                placeholder="Enter tax reference"
              />
            </div>
          </div>
        )}

        {applicantType === 'partnership' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="partnershipTaxNumber" className="label-text">
                Partnership Tax Number *
              </label>
              <input
                type="text"
                id="partnershipTaxNumber"
                value={businessInfo.businessIdentifiers?.partnershipTaxNumber || ''}
                onChange={(e) => handleInputChange('businessIdentifiers.partnershipTaxNumber', e.target.value)}
                className="input-field"
                placeholder="Enter partnership tax number"
              />
            </div>
          </div>
        )}

        {applicantType === 'limited-company' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="croNumber" className="label-text">
                CRO Number *
              </label>
              <input
                type="text"
                id="croNumber"
                value={businessInfo.businessIdentifiers?.croNumber || ''}
                onChange={(e) => handleInputChange('businessIdentifiers.croNumber', e.target.value)}
                className="input-field"
                placeholder="123456"
              />
              {errors.croNumber && (
                <p className="error-text">{errors.croNumber}</p>
              )}
            </div>
            <div>
              <label htmlFor="trn" className="label-text">
                Tax Reference Number *
              </label>
              <input
                type="text"
                id="trn"
                value={businessInfo.businessIdentifiers?.trn || ''}
                onChange={(e) => handleInputChange('businessIdentifiers.trn', e.target.value)}
                className="input-field"
                placeholder="1234567T"
              />
              {errors.trn && (
                <p className="error-text">{errors.trn}</p>
              )}
            </div>
            <div>
              <label htmlFor="lei" className="label-text">
                Legal Entity Identifier (Optional)
              </label>
              <input
                type="text"
                id="lei"
                value={businessInfo.businessIdentifiers?.lei || ''}
                onChange={(e) => handleInputChange('businessIdentifiers.lei', e.target.value)}
                className="input-field"
                placeholder="LEI code"
              />
            </div>
          </div>
        )}
      </div>

      {/* Business Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="industryType" className="label-text">
            Industry Type *
          </label>
          <select
            id="industryType"
            value={businessInfo.industryType || ''}
            onChange={(e) => handleInputChange('industryType', e.target.value)}
            className="input-field"
          >
            <option value="">Select industry type</option>
            {industryTypes.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          {errors.industryType && (
            <p className="error-text">{errors.industryType}</p>
          )}
        </div>

        <div>
          <label htmlFor="numberOfEmployees" className="label-text">
            Number of Employees *
          </label>
          <select
            id="numberOfEmployees"
            value={businessInfo.numberOfEmployees || ''}
            onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
            className="input-field"
          >
            <option value="">Select number of employees</option>
            {employeeRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
          {errors.numberOfEmployees && (
            <p className="error-text">{errors.numberOfEmployees}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="annualTurnover" className="label-text">
            Annual Turnover (€) *
          </label>
          <input
            type="number"
            id="annualTurnover"
            value={businessInfo.annualTurnover || ''}
            onChange={(e) => handleInputChange('annualTurnover', e.target.value)}
            className="input-field"
            placeholder="250000"
            min="0"
          />
          {errors.annualTurnover && (
            <p className="error-text">{errors.annualTurnover}</p>
          )}
        </div>

        <div>
          <label htmlFor="yearEstablished" className="label-text">
            Year Established *
          </label>
          <input
            type="number"
            id="yearEstablished"
            value={businessInfo.yearEstablished || ''}
            onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
            className="input-field"
            placeholder="2020"
            min="1900"
            max={new Date().getFullYear()}
          />
          {errors.yearEstablished && (
            <p className="error-text">{errors.yearEstablished}</p>
          )}
        </div>
      </div>

      {/* Existing Bank Account */}
      <div>
        <label htmlFor="bankAccount" className="label-text">
          Existing Bank Account (for existing customers)
        </label>
        <input
          type="text"
          id="bankAccount"
          value={businessInfo.bankAccount || ''}
          onChange={(e) => handleInputChange('bankAccount', e.target.value)}
          className="input-field"
          placeholder="IE29 AIBK 9311 5212 3456 78"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional: If you're an existing customer, please provide your account number or IBAN
        </p>
      </div>
    </div>
  );
}

export default BusinessInfoForm;
