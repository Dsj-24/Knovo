// components/ForgotPasswordModal.tsx

"use client";

import React, { useState, useEffect } from 'react';
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

  // Effect to handle closing the modal with the 'Escape' key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);


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
      onClose();
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        toast.error("The email address is not valid.");
      } else {
        toast.error(`An error occurred: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    // 1. Click the overlay to close
    <div 
      onClick={onClose} 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
    >
      {/* Stop propagation to prevent closing when clicking inside the modal */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative bg-white rounded-xl p-8 flex flex-col items-center gap-6 shadow-2xl border border-gray-100 w-full max-w-lg md:max-w-xl animate-slideIn"
      >
        {/* 2. Top-right "X" close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>

          <div className="flex w-full pt-2"> 
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors btn"
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