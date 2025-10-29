import React, { useState, useEffect, useMemo } from 'react';
import Card from './shared/Card';
import Button from './shared/Button';
import { Task, TaskStatus, Mood } from '../types';
import { getDailyBriefing } from '../services/geminiService';
import { SparklesIcon, CalendarDaysIcon, CheckBadgeIcon, ClockIcon, LightBulbIcon } from './icons';

interface HomeProps {
    tasks: Task[];
    mood: Mood;
}

const Home: React.FC<HomeProps> = ({ tasks, mood }) => {
    const [briefing, setBriefing] = useState('');
    const [isLoadingBriefing, setIsLoadingBriefing] = useState(true);
    
    const { upcomingTasks, completedTasks, totalTasks } = useMemo(() => {
        return {
            upcomingTasks: tasks.filter(t => t.status === TaskStatus.Pending).length,
            completedTasks: tasks.filter(t => t.status === TaskStatus.Completed).length,
            totalTasks: tasks.length
        }
    }, [tasks]);

    const todayDate = useMemo(() => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, []);

    const generateBriefing = async () => {
        setIsLoadingBriefing(true);
        const result = await getDailyBriefing(tasks);
        setBriefing(result);
        setIsLoadingBriefing(false);
    };

    useEffect(() => {
        generateBriefing();
    }, [tasks]);

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold">Welcome Back!</h1>
                <p className="text-muted-foreground mt-2">Here's your dashboard for {todayDate}.</p>
            </div>

            <Card className="bg-primary/5 border-primary/20">
                <div className="flex items-start gap-4">
                    <LightBulbIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                        <h2 className="text-xl font-bold">AI Daily Briefing</h2>
                        {isLoadingBriefing && <p className="mt-2 text-muted-foreground">Generating your focus for today...</p>}
                        {briefing && !isLoadingBriefing && <p className="mt-2 text-lg text-foreground">{briefing}</p>}
                         <Button onClick={generateBriefing} variant="ghost" disabled={isLoadingBriefing} className="!p-0 h-auto mt-2 text-sm">
                             <SparklesIcon className="w-4 h-4" /> Regenerate
                         </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<CalendarDaysIcon className="w-6 h-6 text-blue-500" />} label="Total Tasks" value={totalTasks} color="blue" />
                <StatCard icon={<ClockIcon className="w-6 h-6 text-yellow-500" />} label="Upcoming" value={upcomingTasks} color="yellow" />
                <StatCard icon={<CheckBadgeIcon className="w-6 h-6 text-green-500" />} label="Completed" value={completedTasks} color="green" />
                <StatCard icon={<span className="text-2xl">{mood}</span>} label="Current Mood" value={mood} color="violet" />
            </div>
        </div>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: 'blue' | 'yellow' | 'green' | 'violet';
}
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
    const colorClasses = {
        blue: 'bg-blue-500/10',
        yellow: 'bg-yellow-500/10',
        green: 'bg-green-500/10',
        violet: 'bg-violet-500/10',
    }
    return (
        <Card>
            <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground">{label}</h3>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
            </div>
        </Card>
    );
}

export default Home;
