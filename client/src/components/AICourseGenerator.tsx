"use client"
import React, { useState } from 'react';

export default function AICourseGenerator() {
  const [prompt, setPrompt] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 flex flex-col items-center">
      <img src="/robot.png" alt="AI Assistant" className="w-40 h-40 mb-6" />
      <h1 className="text-4xl font-extrabold text-center mb-8" style={{ fontFamily: 'cursive' }}>
        Hello, I am Nova<br />Your personal focus assistant
      </h1>
      <form
        className="w-full flex items-center gap-2 mb-8"
        onSubmit={e => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="enter your question..."
          className="flex-1 px-4 py-3 rounded-full border-2 border-[#E5BFAF] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#CA8C71] text-lg"
        />
        <button
          type="submit"
          className="rounded-full bg-[#F8B5B5] w-12 h-12 flex items-center justify-center text-2xl shadow hover:bg-[#f3d6c2] transition"
        >
          <span className="text-[#B58B7A]">↑</span>
        </button>
      </form>
      {submitted && (
        <div className="w-full bg-[#F3EAF7] rounded-xl p-8 text-center text-lg text-gray-500">
          <p>AI-generated course content will appear here.</p>
        </div>
      )}
    </div>
  );
} 