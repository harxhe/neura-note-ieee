import React from 'react';
import CourseCard from './CourseCard';

const courses = [
  { title: 'Course', color: 'bg-[#B7D7B0]' },
  { title: 'Course', color: 'bg-[#D1B7A0] border-blue-500' },
  { title: 'Course', color: 'bg-[#F8B5B5]' },
  { title: 'Course', color: 'bg-[#D1B7A0]' },
];

interface PrelistedCoursesProps {
  onSelectCourse: (idx: number) => void;
}

export default function PrelistedCourses({ onSelectCourse }: PrelistedCoursesProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8">
      {courses.map((course, idx) => (
        <CourseCard
          key={idx}
          title={course.title}
          color={course.color}
          outlined={idx === 1}
          onLearn={() => onSelectCourse(idx)}
        />
      ))}
    </div>
  );
} 