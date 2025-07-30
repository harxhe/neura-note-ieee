"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    userType: ''
  });
  const [showUserTypeOptions, setShowUserTypeOptions] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const userTypeOptions = ['Student', 'Teacher', 'Other'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.fullName && formData.email && formData.password && formData.userType) {
      // Backend integration will be handled by your teammate
      console.log('Signup attempt:', formData);
      setIsVerificationSent(true);
    }
  };

  const isFormValid = formData.username && formData.fullName && formData.email && formData.password && formData.userType;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="relative w-4/5 max-w-md mx-auto p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#FFF1E8" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
          style={{ color: "#50614A" }}
        >
          ×
        </button>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ color: "#50614A" }}
          >
            Join NeuraNote
          </h2>
          <p 
            className="text-lg"
            style={{ color: "#829577" }}
          >
            Create your account to start learning
          </p>
        </div>

        {!isVerificationSent ? (
          /* Signup Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium mb-2"
                style={{ color: "#50614A" }}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#CA8C71] transition-all"
                style={{
                  borderColor: "#829577",
                  backgroundColor: "#FFFFFF",
                  color: "#000000"
                }}
                placeholder="Choose a username"
              />
            </div>

            {/* Full Name Field */}
            <div>
              <label 
                htmlFor="fullName" 
                className="block text-sm font-medium mb-2"
                style={{ color: "#50614A" }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#CA8C71] transition-all"
                style={{
                  borderColor: "#829577",
                  backgroundColor: "#FFFFFF",
                  color: "#000000"
                }}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
                style={{ color: "#50614A" }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#CA8C71] transition-all"
                style={{
                  borderColor: "#829577",
                  backgroundColor: "#FFFFFF",
                  color: "#000000"
                }}
                placeholder="Enter your email address"
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2"
                style={{ color: "#50614A" }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#CA8C71] transition-all"
                style={{
                  borderColor: "#829577",
                  backgroundColor: "#FFFFFF",
                  color: "#000000"
                }}
                placeholder="Create a strong password"
              />
            </div>

            {/* User Type Field */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: "#50614A" }}
              >
                What are you going to use this for?
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserTypeOptions(!showUserTypeOptions)}
                  className="w-full px-4 py-3 rounded-lg border-2 text-left focus:outline-none focus:ring-2 focus:ring-[#CA8C71] transition-all"
                  style={{
                    borderColor: "#829577",
                    backgroundColor: "#FFFFFF",
                    color: formData.userType ? "#000000" : "#829577"
                  }}
                >
                  {formData.userType || "Select your role"}
                </button>
                
                {showUserTypeOptions && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 rounded-lg shadow-lg"
                       style={{ borderColor: "#829577" }}>
                    {userTypeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          handleInputChange('userType', option);
                          setShowUserTypeOptions(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        style={{ color: "#000000" }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full py-3 text-lg font-medium rounded-lg border-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isFormValid ? "#CA8C71" : "#829577",
                borderColor: isFormValid ? "#CA8C71" : "#829577",
                color: "#000000",
              }}
            >
              Create Account
            </Button>
          </form>
        ) : (
          /* Verification Sent Message */
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">📧</div>
            <h3 
              className="text-2xl font-bold"
              style={{ color: "#50614A" }}
            >
              Verification Email Sent!
            </h3>
            <p 
              className="text-lg"
              style={{ color: "#829577" }}
            >
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>
            <p 
              className="text-sm"
              style={{ color: "#829577" }}
            >
              Please check your email and click the verification link to complete your registration.
            </p>
            <Button
              onClick={onClose}
              className="px-8 py-3 text-lg font-medium rounded-lg border-2 transition-all hover:scale-105"
              style={{
                backgroundColor: "#CA8C71",
                borderColor: "#CA8C71",
                color: "#000000",
              }}
            >
              Got it!
            </Button>
          </div>
        )}

        {/* Switch to Login */}
        {!isVerificationSent && (
          <div className="mt-6 text-center">
            <p 
              className="text-sm"
              style={{ color: "#829577" }}
            >
              Already have an account? 
              <button
                onClick={onSwitchToLogin}
                className="ml-1 underline font-medium hover:no-underline transition-all"
                style={{ color: "#CA8C71" }}
              >
                Sign in here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 