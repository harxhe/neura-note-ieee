"use client"
import React from 'react';

interface CourseToggleProps {
  value: 'prelisted' | 'ai';
  onChange: (val: 'prelisted' | 'ai') => void;
}

export default function CourseToggle({ value, onChange }: CourseToggleProps) {
  return (
    <div className="flex items-center gap-4">
      <span className={`text-lg font-medium ${value === 'prelisted' ? 'text-black' : 'text-gray-400'}`}>Prelisted</span>
      <button
        className={`relative w-14 h-7 rounded-full transition bg-[#F8B5B5] focus:outline-none`}
        aria-label="Toggle course mode"
        onClick={() => onChange(value === 'prelisted' ? 'ai' : 'prelisted')}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full transition-all duration-200 shadow-md ${value === 'prelisted' ? 'bg-[#CA8C71] translate-x-0' : 'bg-[#B58B7A] translate-x-7'}`}
          style={{ boxShadow: '0 2px 4px #0001' }}
        />
      </button>
      <span className={`text-lg font-medium ${value === 'ai' ? 'text-black' : 'text-gray-400'}`}>AI</span>
    </div>
  );
} 