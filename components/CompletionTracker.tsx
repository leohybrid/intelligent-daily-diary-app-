import React, { useState, useMemo } from 'react';
import { Task, TaskStatus } from '../types';
import Card from './shared/Card';
import Button from './shared/Button';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon, SparklesIcon } from './icons';
import { getCompletionAnalysis } from '../services/geminiService';

interface CompletionTrackerProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const CompletionTracker: React.FC<CompletionTrackerProps> = ({ tasks, onUpdateTask }) => {
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const completionRate = useMemo(() => {
    const totalTasks = tasks.length;
    if (totalTasks === 0) return 0;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.Completed).length;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [tasks]);

  const handleGenerateAnalysis = async () => {
    setIsLoading(true);
    setAiAnalysis('');
    const result = await getCompletionAnalysis(tasks);
    setAiAnalysis(result);
    setIsLoading(false);
  };

  return (
    <Card className="h-full max-h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Completion Tracker</h2>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="bg-muted p-3 rounded-lg animate-fade-in">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${task.status === TaskStatus.Completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>{task.title}</span>
              <div className="flex items-center space-x-1">
                <Button 
                    variant="ghost" 
                    className="!p-1.5"
                    onClick={() => onUpdateTask(task.id, { status: task.status === TaskStatus.Completed ? TaskStatus.Pending : TaskStatus.Completed })}
                >
                  <CheckCircleIcon className={`w-6 h-6 ${task.status === TaskStatus.Completed ? 'text-green-500' : 'text-muted-foreground hover:text-green-500'}`} />
                </Button>
                <Button 
                    variant="ghost" 
                    className="!p-1.5"
                    onClick={() => onUpdateTask(task.id, { status: task.status === TaskStatus.Unachieved ? TaskStatus.Pending : TaskStatus.Unachieved })}
                >
                  <XCircleIcon className={`w-6 h-6 ${task.status === TaskStatus.Unachieved ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`} />
                </Button>
              </div>
            </div>
            {task.status === TaskStatus.Unachieved && (
              <div className="mt-2 flex items-center gap-2 animate-fade-in">
                <input
                  type="text"
                  placeholder="Reason for not completing (optional)"
                  value={task.reason || ''}
                  onChange={(e) => onUpdateTask(task.id, { reason: e.target.value })}
                  className="w-full bg-background text-xs p-2 rounded-md border border-border focus:ring-1 focus:ring-ring outline-none"
                />
                <Button onClick={() => alert('Reschedule feature coming soon!')} variant="ghost" className="p-1 text-xs whitespace-nowrap text-muted-foreground"><ArrowPathIcon className="w-4 h-4"/> Reschedule</Button>
              </div>
            )}
          </div>
        ))}
         {tasks.length === 0 && <p className="text-center text-muted-foreground py-10">No tasks to track today.</p>}
      </div>
      <div className="mt-auto pt-6 border-t border-border">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Daily Progress</h3>
            <span className="font-bold text-lg text-primary">{completionRate}% Complete</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
        </div>

        <div className="mt-6">
          <Button onClick={handleGenerateAnalysis} disabled={isLoading || tasks.length === 0} className="w-full">
            <SparklesIcon className="w-5 h-5"/> {isLoading ? 'Analyzing...' : 'AI Improvement Suggestions'}
          </Button>
          {aiAnalysis && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-800 dark:text-blue-200 animate-fade-in">
              {aiAnalysis}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CompletionTracker;
