import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Main application store with enhanced state management
export const useAppStore = create(
  persist(
    (set, get) => ({
      // User and Role Management
      user: null,
      role: 'STAFF', // STAFF | DIRECTOR | ADMIN
      userType: 'OPERATIONAL', // OPERATIONAL | DIRECTOR | EXTERNAL_DIRECTOR
      entity: null,
      isAuthenticated: false,

      // Staff/Director Workflow
      staffUser: null, // Current staff member logged in
      directorApprovalRequired: true,
      approvalStatus: 'DRAFT', // DRAFT | PENDING_DIRECTOR | APPROVED | EXPIRED | REJECTED
      digitalSigningSession: null,
      approvalExpiry: null, // 7 days from creation

      // Entity Management
      selectedEntity: null,
      entities: [
        {
          id: 'e1',
          name: 'Acme Bakery Ltd',
          croNumber: '123456',
          segment: 'SME_Retail',
          directors: [
            { name: 'Joe Bloggs', email: 'joe.bloggs@acmebakery.ie', role: 'Managing Director' },
            { name: 'Mary Murphy', email: 'mary@acmebakery.ie', role: 'Technical Director' }
          ],
          hasDirector: true,
          address: '123 Main Street, Dublin 2',
          vatNumber: 'IE1234567L',
          established: '2019'
        },
        {
          id: 'e2',
          name: 'Tech Innovations Ltd',
          croNumber: '789012',
          segment: 'SME_Tech',
          directors: [
            { name: 'Sarah Connor', email: 'sarah@techinnovations.ie', role: 'CEO' }
          ],
          hasDirector: true,
          address: '456 Innovation Hub, Cork',
          vatNumber: 'IE7890123M',
          established: '2020'
        }
      ],

      // Quote Management
      currentQuote: null,
      quotes: [],
      quoteReference: null,
      selectedProducts: [], // Products selected during suitability analysis

      // Application Management
      currentApplication: null,
      applications: [],
      
      // Director Approval Workflow
      pendingApprovals: [], // Applications awaiting director approval
      approvalHistory: [], // Complete approval audit trail
      directorSigningLinks: [], // Active signing sessions
      emailNotifications: [], // Email notification history
      approvalThresholds: {
        single_director: 250000, // Amounts below this need 1 director
        dual_director: 500000, // Amounts above single but below this need 2 directors
        board_approval: 1000000 // Amounts above this need board approval
      },
      
      // Application Stages
      applicationStage: 'DRAFT', // DRAFT | SUBMITTED | CREDIT_REVIEW | CREDIT_APPROVED | SIGNING_REQUIRED | FULLY_SIGNED | COMPLETE

      // Decision Engine
      decisionOutcome: null,
      decisionRules: {
        autoApprove: { maxAmount: 50000, maxTerm: 60, excludedSectors: ['High Risk'] },
        autoDecline: { insufficientAffordability: true },
        rtl: { minAmount: 150000 }
      },

      // Documents and Signing
      documents: [],
      signingProgress: {
        required: 2,
        completed: 0,
        signatories: []
      },

      // Facilities (Day-2)
      facilities: [
        {
          id: 'F001',
          product: 'TERM_LOAN',
          productName: 'Term Loan',
          closingBalance: 52000,
          originalAmount: 75000,
          terms: {
            termMonths: 60,
            repaymentDate: 20,
            interestRate: 4.5,
            monthlyRepayment: 1250
          },
          status: 'ACTIVE'
        },
        {
          id: 'F002',
          product: 'OD',
          productName: 'Overdraft',
          closingBalance: 8000,
          terms: {
            limit: 15000,
            interestRate: 8.9
          },
          status: 'ACTIVE'
        }
      ],

      // RTL (Refer to Lender) Management
      rtlTasks: [],
      rtlMessages: [],

      // Demo Controls
      demoMode: true,
      simulatedOutcome: 'AUTO_APPROVE', // AUTO_APPROVE | CONDITIONAL_APPROVE | MANUAL_REVIEW | DECLINE | AUTO_DECLINE | RTL

      // Status tracking
      applicationStatus: 'DRAFT', // DRAFT | READY | SUBMITTED | DECISION_APPROVED | DECISION_DECLINED | DECISION_RTL | DOCS | SIGNING | SIGNED | FULFILMENT | COMPLETE

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setRole: (role) => set({ role }),
      setEntity: (entity) => set({ selectedEntity: entity }),
      setSelectedProducts: (products) => set({ selectedProducts: products }),
      setApplicationStatus: (status) => set({ applicationStatus: status }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        selectedEntity: null,
        currentQuote: null,
        currentApplication: null,
        selectedProducts: [],
        approvalStatus: 'DRAFT',
        digitalSigningSession: null
      }),

      // Director Approval Workflow Actions
      submitForApproval: (applicationData) => set((state) => {
        const directors = [
          { id: 'dir1', name: 'Joe Bloggs', email: 'joe.bloggs@democorp.com' },
          { id: 'dir2', name: 'Mary Murphy', email: 'mary.murphy@democorp.com' },
          { id: 'dir3', name: 'James Wilson', email: 'james.wilson@democorp.com' }
        ];

        const newApproval = {
          id: Date.now(),
          submittedBy: state.user,
          submittedAt: new Date().toISOString(),
          applicationData,
          status: 'PENDING_DIRECTOR',
          amount: applicationData.loanAmount || 0,
          directorsRequired: state.getDirectorsRequired(applicationData.loanAmount || 0),
          approvals: [],
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        };
        
        // Create initial information email to all directors
        const emailNotification = {
          id: Date.now() + 1,
          type: 'DIRECTOR_INFO',
          subject: `New Loan Application Submitted - ${applicationData.entity?.name || 'Unknown Entity'}`,
          recipients: directors,
          sentAt: new Date().toISOString(),
          applicationId: newApproval.id,
          purpose: 'INFORMATION_ONLY',
          content: {
            entityName: applicationData.entity?.name,
            amount: applicationData.loanAmount || 0,
            submittedBy: state.user?.name,
            summary: 'Application has been submitted and is now under credit review. You will receive a signing request if the application is approved.'
          }
        };
        
        return {
          pendingApprovals: [...state.pendingApprovals, newApproval],
          approvalStatus: 'PENDING_DIRECTOR',
          applicationStage: 'SUBMITTED',
          emailNotifications: [...state.emailNotifications, emailNotification]
        };
      }),
      
      simulateCreditApproval: (approvalId) => set((state) => {
        const approval = state.pendingApprovals.find(a => a.id === approvalId);
        if (!approval) return state;
        
        const directors = [
          { id: 'dir1', name: 'Mary Murphy', email: 'mary.murphy@democorp.com' },
          { id: 'dir2', name: 'James Wilson', email: 'james.wilson@democorp.com' },
          { id: 'dir3', name: 'Sarah Chen', email: 'sarah.chen@democorp.com' }
        ];
        
        const requiredDirectors = approval.directorsRequired === 'DUAL_DIRECTOR' ? 2 : 1;
        const relevantDirectors = directors.slice(0, requiredDirectors);
        
        // Create signing request email
        const signingEmailNotification = {
          id: Date.now() + 2,
          type: 'SIGNING_REQUEST',
          subject: `URGENT: Digital Signature Required - Loan Application Approved`,
          recipients: relevantDirectors,
          sentAt: new Date().toISOString(),
          applicationId: approval.id,
          purpose: 'SIGNATURE_REQUIRED',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          content: {
            entityName: approval.applicationData?.entity?.name,
            amount: approval.amount,
            approvedAmount: approval.amount,
            summary: 'The loan application has been approved by Credit. Your digital signature is now required to legally bind the company to this loan agreement.',
            signingLink: `https://portal.democorp.com/sign/${approval.id}`,
            legalNotice: 'By signing, you are binding the company (not yourself personally) to this loan agreement.'
          }
        };
        
        // Update approval status
        const updatedApproval = {
          ...approval,
          creditApproved: true,
          creditApprovedAt: new Date().toISOString(),
          creditDecision: 'APPROVED',
          status: 'CREDIT_APPROVED_AWAITING_SIGNATURE'
        };
        
        return {
          pendingApprovals: state.pendingApprovals.map(a => 
            a.id === approvalId ? updatedApproval : a
          ),
          applicationStage: 'CREDIT_APPROVED',
          emailNotifications: [...state.emailNotifications, signingEmailNotification]
        };
      }),
      
      addDirectorApproval: (approvalId, directorSignature) => set((state) => ({
        pendingApprovals: state.pendingApprovals.map(approval => 
          approval.id === approvalId 
            ? { 
                ...approval, 
                approvals: [...approval.approvals, {
                  directorId: state.user.id,
                  directorName: state.user.name,
                  signedAt: new Date().toISOString(),
                  signature: directorSignature,
                  eidas_timestamp: new Date().toISOString(),
                  eidas_qualified: true
                }]
              }
            : approval
        )
      })),
      
      finalizeApproval: (approvalId) => set((state) => {
        const approval = state.pendingApprovals.find(a => a.id === approvalId);
        if (!approval) return state;
        
        const finalizedApproval = {
          ...approval,
          status: 'APPROVED',
          finalizedAt: new Date().toISOString(),
          autoSubmittedAt: new Date().toISOString()
        };
        
        return {
          pendingApprovals: state.pendingApprovals.filter(a => a.id !== approvalId),
          approvalHistory: [...state.approvalHistory, finalizedApproval],
          approvalStatus: 'APPROVED'
        };
      }),
      
      getDirectorsRequired: (amount) => {
        if (amount >= 1000000) return 'BOARD_APPROVAL';
        if (amount >= 500000) return 'DUAL_DIRECTOR';
        return 'SINGLE_DIRECTOR';
      },

      // Entity Actions
      selectEntity: (entityId) => {
        const entity = get().entities.find(e => e.id === entityId);
        set({ selectedEntity: entity });
      },

      // Quote Actions
      createQuote: () => {
        const quote = {
          id: `Q-${Date.now()}`,
          reference: `Q-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
          items: [],
          status: 'DRAFT',
          totalAmount: 0,
          monthlyRepayment: 0,
          createdAt: new Date().toISOString(),
          entityId: get().selectedEntity?.id
        };
        set({ currentQuote: quote });
        return quote;
      },

      addToQuote: (quote) => {
        const quotes = get().quotes;
        const updatedQuotes = [...quotes, quote];
        set({ 
          quotes: updatedQuotes,
          currentQuote: quote
        });
      },

      addProductToQuote: (product) => {
        const currentQuote = get().currentQuote;
        if (!currentQuote) return;

        const updatedQuote = {
          ...currentQuote,
          items: [...currentQuote.items, {
            id: `item-${Date.now()}`,
            productCode: product.code,
            productName: product.name,
            amount: product.amount || 0,
            termMonths: product.termMonths || 12,
            interestRate: product.interestRate || 5.0,
            frequency: product.frequency || 'MONTHLY',
            firstRepaymentDate: product.firstRepaymentDate || null
          }]
        };

        updatedQuote.totalAmount = updatedQuote.items.reduce((sum, item) => sum + item.amount, 0);
        set({ currentQuote: updatedQuote });
      },

      calculateRepayments: () => {
        const currentQuote = get().currentQuote;
        if (!currentQuote) return;

        // Simple annuity formula calculation
        let totalMonthlyRepayment = 0;
        const updatedItems = currentQuote.items.map(item => {
          const monthlyRate = item.interestRate / 100 / 12;
          const numPayments = item.termMonths;
          const monthlyRepayment = item.amount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
          
          totalMonthlyRepayment += monthlyRepayment;
          return { ...item, monthlyRepayment: Math.round(monthlyRepayment * 100) / 100 };
        });

        const updatedQuote = {
          ...currentQuote,
          items: updatedItems,
          monthlyRepayment: Math.round(totalMonthlyRepayment * 100) / 100,
          calculatedAt: new Date().toISOString()
        };

        set({ currentQuote: updatedQuote });
      },

      saveQuote: () => {
        const currentQuote = get().currentQuote;
        if (!currentQuote) return;

        const quotes = get().quotes;
        const updatedQuotes = [...quotes.filter(q => q.id !== currentQuote.id), currentQuote];
        
        set({ 
          quotes: updatedQuotes,
          quoteReference: currentQuote.reference
        });
        
        return currentQuote.reference;
      },

      loadQuoteByReference: (reference) => {
        const quotes = get().quotes;
        const quote = quotes.find(q => q.reference === reference);
        if (quote) {
          set({ currentQuote: quote });
          return true;
        }
        return false;
      },

      // Application Actions
      createApplicationFromQuote: () => {
        const currentQuote = get().currentQuote;
        const selectedEntity = get().selectedEntity;
        
        if (!currentQuote || !selectedEntity) return null;

        const application = {
          id: `APP-${Date.now()}`,
          quoteId: currentQuote.id,
          quoteReference: currentQuote.reference,
          entityId: selectedEntity.id,
          status: 'DRAFT',
          products: currentQuote.items,
          totalAmount: currentQuote.totalAmount,
          monthlyRepayment: currentQuote.monthlyRepayment,
          ccrConsent: false,
          documents: [],
          signatures: {
            rule: '2DIR',
            required: 2,
            completed: []
          },
          createdAt: new Date().toISOString(),
          submittedAt: null,
          decisionAt: null
        };

        set({ currentApplication: application });
        return application;
      },

      updateApplicationConsent: (ccrConsent) => {
        const currentApplication = get().currentApplication;
        if (!currentApplication) return;

        set({
          currentApplication: {
            ...currentApplication,
            ccrConsent
          }
        });
      },

      submitApplication: () => {
        const currentApplication = get().currentApplication;
        const role = get().role;
        
        if (!currentApplication) return false;

        if (role === 'PREPARER') {
          // Preparer cannot submit - request Director approval
          set({
            currentApplication: {
              ...currentApplication,
              status: 'PENDING_DIRECTOR_APPROVAL',
              requestedAt: new Date().toISOString()
            }
          });
          return 'DIRECTOR_APPROVAL_REQUIRED';
        }

        // Director can submit
        const updatedApplication = {
          ...currentApplication,
          status: 'SUBMITTED',
          submittedAt: new Date().toISOString()
        };

        set({ 
          currentApplication: updatedApplication,
          applicationStatus: 'SUBMITTED'
        });

        // Trigger decision simulation
        setTimeout(() => {
          get().processDecision();
        }, 2000);

        return 'SUBMITTED';
      },

      processDecision: () => {
        const currentApplication = get().currentApplication;
        const simulatedOutcome = get().simulatedOutcome;
        
        if (!currentApplication) return;

        let decision = {};

        if (simulatedOutcome === 'AUTO_APPROVE') {
          decision = {
            outcome: 'APPROVED',
            amount: currentApplication.totalAmount,
            interestRate: 4.5,
            terms: 'Standard terms apply',
            conditions: ['Personal guarantee required', 'Monthly reporting']
          };
          set({ applicationStatus: 'DECISION_APPROVED' });
        } else if (simulatedOutcome === 'CONDITIONAL_APPROVE') {
          decision = {
            outcome: 'CONDITIONAL_APPROVAL',
            amount: Math.floor(currentApplication.totalAmount * 0.8),
            interestRate: 6.5,
            terms: 'Conditional approval with requirements',
            conditions: ['Additional financial statements', 'Personal guarantee', 'Insurance assignment']
          };
          set({ applicationStatus: 'DECISION_APPROVED' });
        } else if (simulatedOutcome === 'MANUAL_REVIEW') {
          decision = {
            outcome: 'MANUAL_REVIEW',
            reasons: ['Complex business structure', 'Manual underwriting required'],
            estimatedTime: '2-3 business days'
          };
          set({ applicationStatus: 'DECISION_RTL' });
        } else if (simulatedOutcome === 'DECLINE') {
          decision = {
            outcome: 'DECLINED',
            reasons: ['Financial position does not meet criteria', 'Insufficient trading history'],
            appealProcess: 'You can request a manual review within 30 days'
          };
          set({ applicationStatus: 'DECISION_DECLINED' });
        } else if (simulatedOutcome === 'AUTO_DECLINE') {
          decision = {
            outcome: 'DECLINED',
            reasons: ['Insufficient affordability', 'Credit score below threshold'],
            appealProcess: 'Contact your relationship manager'
          };
          set({ applicationStatus: 'DECISION_DECLINED' });
        } else if (simulatedOutcome === 'RTL') {
          decision = {
            outcome: 'REFER_TO_LENDER',
            reasons: ['Manual review required', 'Additional documentation needed'],
            requiredItems: ['Tax certificate', 'Audited accounts', 'Business plan']
          };
          set({ applicationStatus: 'DECISION_RTL' });
        }

        const updatedApplication = {
          ...currentApplication,
          status: decision.outcome,
          decision,
          decisionAt: new Date().toISOString()
        };

        set({ 
          currentApplication: updatedApplication,
          decisionOutcome: decision
        });
      },

      // Document and Signing Actions
      generateDocuments: () => {
        const currentApplication = get().currentApplication;
        if (!currentApplication || currentApplication.status !== 'APPROVED') return;

        const documents = [
          {
            id: `doc-${Date.now()}`,
            type: 'CREDIT_AGREEMENT',
            name: 'Credit Agreement',
            status: 'GENERATED',
            url: `blob:credit-agreement-${currentApplication.id}.pdf`,
            generatedAt: new Date().toISOString()
          },
          {
            id: `doc-${Date.now() + 1}`,
            type: 'TERMS_CONDITIONS',
            name: 'Terms and Conditions',
            status: 'GENERATED',
            url: `blob:terms-conditions-${currentApplication.id}.pdf`,
            generatedAt: new Date().toISOString()
          }
        ];

        set({ 
          documents,
          applicationStatus: 'DOCS'
        });
      },

      startSigning: () => {
        const selectedEntity = get().selectedEntity;
        if (!selectedEntity) return;

        const signingProgress = {
          required: selectedEntity.directors.length,
          completed: 0,
          signatories: selectedEntity.directors.map(director => ({
            name: director.name,
            email: director.email,
            role: director.role,
            signed: false,
            signedAt: null,
            signature: null
          }))
        };

        set({ 
          signingProgress,
          applicationStatus: 'SIGNING'
        });
      },

      signDocument: (signatoryEmail, signature) => {
        const signingProgress = get().signingProgress;
        
        const updatedSignatories = signingProgress.signatories.map(signatory => {
          if (signatory.email === signatoryEmail) {
            return {
              ...signatory,
              signed: true,
              signedAt: new Date().toISOString(),
              signature
            };
          }
          return signatory;
        });

        const completed = updatedSignatories.filter(s => s.signed).length;
        const allSigned = completed === signingProgress.required;

        const updatedProgress = {
          ...signingProgress,
          signatories: updatedSignatories,
          completed
        };

        set({ signingProgress: updatedProgress });

        if (allSigned) {
          set({ applicationStatus: 'SIGNED' });
          // Auto-advance to fulfilment
          setTimeout(() => {
            set({ applicationStatus: 'FULFILMENT' });
            setTimeout(() => {
              set({ applicationStatus: 'COMPLETE' });
            }, 3000);
          }, 2000);
        }
      },

      // Day-2 Operations
      changeFacilityRepaymentDate: (facilityId, newDate) => {
        const facilities = get().facilities;
        const updatedFacilities = facilities.map(facility => {
          if (facility.id === facilityId) {
            return {
              ...facility,
              terms: {
                ...facility.terms,
                repaymentDate: newDate
              },
              lastModified: new Date().toISOString()
            };
          }
          return facility;
        });

        set({ facilities: updatedFacilities });
      },

      createRestructureQuote: (facilityId) => {
        const facilities = get().facilities;
        const facility = facilities.find(f => f.id === facilityId);
        
        if (!facility) return null;

        const quote = {
          id: `Q-${Date.now()}`,
          reference: `Q-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
          items: [{
            id: `item-${Date.now()}`,
            productCode: facility.product,
            productName: facility.productName,
            amount: facility.closingBalance,
            termMonths: facility.terms.termMonths || 12,
            interestRate: facility.terms.interestRate || 5.0,
            frequency: 'MONTHLY',
            firstRepaymentDate: null,
            isRestructure: true,
            originalFacilityId: facilityId
          }],
          status: 'DRAFT',
          totalAmount: facility.closingBalance,
          monthlyRepayment: 0,
          createdAt: new Date().toISOString(),
          entityId: get().selectedEntity?.id,
          isRestructure: true
        };

        set({ currentQuote: quote });
        return quote;
      },

      // RTL Management
      addRTLMessage: (message) => {
        const rtlMessages = get().rtlMessages;
        const newMessage = {
          id: `msg-${Date.now()}`,
          ...message,
          timestamp: new Date().toISOString()
        };
        set({ rtlMessages: [...rtlMessages, newMessage] });
      },

      addRTLTask: (task) => {
        const rtlTasks = get().rtlTasks;
        const newTask = {
          id: `task-${Date.now()}`,
          ...task,
          createdAt: new Date().toISOString(),
          status: 'PENDING'
        };
        set({ rtlTasks: [...rtlTasks, newTask] });
      },

      completeRTLTask: (taskId) => {
        const rtlTasks = get().rtlTasks;
        const updatedTasks = rtlTasks.map(task => {
          if (task.id === taskId) {
            return { ...task, status: 'COMPLETED', completedAt: new Date().toISOString() };
          }
          return task;
        });
        set({ rtlTasks: updatedTasks });
      },

      // Demo Controls
      setSimulatedOutcome: (outcome) => set({ simulatedOutcome: outcome }),
      toggleDemoMode: () => set(state => ({ demoMode: !state.demoMode })),

      // Reset functions
      resetQuote: () => set({ currentQuote: null, quoteReference: null }),
      resetApplication: () => set({ 
        currentApplication: null, 
        decisionOutcome: null,
        documents: [],
        signingProgress: { required: 2, completed: 0, signatories: [] },
        applicationStatus: 'DRAFT'
      }),
      resetAll: () => set({
        currentQuote: null,
        currentApplication: null,
        quoteReference: null,
        decisionOutcome: null,
        documents: [],
        signingProgress: { required: 2, completed: 0, signatories: [] },
        applicationStatus: 'DRAFT',
        rtlMessages: [],
        rtlTasks: []
      })
    }),
    {
      name: 'sme-app-storage',
      partialize: (state) => ({
        quotes: state.quotes,
        applications: state.applications,
        facilities: state.facilities,
        selectedEntity: state.selectedEntity,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Product definitions
export const PRODUCTS = [
  {
    code: 'TERM_LOAN',
    name: 'Term Loan',
    online_enabled: true,
    min_amount: 1000,
    max_amount: 250000,
    term_min: 6,
    term_max: 84,
    interestRate: '4.5% - 8.9%',
    description: 'Fixed-term financing for equipment, expansion, or major business investments'
  },
  {
    code: 'OD',
    name: 'Overdraft',
    online_enabled: true,
    min_amount: 1000,
    max_amount: 50000,
    term_min: 12,
    term_max: 12,
    interestRate: '6.9% - 12.9%',
    description: 'Flexible credit facility for cash flow management and working capital'
  },
  {
    code: 'BCL',
    name: 'Business Credit Line',
    online_enabled: true,
    min_amount: 10000,
    max_amount: 100000,
    term_min: 12,
    term_max: 60,
    interestRate: '5.5% - 10.5%',
    description: 'Revolving credit facility with flexible access to funds'
  },
  {
    code: 'COMM_MORTGAGE',
    name: 'Commercial Mortgage',
    online_enabled: false,
    min_amount: 100000,
    max_amount: 5000000,
    term_min: 60,
    term_max: 300,
    interestRate: '3.5% - 6.5%',
    description: 'Long-term financing for commercial property purchases'
  }
];
