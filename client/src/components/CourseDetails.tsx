import React from 'react';
import TopicAccordion from './TopicAccordion';

const topics = [
  { topic: 'Topic 1', content: ['Content 1.1', 'Content 1.2'] },
  { topic: 'Topic 2', content: ['Content 2.1', 'Content 2.2'] },
  { topic: 'Topic 3', content: ['Content 3.1', 'Content 3.2'] },
  { topic: 'Topic 4', content: ['Content 4.1', 'Content 4.2'] },
  { topic: 'Topic 5', content: ['Content 5.1', 'Content 5.2'] },
];

interface CourseDetailsProps {
  title: string;
  onBack: () => void;
}

export default function CourseDetails({ title, onBack }: CourseDetailsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="rounded-full bg-[#E5BFAF] px-3 py-1 text-2xl mr-2 hover:bg-[#E5BFAF]/80"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-4xl font-bold tracking-tight text-black">
          {title}
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        {topics.map((t, idx) => (
          <TopicAccordion key={idx} topic={t.topic} content={t.content} />
        ))}
      </div>
    </div>
  );
} 