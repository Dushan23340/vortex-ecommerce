import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state (passed from registration or login)
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  // Determine the source of the verification request
  const isFromLogin = location.state?.fromLogin;
  const isFromRegistration = location.state?.fromRegistration;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }

    if (!email) {
      toast.error('Email is required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/user/verify-email', {
        code: verificationCode,
        email: email
      });

      if (response.data.success) {
        toast.success('Email verified successfully! Welcome to Vortex Clothing!');
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      toast.error('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setResendLoading(true);
      
      // Use the resend endpoint for both login and registration scenarios
      const response = await axios.post('/user/resend-verification', { email });
      
      if (response.data.success) {
        toast.success('New verification code sent to your email');
      } else {
        toast.error(response.data.message || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to resend verification code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
    setVerificationCode(value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Email Verification</h1>
        
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            {isFromLogin 
              ? "Your email address needs to be verified before you can log in."
              : "We've sent a 6-digit verification code to your email address."
            }
          </p>
          <p className="text-sm text-gray-500">
            {isFromLogin
              ? "Please check your email and enter the verification code below to complete the verification process."
              : "Please check your email and enter the code below."
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!location.state?.email && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={handleCodeChange}
              className="w-full px-3 py-3 text-center text-2xl font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest"
              placeholder="000000"
              maxLength="6"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the 6-digit code from your email
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || verificationCode.length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResendCode}
            disabled={resendLoading}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
          >
            {resendLoading ? 'Sending...' : 'Resend Code'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;