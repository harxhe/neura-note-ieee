"use client"

import React from 'react';

// Types for props (to be implemented by logic/backend team)
interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'top' | 'must' | 'should' | 'could';
}

interface TodoListPageProps {
  tasks: Task[];
  onBack: () => void;
  onTaskInputChange: (value: string) => void;
  onPriorityChange: (priority: Task['priority']) => void;
  onAddTask: () => void;
  onToggleTask: (id: string) => void;
  newTaskText: string;
  newTaskPriority: Task['priority'];
}

const PRIORITY_LABELS = {
  top: 'top priorities',
  must: 'must do',
  should: 'should do',
  could: 'could do',
};

const PRIORITY_COLORS = {
  top: 'bg-[#F8D9C5] border-[#E5BFAF]',
  must: 'bg-[#F8B5B5] border-[#E5A1A1]',
  should: 'bg-[#F8B5B5] border-[#E5A1A1]',
  could: 'bg-[#E8D1B5] border-[#B5A47A]',
};

export default function TodoListPage({
  tasks,
  onBack,
  onTaskInputChange,
  onPriorityChange,
  onAddTask,
  onToggleTask,
  newTaskText,
  newTaskPriority,
}: TodoListPageProps) {
  return (
    <div className="min-h-screen bg-[#F9E9DF] px-4 py-6 flex flex-col items-center">
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex items-center mb-8">
        <button
          onClick={onBack}
          className="rounded-full bg-[#E5BFAF] px-3 py-1 text-2xl mr-2 hover:bg-[#E5BFAF]/80"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="flex-1 text-center text-5xl font-extrabold tracking-tight text-black">
          To-Do list
        </h1>
      </div>

      {/* Task Entry */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-3 mb-8">
        <input
          type="text"
          value={newTaskText}
          onChange={e => onTaskInputChange(e.target.value)}
          placeholder="Enter a task..."
          className="flex-1 px-4 py-3 rounded-lg border-2 border-[#E5BFAF] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#CA8C71]"
        />
        <select
          value={newTaskPriority}
          onChange={e => onPriorityChange(e.target.value as Task['priority'])}
          className="px-4 py-3 rounded-lg border-2 border-[#E5BFAF] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#CA8C71]"
        >
          <option value="top">Top priorities</option>
          <option value="must">Must do</option>
          <option value="should">Should do</option>
          <option value="could">Could do</option>
        </select>
        <button
          onClick={onAddTask}
          className="px-6 py-3 rounded-lg bg-[#CA8C71] text-black font-semibold border-2 border-[#CA8C71] hover:bg-[#b97a5c] transition"
        >
          Add
        </button>
      </div>

      {/* Task Lists */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top priorities & Must do */}
        <div className="flex flex-col gap-6">
          <TaskBox
            title={PRIORITY_LABELS.top}
            colorClass={PRIORITY_COLORS.top}
            tasks={tasks.filter(t => t.priority === 'top')}
            onToggleTask={onToggleTask}
          />
          <TaskBox
            title={PRIORITY_LABELS.should}
            colorClass={PRIORITY_COLORS.should}
            tasks={tasks.filter(t => t.priority === 'should')}
            onToggleTask={onToggleTask}
          />
        </div>
        {/* Must do & Could do */}
        <div className="flex flex-col gap-6">
          <TaskBox
            title={PRIORITY_LABELS.must}
            colorClass={PRIORITY_COLORS.must}
            tasks={tasks.filter(t => t.priority === 'must')}
            onToggleTask={onToggleTask}
          />
          <TaskBox
            title={PRIORITY_LABELS.could}
            colorClass={PRIORITY_COLORS.could + ' border-2 border-blue-500'}
            tasks={tasks.filter(t => t.priority === 'could')}
            onToggleTask={onToggleTask}
          />
        </div>
      </div>
    </div>
  );
}

// TaskBox: Presentational only
function TaskBox({ title, colorClass, tasks, onToggleTask }: {
  title: string;
  colorClass: string;
  tasks: Task[];
  onToggleTask: (id: string) => void;
}) {
  return (
    <div className={`rounded-2xl p-6 border-2 ${colorClass} min-h-[170px]`}>
      <h2 className="text-xl font-semibold mb-4 text-center text-black">{title}</h2>
      <ul className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <li className="text-gray-400 text-center">No tasks</li>
        ) : (
          tasks.map(task => (
            <li key={task.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                className="w-5 h-5 rounded border-2 border-[#E5BFAF] accent-[#CA8C71]"
              />
              <span className={`text-black ${task.completed ? 'line-through opacity-60' : ''}`}>{task.text}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
} 