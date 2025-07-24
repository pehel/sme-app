import React, { createContext, useContext, useReducer, useEffect } from 'react';

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  RM: 'rm',
  SUPERUSER: 'superuser'
};

// Mock user database - in real app this would be in backend
const MOCK_USERS = {
  // Customers
  'customer@test.com': {
    id: 'cust_001',
    email: 'customer@test.com',
    password: 'password123', // In real app, this would be hashed
    role: USER_ROLES.CUSTOMER,
    name: 'John Smith',
    businessName: 'TechGreen Solutions',
    phone: '+353-87-123-4567',
    isExistingCustomer: true,
    mfaEnabled: true,
    createdAt: '2024-01-15',
    // Existing customer data
    existingData: {
      businessInfo: {
        businessName: 'TechGreen Solutions',
        tradingName: 'TechGreen',
        registeredAddress: '15 Dame Street, Dublin 2, D02 Y211',
        tradingAddress: '15 Dame Street, Dublin 2, D02 Y211',
        phone: '+353-87-123-4567',
        email: 'customer@test.com',
        businessIdentifiers: {
          ppsn: '1234567T',
          taxRef: 'IE9876543H',
          croNumber: 'CRO123456',
          vatNumber: 'IE9876543H'
        },
        industryType: 'Technology',
        numberOfEmployees: '25',
        annualTurnover: '2500000',
        yearEstablished: '2019',
        bankAccount: 'IE29 BOFI 9000 1234 5678 90'
      },
      personalInfo: {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1985-03-15',
        nationality: 'Irish',
        address: {
          street: '42 Grafton Street',
          city: 'Dublin',
          county: 'Dublin',
          postalCode: 'D02 VN88',
          country: 'Ireland'
        },
        phone: '+353-87-123-4567',
        email: 'customer@test.com',
        ppsn: '1234567T',
        idDocument: {
          type: 'passport',
          number: 'P123456789',
          expiryDate: '2030-05-20'
        },
        employmentStatus: 'Business Owner',
        position: 'Managing Director',
        workExperience: '15',
        annualIncome: '85000'
      }
    }
  },
  'newcustomer@test.com': {
    id: 'cust_002',
    email: 'newcustomer@test.com',
    password: 'password123',
    role: USER_ROLES.CUSTOMER,
    name: 'Sarah Johnson',
    businessName: 'Green Energy Ltd',
    phone: '+353-86-987-6543',
    isExistingCustomer: false,
    mfaEnabled: true,
    createdAt: '2024-07-20',
    // New customer basic data
    existingData: {
      personalInfo: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: '1990-08-22',
        nationality: 'Irish',
        address: {
          street: '28 Merrion Square',
          city: 'Dublin',
          county: 'Dublin',
          postalCode: 'D02 F234',
          country: 'Ireland'
        },
        phone: '+353-86-987-6543',
        email: 'newcustomer@test.com',
        ppsn: '2345678U',
        idDocument: {
          type: 'passport',
          number: 'P987654321',
          expiryDate: '2029-11-15'
        },
        employmentStatus: 'Business Owner',
        position: 'CEO',
        workExperience: '8',
        annualIncome: '75000'
      },
      businessInfo: {
        businessName: 'Green Energy Ltd',
        tradingName: 'Green Energy',
        registeredAddress: '28 Merrion Square, Dublin 2, D02 F234',
        tradingAddress: '28 Merrion Square, Dublin 2, D02 F234',
        phone: '+353-86-987-6543',
        email: 'newcustomer@test.com',
        businessIdentifiers: {
          ppsn: '2345678U',
          taxRef: 'IE8765432G',
          croNumber: 'CRO789012',
          vatNumber: 'IE8765432G'
        },
        industryType: 'Energy',
        numberOfEmployees: '12',
        annualTurnover: '1800000',
        yearEstablished: '2021',
        bankAccount: 'IE29 BOFI 9000 9876 5432 10'
      }
    }
  },
  // Relationship Managers
  'rm1@bank.com': {
    id: 'rm_001',
    email: 'rm1@bank.com',
    password: 'rmpass123',
    role: USER_ROLES.RM,
    name: 'Michael O\'Connor',
    phone: '+353-85-111-2222',
    mfaEnabled: true,
    accessScope: {
      regions: ['Dublin', 'Cork'],
      products: ['term-loan', 'green-loan'],
      maxAmount: 500000
    },
    createdAt: '2023-03-10'
  },
  'rm2@bank.com': {
    id: 'rm_002',
    email: 'rm2@bank.com',
    password: 'rmpass123',
    role: USER_ROLES.RM,
    name: 'Lisa Murphy',
    phone: '+353-85-333-4444',
    mfaEnabled: true,
    accessScope: {
      regions: ['Galway', 'Limerick'],
      products: ['business-overdraft', 'business-credit-card'],
      maxAmount: 100000
    },
    createdAt: '2023-06-15'
  },
  // Superusers
  'admin@bank.com': {
    id: 'admin_001',
    email: 'admin@bank.com',
    password: 'adminpass123',
    role: USER_ROLES.SUPERUSER,
    name: 'David Walsh',
    phone: '+353-85-555-6666',
    mfaEnabled: true,
    createdAt: '2022-01-01'
  }
};

