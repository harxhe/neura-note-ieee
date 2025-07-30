"use client"
import React, { useState } from 'react';

interface TopicAccordionProps {
  topic: string;
  content: string[];
}

export default function TopicAccordion({ topic, content }: TopicAccordionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-[#D1C7D7] text-xl font-medium text-black shadow transition border-2 border-transparent hover:border-[#B5A47A] focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{topic}</span>
        <span className={`transition-transform ${open ? 'rotate-90' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="bg-[#F3EAF7] rounded-b-xl px-8 py-4 mt-1">
          <ul className="list-disc ml-6 text-base text-black space-y-2">
            {content.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 