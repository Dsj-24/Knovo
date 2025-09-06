// components/ForgotPasswordModal.tsx

"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { auth } from '@/firebase/client';
import { sendPasswordResetEmail } from 'firebase/auth';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent! Please check your email inbox (and spam folder).");
      onClose(); // Close the modal on success
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        toast.error("The email address is not valid.");
      } else {
        toast.error(`An error occurred: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
      setEmail('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-6 shadow-2xl border border-gray-100 w-full max-w-lg md:max-w-xl animate-slideIn"> {/* Adjusted max-w-md to max-w-lg or md:max-w-xl for a wider modal */}
        <h2 className="text-2xl font-bold text-gray-800">Reset Your Password</h2>
        <p className="text-center text-gray-600">
          Enter the email address associated with your account, and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleResetPassword} className="w-full mt-4 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Added some input styling for better appearance
            />
          </div>

          {/* This flex container ensures buttons are side-by-side and take full width */}
          <div className="flex gap-4 w-full"> 
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors btn" // Adjusted button styling, ensure 'btn' is correctly applying your custom styles
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;