// Application status types
export const APPLICATION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  PENDING_REVIEW: 'pending_review',
  INFO_REQUESTED: 'info_requested',
  APPROVED: 'approved',
  DECLINED: 'declined',
  OFFER_ACCEPTED: 'offer_accepted',
  COMPLETED: 'completed'
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  mfaRequired: false,
  mfaMethod: null,
  tempCredentials: null,
  session: null,
  users: MOCK_USERS,
  applications: [], // Will store all applications with ownership
  currentOTP: null,
  otpExpiry: null,
  loginAttempts: 0,
  sessionTimeout: null
};

// Action types
const actionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  MFA_REQUIRED: 'MFA_REQUIRED',
  MFA_SUCCESS: 'MFA_SUCCESS',
  MFA_FAILURE: 'MFA_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_USER: 'REGISTER_USER',
  UPDATE_USER: 'UPDATE_USER',
  CREATE_RM: 'CREATE_RM',
  UPDATE_RM: 'UPDATE_RM',
  DEACTIVATE_RM: 'DEACTIVATE_RM',
  GENERATE_OTP: 'GENERATE_OTP',
  CLEAR_OTP: 'CLEAR_OTP',
  INCREMENT_LOGIN_ATTEMPTS: 'INCREMENT_LOGIN_ATTEMPTS',
  RESET_LOGIN_ATTEMPTS: 'RESET_LOGIN_ATTEMPTS',
  SET_SESSION_TIMEOUT: 'SET_SESSION_TIMEOUT',
  CLEAR_SESSION_TIMEOUT: 'CLEAR_SESSION_TIMEOUT',
  ADD_APPLICATION: 'ADD_APPLICATION',
  UPDATE_APPLICATION: 'UPDATE_APPLICATION',
  ASSIGN_APPLICATION: 'ASSIGN_APPLICATION'
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        mfaRequired: false
      };

    case actionTypes.LOGIN_SUCCESS:
      console.log('🔄 LOGIN_SUCCESS reducer called with:', action.payload);
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        session: action.payload.session,
        tempCredentials: null,
        loginAttempts: 0
      };

    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        user: null,
        isAuthenticated: false,
        loginAttempts: state.loginAttempts + 1
      };

    case actionTypes.MFA_REQUIRED:
      return {
        ...state,
        mfaRequired: true,
        mfaMethod: action.payload.method,
        tempCredentials: action.payload.credentials,
        isLoading: false
      };

    case actionTypes.MFA_SUCCESS:
      console.log('🔄 MFA_SUCCESS reducer called');
      return {
        ...state,
        mfaRequired: false,
        currentOTP: null,
        otpExpiry: null
      };

    case actionTypes.MFA_FAILURE:
      return {
        ...state,
        currentOTP: null,
        otpExpiry: null
      };

    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        session: null,
        mfaRequired: false,
        tempCredentials: null,
        currentOTP: null,
        otpExpiry: null,
        sessionTimeout: null
      };

    case actionTypes.REGISTER_USER:
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.email]: action.payload
        }
      };

    case actionTypes.CREATE_RM:
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.email]: action.payload
        }
      };

    case actionTypes.UPDATE_RM:
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.email]: {
            ...state.users[action.payload.email],
            ...action.payload
          }
        }
      };

    case actionTypes.DEACTIVATE_RM:
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.email]: {
            ...state.users[action.payload.email],
            isActive: false
          }
        }
      };

    case actionTypes.GENERATE_OTP:
      return {
        ...state,
        currentOTP: action.payload.otp,
        otpExpiry: action.payload.expiry
      };

    case actionTypes.CLEAR_OTP:
      return {
        ...state,
        currentOTP: null,
        otpExpiry: null
      };

    case actionTypes.SET_SESSION_TIMEOUT:
      return {
        ...state,
        sessionTimeout: action.payload
      };

    case actionTypes.CLEAR_SESSION_TIMEOUT:
      return {
        ...state,
        sessionTimeout: null
      };

    case actionTypes.ADD_APPLICATION:
      return {
        ...state,
        applications: [...state.applications, action.payload]
      };

    case actionTypes.UPDATE_APPLICATION:
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id ? { ...app, ...action.payload } : app
        )
      };

    case actionTypes.ASSIGN_APPLICATION:
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.applicationId
            ? { ...app, assignedRM: action.payload.rmId }
            : app
        )
      };

    default:
      return state;
  }
}

