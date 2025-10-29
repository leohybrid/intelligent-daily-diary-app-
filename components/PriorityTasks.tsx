import React from 'react';
import { Task } from '../types';
import Card from './shared/Card';
import { StarIcon } from './icons';
import Button from './shared/Button';

interface PriorityTasksProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const PriorityTasks: React.FC<PriorityTasksProps> = ({ tasks, onUpdateTask }) => {
  const priorityTasks = tasks.filter(task => task.isPriority);

  return (
    <Card className="w-full">
      <h3 className="font-bold text-lg mb-4">Priority Tasks</h3>
      {priorityTasks.length > 0 ? (
        <ul className="space-y-2">
          {priorityTasks.map(task => (
            <li key={task.id} className="flex items-center justify-between bg-yellow-500/10 p-2 rounded-lg animate-fade-in">
              <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">{task.title}</span>
              <Button 
                variant='ghost'
                className="!p-1"
                onClick={() => onUpdateTask(task.id, { isPriority: false })}
                title="Remove from priority"
              >
                <StarIcon className="w-5 h-5 text-yellow-500" fill="currentColor" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-center text-muted-foreground py-4">Mark any task with a star to see it here.</p>
      )}
    </Card>
  );
};

export default PriorityTasks;
