import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, USER_ROLES } from '../../context/AuthContext';
import {
  ShieldCheckIcon,
  ArrowLeftIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

function MFAVerify() {
  const navigate = useNavigate();
  const { verifyMFA, generateOTP, tempCredentials, mfaRequired, isLoading } =
    useAuth();

  const [otpCode, setOtpCode] = useState('');
  const [errors, setErrors] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if MFA not required
  useEffect(() => {
    if (!mfaRequired || !tempCredentials) {
      navigate('/login');
    }
  }, [mfaRequired, tempCredentials, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setErrors({
        expired:
          'Your verification code has expired. Please request a new one.',
      });
    }
  }, [timeLeft]);

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      setErrors({ otp: 'Please enter a 6-digit verification code' });
      return;
    }

    if (timeLeft <= 0) {
      setErrors({
        expired:
          'Your verification code has expired. Please request a new one.',
      });
      return;
    }

    try {
      console.log('🔐 MFA: Calling verifyMFA with code:', otpCode);
      const result = await verifyMFA(otpCode);
      console.log('🔐 MFA: verifyMFA result:', result);

      if (result.success) {
        // Redirect based on user role
        const userRole = result.user.role;
        console.log('🔐 MFA: Success, user role:', userRole, 'redirecting...');

        // Small delay to ensure state is updated
        setTimeout(() => {
          switch (userRole) {
            case USER_ROLES.CUSTOMER:
              console.log('🔐 MFA: Navigating to /customer/dashboard');
              navigate('/customer/dashboard');
              break;
            case USER_ROLES.RM:
              console.log('🔐 MFA: Navigating to /rm/dashboard');
              navigate('/rm/dashboard');
              break;
            case USER_ROLES.SUPERUSER:
              console.log('🔐 MFA: Navigating to /admin/dashboard');
              navigate('/admin/dashboard');
              break;
            default:
              console.log('🔐 MFA: Unknown role, navigating to /');
              navigate('/');
          }
        }, 100); // 100ms delay
      } else {
        setAttempts((prev) => prev + 1);
        setErrors({ otp: result.error });

        if (attempts >= 2) {
          setErrors({
            locked:
              'Too many failed attempts. Please restart the login process.',
          });
          setTimeout(() => navigate('/login'), 3000);
        }
      }
    } catch (error) {
      setErrors({ otp: 'Verification failed. Please try again.' });
    }
  };

  const handleResendCode = async () => {
    if (!canResend || resendCooldown > 0) return;

    try {
      generateOTP(); // Generate new OTP
      console.log(`Demo MFA Code: 111111 (always use this for demo)`); // For demo purposes

      setTimeLeft(300); // Reset timer
      setCanResend(false);
      setResendCooldown(30); // 30 second cooldown
      setErrors({});
      setOtpCode('');

      // Show success message
      setErrors({
        success:
          'A new verification code has been sent to your registered device.',
      });
    } catch (error) {
      setErrors({ resend: 'Failed to resend code. Please try again.' });
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskedContact = tempCredentials?.email
    ? tempCredentials.email.replace(/(.{2}).*(@.*)/, '$1***$2')
    : '***@***.com';

  if (!mfaRequired) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <ShieldCheckIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Multi-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit code to {maskedContact}
          </p>
        </div>

        {/* Timer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">
              Code expires in: {formatTime(timeLeft)}
            </span>
          </div>
          <p className="text-xs text-blue-600">
            Enter the code before it expires for security
          </p>
        </div>

        {/* MFA Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 text-center"
            >
              Enter 6-digit verification code
            </label>
            <div className="mt-2">
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="6"
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtpCode(value);
                  if (errors.otp) {
                    setErrors((prev) => ({ ...prev, otp: undefined }));
                  }
                }}
                className={`block w-full px-3 py-3 text-center text-2xl tracking-widest border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.otp ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="000000"
                disabled={isLoading || timeLeft <= 0}
                autoComplete="one-time-code"
              />
            </div>
            {errors.otp && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {errors.otp}
              </p>
            )}
          </div>

          {/* Error Messages */}
          {errors.expired && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm text-red-600">{errors.expired}</p>
              </div>
            </div>
          )}

          {errors.locked && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm text-red-600">{errors.locked}</p>
              </div>
            </div>
          )}

          {errors.success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-600">{errors.success}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={
                isLoading ||
                timeLeft <= 0 ||
                otpCode.length !== 6 ||
                errors.locked
              }
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ||
                timeLeft <= 0 ||
                otpCode.length !== 6 ||
                errors.locked
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Code'
              )}
            </button>
          </div>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={!canResend || resendCooldown > 0}
                className={`font-medium ${
                  canResend && resendCooldown === 0
                    ? 'text-blue-600 hover:text-blue-500'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {resendCooldown > 0
                  ? `Resend code (${resendCooldown}s)`
                  : 'Resend code'}
              </button>
            </p>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to login
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This can be approved by Bank App or user can setup an MFA app
          </p>
        </div>

        {/* Attempts Warning */}
        {attempts > 0 && attempts < 3 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-700">
              {3 - attempts} attempt{3 - attempts !== 1 ? 's' : ''} remaining
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MFAVerify;