// Action creators
export const authActions = {
  loginStart: () => ({ type: actionTypes.LOGIN_START }),
  
  loginSuccess: (user, session) => ({
    type: actionTypes.LOGIN_SUCCESS,
    payload: { user, session }
  }),
  
  loginFailure: () => ({ type: actionTypes.LOGIN_FAILURE }),
  
  mfaRequired: (method, credentials) => ({
    type: actionTypes.MFA_REQUIRED,
    payload: { method, credentials }
  }),
  
  mfaSuccess: () => ({ type: actionTypes.MFA_SUCCESS }),
  
  mfaFailure: () => ({ type: actionTypes.MFA_FAILURE }),
  
  logout: () => ({ type: actionTypes.LOGOUT }),
  
  registerUser: (userData) => ({
    type: actionTypes.REGISTER_USER,
    payload: userData
  }),
  
  createRM: (rmData) => ({
    type: actionTypes.CREATE_RM,
    payload: rmData
  }),
  
  updateRM: (rmData) => ({
    type: actionTypes.UPDATE_RM,
    payload: rmData
  }),
  
  deactivateRM: (email) => ({
    type: actionTypes.DEACTIVATE_RM,
    payload: { email }
  }),
  
  generateOTP: (otp, expiry) => ({
    type: actionTypes.GENERATE_OTP,
    payload: { otp, expiry }
  }),
  
  clearOTP: () => ({ type: actionTypes.CLEAR_OTP }),
  
  setSessionTimeout: (timeout) => ({
    type: actionTypes.SET_SESSION_TIMEOUT,
    payload: timeout
  }),
  
  clearSessionTimeout: () => ({ type: actionTypes.CLEAR_SESSION_TIMEOUT }),
  
  addApplication: (application) => ({
    type: actionTypes.ADD_APPLICATION,
    payload: application
  }),
  
  updateApplication: (application) => ({
    type: actionTypes.UPDATE_APPLICATION,
    payload: application
  }),
  
  assignApplication: (applicationId, rmId) => ({
    type: actionTypes.ASSIGN_APPLICATION,
    payload: { applicationId, rmId }
  })
};

