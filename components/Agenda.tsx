import React from 'react';
import { Task, TaskType } from '../types';
import Card from './shared/Card';
// FIX: Import `CalendarDaysIcon` to fix the 'Cannot find name' error.
import { ClockIcon, PlusIcon, StarIcon, CalendarDaysIcon } from './icons';
import Button from './shared/Button';

interface AgendaProps {
    tasks: Task[];
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const getTaskStyle = (type: TaskType) => {
    switch (type) {
        case TaskType.Task: return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', accent: 'bg-blue-500' };
        case TaskType.Meeting: return { bg: 'bg-violet-500/10', border: 'border-violet-500/20', accent: 'bg-violet-500' };
        case TaskType.Break: return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', accent: 'bg-emerald-500' };
    }
}

const TaskItem: React.FC<{ task: Task, onUpdateTask: (taskId: string, updates: Partial<Task>) => void }> = ({ task, onUpdateTask }) => {
    const style = getTaskStyle(task.type);
    
    return (
        <div className="flex items-start space-x-4 animate-fade-in">
             <div className="flex flex-col items-center flex-shrink-0 pt-1">
                <span className="text-sm font-semibold text-muted-foreground">{task.time}</span>
                <div className="w-px flex-grow bg-border my-2"></div>
            </div>
            <div className={`relative w-full p-4 rounded-lg -mt-1 ${style.bg} border ${style.border}`}>
                <div className={`absolute top-4 -left-px w-1 h-8 rounded-r-full ${style.accent}`}></div>
                 <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-card-foreground">{task.title}</h4>
                        {task.notes && <p className="text-sm text-muted-foreground mt-1">{task.notes}</p>}
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <ClockIcon className="w-4 h-4 mr-1.5" />
                            <span>{task.duration} minutes</span>
                        </div>
                    </div>
                    <Button
                        onClick={() => onUpdateTask(task.id, { isPriority: !task.isPriority })}
                        title={task.isPriority ? "Remove from priority" : "Mark as priority"}
                        variant="ghost"
                        className={`p-1 rounded-full !w-8 !h-8 ${task.isPriority ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}`}
                    >
                        <StarIcon className="w-5 h-5" fill={task.isPriority ? 'currentColor' : 'none'} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

const Agenda: React.FC<AgendaProps> = ({ tasks, onUpdateTask }) => {
    return (
        <Card className="h-full max-h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Today's Agenda</h2>
                <Button onClick={() => { /* TODO: Open add task modal */ }}>
                    <PlusIcon className="w-5 h-5" /> Add Task
                </Button>
            </div>
            <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                {tasks.length > 0 ? (
                    <div className="relative space-y-6">
                         <div className="absolute left-[29px] top-2 bottom-2 w-px bg-border -z-10"></div>
                        {tasks.sort((a,b) => a.time.localeCompare(b.time)).map(task => <TaskItem key={task.id} task={task} onUpdateTask={onUpdateTask} />)}
                    </div>
                ) : (
                    <div className="text-center h-full flex flex-col justify-center items-center text-muted-foreground">
                        <CalendarDaysIcon className="w-16 h-16 text-border" />
                        <p className="mt-4 font-semibold">No tasks for today.</p>
                        <p className="text-sm">Click 'Add Task' to plan your day.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default Agenda;