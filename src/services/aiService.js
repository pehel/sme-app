// Mock AI Service for SME Banking Application
// Simulates various AI agents for document processing, data extraction, and intelligent assistance

class AIService {
  constructor() {
    this.isProcessing = false;
    this.processingDelay = 2000; // Simulate AI processing time
  }

  // AI Agent: Bank Statement Analyzer
  async analyzeBankStatement(file) {
    this.isProcessing = true;
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, this.processingDelay));
    
    // Mock extracted data from bank statement
    const mockExtractedData = {
      businessName: "Green Energy Solutions Ltd",
      accountNumber: "IE29AIBK93115212345678",
      bankName: "Allied Irish Banks",
      accountType: "Business Current Account",
      openingBalance: 45000,
      closingBalance: 78500,
      averageBalance: 62750,
      monthlyTurnover: 125000,
      lastSixMonthsAverage: 118000,
      incomingTransactions: {
        count: 45,
        totalAmount: 156000,
        largestTransaction: 25000,
        recurringIncome: [
          { description: "Client Payment - ABC Corp", amount: 15000, frequency: "Monthly" },
          { description: "Government Grant", amount: 5000, frequency: "Quarterly" }
        ]
      },
      outgoingTransactions: {
        count: 67,
        totalAmount: 122500,
        largestTransaction: 12000,
        recurringExpenses: [
          { description: "Office Rent", amount: 3500, frequency: "Monthly" },
          { description: "Staff Salaries", amount: 18000, frequency: "Monthly" },
          { description: "Utilities", amount: 800, frequency: "Monthly" }
        ]
      },
      creditHistory: {
        overdraftUsage: "Minimal",
        returnedPayments: 0,
        creditScore: "Excellent",
        riskAssessment: "Low Risk"
      },
      cashFlow: {
        seasonal: false,
        growth: "Positive",
        stability: "High"
      },
      aiInsights: [
        "Strong cash flow with 67% growth over 6 months",
        "Regular income from established clients indicates stability",
        "Low risk profile with excellent payment history",
        "Recommended credit limit: €50,000 - €75,000"
      ],
      confidence: 0.94
    };

    this.isProcessing = false;
    return mockExtractedData;
  }

  // AI Agent: Business Information Extractor
  async extractBusinessInfo(companyRegistrationNumber) {
    this.isProcessing = true;
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockBusinessData = {
      companyName: "Green Energy Solutions Ltd",
      registrationNumber: companyRegistrationNumber,
      incorporationDate: "2019-03-15",
      companyType: "Private Limited Company",
      status: "Active",
      address: {
        street: "12 Dublin Technology Park",
        city: "Dublin",
        county: "Dublin",
        eircode: "D18 X5K7",
        country: "Ireland"
      },
      directors: [
        {
          name: "Sarah O'Connor",
          dateOfBirth: "1985-07-22",
          nationality: "Irish",
          position: "Managing Director",
          appointmentDate: "2019-03-15"
        },
        {
          name: "Michael Thompson",
          dateOfBirth: "1982-11-08",
          nationality: "Irish",
          position: "Technical Director",
          appointmentDate: "2019-03-15"
        }
      ],
      shareholders: [
        { name: "Sarah O'Connor", percentage: 60 },
        { name: "Michael Thompson", percentage: 40 }
      ],
      industry: "Renewable Energy Solutions",
      sicCode: "35.11",
      sicDescription: "Production of electricity",
      vatNumber: "IE3234567FA",
      employeeCount: 15,
      annualReturn: {
        lastFiled: "2024-03-15",
        status: "Up to date"
      },
      creditRating: "A-",
      aiInsights: [
        "Well-established company with 5+ years of trading",
        "Clean regulatory record with timely filings",
        "Growing renewable energy sector",
        "Strong director credentials"
      ],
      confidence: 0.96
    };

    this.isProcessing = false;
    return mockBusinessData;
  }

  // AI Agent: Document Analyzer
  async analyzeDocument(file, documentType) {
    this.isProcessing = true;
    
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    const mockAnalysisResults = {
      "identity": {
        extracted: {
          fullName: "Sarah O'Connor",
          dateOfBirth: "1985-07-22",
          address: "12 Dublin Technology Park, Dublin, D18 X5K7",
          idNumber: "12345678A",
          issueDate: "2020-01-15",
          expiryDate: "2030-01-15"
        },
        verification: {
          authentic: true,
          securityFeatures: "Valid",
          faceMatch: true,
          nameMatch: true
        },
        confidence: 0.98
      },
      "financial": {
        extracted: {
          accountNumber: "IE29AIBK93115212345678",
          balance: "€78,500",
          statementPeriod: "Jan 2024 - Jun 2024",
          transactions: 112,
          credits: "€156,000",
          debits: "€122,500"
        },
        insights: [
          "Healthy cash flow detected",
          "Regular income patterns",
          "Low risk indicators"
        ],
        confidence: 0.95
      },
      "legal": {
        extracted: {
          documentType: "Certificate of Incorporation",
          companyName: "Green Energy Solutions Ltd",
          registrationNumber: "634789",
          issueDate: "2019-03-15"
        },
        verification: {
          valid: true,
          status: "Active"
        },
        confidence: 0.97
      }
    };

    this.isProcessing = false;
    return mockAnalysisResults[documentType] || mockAnalysisResults.identity;
  }

  // AI Agent: Risk Assessment
  async assessRisk(applicationData) {
    this.isProcessing = true;
    
    await new Promise(resolve => setTimeout(resolve, 2200));
    
    const riskFactors = {
      industryRisk: "Low", // Renewable energy is stable
      financialRisk: "Low", // Strong cash flow
      creditRisk: "Very Low", // Excellent history
      operationalRisk: "Low", // Established business
      marketRisk: "Medium", // General market conditions
      regulatoryRisk: "Low" // Compliant business
    };

    const riskScore = 85; // Out of 100 (higher is better)
    
    const recommendations = [
      "Approve credit facility up to €75,000",
      "Offer preferential interest rate due to low risk",
      "Consider relationship banking products",
      "Quarterly review recommended"
    ];

    const riskAssessment = {
      overallRisk: "Low",
      riskScore: riskScore,
      factors: riskFactors,
      recommendations: recommendations,
      confidence: 0.92,
      detailedAnalysis: {
        cashFlow: "Strong and consistent",
        debtToIncome: "Healthy ratio",
        industryOutlook: "Positive growth expected",
        managementQuality: "Experienced team"
      }
    };

    this.isProcessing = false;
    return riskAssessment;
  }

  // AI Agent: Smart Form Filling
  async suggestFormData(currentData, stepType) {
    this.isProcessing = true;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const suggestions = {
      "customer-details": {
        businessAddress: {
          street: "12 Dublin Technology Park",
          city: "Dublin",
          county: "Dublin",
          eircode: "D18 X5K7"
        },
        tradingAddress: "Same as business address",
        website: "www.greenenergysolutions.ie",
        phone: "+353 1 234 5678",
        industry: "Renewable Energy Solutions"
      },
      "application-details": {
        requestedAmount: 65000, // Based on cash flow analysis
        purpose: "Working capital and equipment upgrade",
        repaymentPeriod: 36, // months
        preferredRate: "Variable"
      }
    };

    this.isProcessing = false;
    return suggestions[stepType] || {};
  }

  // AI Agent: Intelligent Validation
  async validateData(data, context) {
    this.isProcessing = true;
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const validationResults = {
      isValid: true,
      warnings: [],
      suggestions: [],
      confidence: 0.89
    };

    // Simulate intelligent validation
    if (data.requestedAmount && data.monthlyIncome) {
      const ratio = data.requestedAmount / (data.monthlyIncome * 12);
      if (ratio > 0.5) {
        validationResults.warnings.push("Requested amount is high relative to annual income");
        validationResults.suggestions.push("Consider reducing loan amount to €" + Math.round(data.monthlyIncome * 6));
      }
    }

    this.isProcessing = false;
    return validationResults;
  }

  // AI Agent: Conversational Assistant
  async getContextualHelp(step, userQuery = null) {
    this.isProcessing = true;
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const helpContent = {
      "product-selection": {
        message: "I can help you choose the right credit product based on your business needs.",
        suggestions: [
          "Based on your business type, I recommend a Term Loan for equipment financing",
          "Your cash flow suggests you might benefit from a Line of Credit for flexibility",
          "Consider our Invoice Financing if you have outstanding receivables"
        ]
      },
      "applicant-type": {
        message: "Let me help identify the correct applicant type for your business structure.",
        suggestions: [
          "Since you're incorporated, 'Limited Company' is the correct choice",
          "Partnerships require all partners to be verified",
          "Sole traders have simplified requirements"
        ]
      },
      "document-upload": {
        message: "I'll automatically extract information from your documents to save time.",
        suggestions: [
          "Upload your bank statements and I'll fill in your financial details",
          "Your Certificate of Incorporation will auto-populate company information",
          "Drag and drop multiple files - I'll process them intelligently"
        ]
      }
    };

    this.isProcessing = false;
    return helpContent[step] || {
      message: "I'm here to help! What would you like assistance with?",
      suggestions: ["Ask me anything about the application process"]
    };
  }

  // AI Agent: Decision Engine
  async generateDecision(applicationData) {
    this.isProcessing = true;
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Always approve applications for demo purposes
    const decision = {
      type: "approved",
      amount: applicationData.requestedAmount || 50000,
      interestRate: 4.5,
      term: 36,
      conditions: [
        "Personal guarantee required",
        "Monthly financial reporting",
        "Annual review"
      ]
    };

    decision.confidence = 0.92;
    decision.processingTime = "Instant AI Decision";
    decision.referenceNumber = `AI-${Date.now()}`;

    this.isProcessing = false;
    return decision;
  }

  // Utility: Check if AI is currently processing
  isAIProcessing() {
    return this.isProcessing;
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService;
