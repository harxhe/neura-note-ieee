"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend integration will be handled by your teammate
    console.log('Login attempt:', { email, password });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="relative w-4/5 max-w-md mx-auto p-8 rounded-2xl shadow-2xl"
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
            Welcome to NeuraNote
          </h2>
          <p 
            className="text-lg"
            style={{ color: "#829577" }}
          >
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium mb-2"
              style={{ color: "#50614A" }}
            >
              Email / Username
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#CA8C71] transition-all"
              style={{
                borderColor: "#829577",
                backgroundColor: "#FFFFFF",
                color: "#000000"
              }}
              placeholder="Enter your email or username"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#CA8C71] transition-all"
              style={{
                borderColor: "#829577",
                backgroundColor: "#FFFFFF",
                color: "#000000"
              }}
              placeholder="Enter your password"
            />
          </div>

          {/* Login/Signup Button */}
          <Button
            type="submit"
            className="w-full py-3 text-lg font-medium rounded-lg border-2 transition-all hover:scale-105"
            style={{
              backgroundColor: "#CA8C71",
              borderColor: "#CA8C71",
              color: "#000000",
            }}
          >
            Login / Sign Up
          </Button>
        </form>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p 
            className="text-sm mb-2"
            style={{ color: "#829577" }}
          >
            New user? 
            <button
              onClick={onSwitchToSignup}
              className="ml-1 underline font-medium hover:no-underline transition-all"
              style={{ color: "#CA8C71" }}
            >
              Click here to register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 