// Context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Auto-logout after 15 minutes of inactivity
  useEffect(() => {
    if (state.isAuthenticated && !state.sessionTimeout) {
      const timeout = setTimeout(() => {
        dispatch(authActions.logout());
      }, 15 * 60 * 1000); // 15 minutes

      dispatch(authActions.setSessionTimeout(timeout));
    }

    return () => {
      if (state.sessionTimeout) {
        clearTimeout(state.sessionTimeout);
        dispatch(authActions.clearSessionTimeout());
      }
    };
  }, [state.isAuthenticated, state.sessionTimeout]);

  // Reset session timeout on any activity
  const resetSessionTimeout = () => {
    if (state.sessionTimeout) {
      clearTimeout(state.sessionTimeout);
    }
    
    if (state.isAuthenticated) {
      const timeout = setTimeout(() => {
        dispatch(authActions.logout());
      }, 15 * 60 * 1000);

      dispatch(authActions.setSessionTimeout(timeout));
    }
  };

  // Utility functions
  const generateOTP = () => {
    // For demo purposes, always use 111111
    const otp = "111111";
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    dispatch(authActions.generateOTP(otp, expiry));
    return otp;
  };

  const validateOTP = (inputOTP) => {
    const now = new Date();
    // For demo purposes, always accept 111111
    if (inputOTP === "111111") {
      return true;
    }
    return (
      state.currentOTP === inputOTP &&
      state.otpExpiry &&
      now < new Date(state.otpExpiry)
    );
  };

  const authenticate = async (email, password) => {
    dispatch(authActions.loginStart());

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = state.users[email];
    if (!user || user.password !== password || user.isActive === false) {
      dispatch(authActions.loginFailure());
      return { success: false, error: 'Invalid credentials' };
    }

    // Generate OTP for MFA
    const otp = generateOTP();
    console.log(`MFA Code for ${email}: ${otp}`); // In real app, send via SMS/email

    dispatch(authActions.mfaRequired('sms', { email, password }));
    return { success: true, mfaRequired: true, otp }; // Return OTP for demo purposes
  };

  const verifyMFA = async (inputOTP) => {
    console.log('🔐 verifyMFA called with:', inputOTP);
    console.log('🔐 Current state:', { 
      tempCredentials: state.tempCredentials, 
      mfaRequired: state.mfaRequired,
      isAuthenticated: state.isAuthenticated 
    });
    
    if (!validateOTP(inputOTP)) {
      console.log('❌ OTP validation failed');
      dispatch(authActions.mfaFailure());
      return { success: false, error: 'Invalid or expired code' };
    }

    const user = state.users[state.tempCredentials.email];
    console.log('👤 Found user:', user);
    
    const session = {
      token: 'mock_token_' + Date.now(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    console.log('🎯 Dispatching MFA success and login success');
    dispatch(authActions.mfaSuccess());
    dispatch(authActions.loginSuccess(user, session));
    dispatch(authActions.clearOTP());

    console.log('✅ verifyMFA returning success');
    return { success: true, user, session };
  };

  const register = async (userData) => {
    // Check if email already exists
    if (state.users[userData.email]) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser = {
      id: 'cust_' + Date.now(),
      ...userData,
      role: USER_ROLES.CUSTOMER,
      isExistingCustomer: false,
      mfaEnabled: true,
      createdAt: new Date().toISOString()
    };

    dispatch(authActions.registerUser(newUser));
    return { success: true, user: newUser };
  };

  const createRM = async (rmData) => {
    if (state.users[rmData.email]) {
      return { success: false, error: 'Email already exists' };
    }

    const newRM = {
      id: 'rm_' + Date.now(),
      ...rmData,
      role: USER_ROLES.RM,
      mfaEnabled: true,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    dispatch(authActions.createRM(newRM));
    return { success: true, rm: newRM };
  };

  const logout = () => {
    if (state.sessionTimeout) {
      clearTimeout(state.sessionTimeout);
    }
    dispatch(authActions.logout());
  };

  const hasPermission = (permission, context = {}) => {
    if (!state.user) return false;

    switch (state.user.role) {
      case USER_ROLES.SUPERUSER:
        return true; // Superusers have all permissions

      case USER_ROLES.RM:
        // Check RM specific permissions
        if (permission === 'view_application') {
          const { application } = context;
          if (!application) return false;

          const scope = state.user.accessScope;
          
          // Check product access
          if (scope.products && !scope.products.some(p => application.selectedProducts?.includes(p))) {
            return false;
          }

          // Check amount limits
          if (scope.maxAmount && application.totalAmount > scope.maxAmount) {
            return false;
          }

          return true;
        }
        return ['approve_application', 'decline_application', 'request_info'].includes(permission);

      case USER_ROLES.CUSTOMER:
        return ['create_application', 'view_own_applications', 'edit_draft_application'].includes(permission);

      default:
        return false;
    }
  };

  const value = {
    ...state,
    authenticate,
    verifyMFA,
    register,
    createRM,
    logout,
    generateOTP,
    validateOTP,
    hasPermission,
    resetSessionTimeout,
    dispatch
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
