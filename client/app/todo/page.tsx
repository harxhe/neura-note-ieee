"use client"
import TodoListPage from '@/components/TodoListPage';

// Demo/mock data and no-op handlers for UI preview
const mockTasks = [
  { id: '1', text: 'Finish project report', completed: false, priority: 'top' as const },
  { id: '2', text: 'Buy groceries', completed: true, priority: 'must' as const },
  { id: '3', text: 'Read a book', completed: false, priority: 'should' as const },
  { id: '4', text: 'Call a friend', completed: false, priority: 'could' as const },
];

export default function TodoDemoPage() {
  return (
    <TodoListPage
      tasks={mockTasks}
      onBack={() => alert('Back button pressed')}
      onTaskInputChange={() => {}}
      onPriorityChange={() => {}}
      onAddTask={() => {}}
      onToggleTask={() => {}}
      newTaskText=""
      newTaskPriority="top"
    />
  );
} 