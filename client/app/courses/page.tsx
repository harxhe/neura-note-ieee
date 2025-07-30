"use client"
import React, { useState } from 'react';
import CourseToggle from '@/components/CourseToggle';
import PrelistedCourses from '@/components/PrelistedCourses';
import CourseDetails from '@/components/CourseDetails';
import AICourseGenerator from '@/components/AICourseGenerator';

export default function CoursesPage() {
  const [mode, setMode] = useState<'prelisted' | 'ai'>('prelisted');
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F9E9DF] px-4 py-6 flex flex-col items-center">
      {/* Top Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-4">
        <button
          className="rounded-full bg-[#E5BFAF] px-3 py-1 text-2xl hover:bg-[#E5BFAF]/80"
          aria-label="Back"
          onClick={() => window.history.back()}
        >
          ←
        </button>
        <h1 className="text-5xl font-extrabold text-center flex-1">{mode === 'prelisted' ? (selectedCourse === null ? 'Prelisted Courses' : 'Course Details') : 'AI Course Generator'}</h1>
        <CourseToggle value={mode} onChange={val => { setMode(val); setSelectedCourse(null); }} />
      </div>

      {/* Main Content */}
      <div className="w-full">
        {mode === 'prelisted' ? (
          selectedCourse === null ? (
            <PrelistedCourses onSelectCourse={setSelectedCourse} />
          ) : (
            <CourseDetails title={`Course ${selectedCourse + 1}`} onBack={() => setSelectedCourse(null)} />
          )
        ) : (
          <AICourseGenerator />
        )}
      </div>
    </div>
  );
} 