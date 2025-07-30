import React from 'react';

interface CourseCardProps {
  title: string;
  color: string;
  outlined?: boolean;
  onLearn: () => void;
}

export default function CourseCard({ title, color, outlined, onLearn }: CourseCardProps) {
  return (
    <div
      className={`rounded-2xl p-8 flex flex-col items-center justify-center min-w-[220px] min-h-[170px] shadow-sm transition border-2 ${color} ${outlined ? 'border-blue-500' : 'border-transparent'}`}
    >
      <h2 className="text-3xl font-semibold mb-6 text-black">{title}</h2>
      <button
        className="px-8 py-3 rounded-xl bg-[#F9E9DF] text-xl font-medium shadow border-2 border-[#E5BFAF] hover:bg-[#f3d6c2] transition"
        onClick={onLearn}
      >
        Learn
      </button>
    </div>
  );
} 