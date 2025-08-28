import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const OrderVerificationModal = ({ 
  isOpen, 
  onClose, 
  orderData, 
  onVerificationSuccess,
  backendUrl,
  token 
}) => {
  const [step, setStep] = useState(1); // 1: Send code, 2: Verify code
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setVerificationCode('');
      setVerificationId('');
      setIsLoading(false);
      setResendTimer(0);
      setCanResend(true);
    }
  }, [isOpen]);

  // Resend timer effect
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const sendVerificationCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/order/send-verification`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setVerificationId(response.data.verificationId);
        setStep(2);
        setCanResend(false);
        setResendTimer(60); // 60 seconds cooldown
        toast.success('Verification code sent to your email!');
      } else {
        toast.error(response.data.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Send verification error:', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/order/verify-code`, {
        verificationId,
        verificationCode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Email verified successfully!');
        onVerificationSuccess(verificationId);
        onClose();
      } else {
        toast.error(response.data.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Verify code error:', error);
      toast.error('Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    await sendVerificationCode();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {step === 1 ? 'Email Verification Required' : 'Enter Verification Code'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {step === 1 ? (
          <div>
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                To ensure order security, we need to verify your email address before processing your order.
              </p>
              
              <div className="bg-gray-50 p-3 rounded mb-4">
                <h4 className="font-medium text-sm mb-2">Order Summary:</h4>
                <p className="text-sm text-gray-600">Email: {orderData.deliveryInfo?.email}</p>
                <p className="text-sm text-gray-600">Total: Rs. {orderData.totalAmount?.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Payment: {orderData.paymentMethod?.toUpperCase()}</p>
              </div>

              <p className="text-sm text-gray-500">
                A verification code will be sent to your email address.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={sendVerificationCode}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                We've sent a 6-digit verification code to <strong>{orderData.deliveryInfo?.email}</strong>
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                />
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResend}
                  disabled={!canResend || isLoading}
                  className={`text-sm font-medium ${
                    canResend && !isLoading
                      ? 'text-black hover:underline'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!canResend ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                ⚠️ This code will expire in 10 minutes
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={verifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderVerificationModal;