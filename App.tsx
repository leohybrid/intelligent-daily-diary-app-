import React, { useState } from 'react';
import { Task, Achievement, Mood, FinancialTransaction, View, TaskType, TaskStatus, FinancialCategory } from './types';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Agenda from './components/Agenda';
import CompletionTracker from './components/CompletionTracker';
import Highlights from './components/Highlights';
import PersonalJournal from './components/PersonalJournal';
import PriorityTasks from './components/PriorityTasks';
import Finances from './components/Finances';
import Settings from './components/Settings';
import StarryNight from './components/StarryNight';

// Mock Data
const createInitialTasks = (): Task[] => [
    { id: '1', title: 'Morning Stand-up', type: TaskType.Meeting, time: '09:00', duration: 15, notes: 'Project Phoenix stand-up.', status: TaskStatus.Completed, isPriority: false },
    { id: '2', title: 'Develop new feature', type: TaskType.Task, time: '09:30', duration: 120, notes: 'Work on the user authentication flow.', status: TaskStatus.Completed, isPriority: true },
    { id: '3', title: 'Lunch Break', type: TaskType.Break, time: '12:30', duration: 60, status: TaskStatus.Completed, isPriority: false },
    { id: '4', title: 'Code Review', type: TaskType.Task, time: '14:00', duration: 45, notes: 'Review PR from Jane.', status: TaskStatus.Pending, isPriority: true },
    { id: '5', title: 'Team Sync', type: TaskType.Meeting, time: '15:00', duration: 30, notes: 'Discuss Q4 roadmap.', status: TaskStatus.Pending, isPriority: false },
];

const createInitialAchievements = (): Achievement[] => [
    { id: '1', text: 'Shipped the new authentication feature ahead of schedule.' },
    { id: '2', text: 'Received positive feedback on the UI mockups.' },
    { id: '3', text: '' },
];

const createInitialTransactions = (): FinancialTransaction[] => [
    { id: '1', type: 'EXPENSE', category: 'Food', amount: 15.75, date: '2025-10-29', description: 'Coffee and Sandwich' },
    { id: '2', type: 'EXPENSE', category: 'Transport', amount: 22.50, date: '2025-10-29', description: 'Gasoline' },
    { id: '3', type: 'INCOME', category: 'Salary', amount: 1500, date: '2025-10-29', description: 'Bi-weekly Paycheck' },
];


function App() {
  const [tasks, setTasks] = useState<Task[]>(createInitialTasks);
  const [achievements, setAchievements] = useState<Achievement[]>(createInitialAchievements);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(createInitialTransactions);
  const [mood, setMood] = useState<Mood>(Mood.Happy);
  const [journalNotes, setJournalNotes] = useState("It was a productive day. The new feature is coming along well, but I'm a bit stuck on a tricky bug. Had a good lunch with the team. Feeling optimistic about the Q4 roadmap.");
  const [currentView, setCurrentView] = useState<View>('Home');

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };
  
  const handleUpdateAchievement = (achievementId: string, text: string) => {
    setAchievements(currentAchievements =>
        currentAchievements.map(ach =>
            ach.id === achievementId ? { ...ach, text } : ach
        )
    );
  };

  const handleAddTransaction = (transaction: Omit<FinancialTransaction, 'id'>) => {
    setTransactions(currentTransactions => [
        { ...transaction, id: new Date().toISOString() + Math.random() },
        ...currentTransactions
    ]);
  };
  
  const renderMainContent = () => {
      switch(currentView) {
        case 'Home': return <Home tasks={tasks} mood={mood} />;
        case 'Agenda': return <Agenda tasks={tasks} onUpdateTask={handleUpdateTask} />;
        case 'Completion': return <CompletionTracker tasks={tasks} onUpdateTask={handleUpdateTask} />;
        case 'Highlights': return <Highlights achievements={achievements} onUpdateAchievement={handleUpdateAchievement} />;
        case 'Personal': return <PersonalJournal mood={mood} notes={journalNotes} onMoodChange={setMood} onNotesChange={setJournalNotes} />;
        case 'Finance': return <Finances transactions={transactions} onAddTransaction={handleAddTransaction} />;
        case 'Settings': return <Settings />;
        default: return <Home tasks={tasks} mood={mood} />;
      }
  };
  
  const showSidebar = ['Agenda', 'Completion', 'Highlights', 'Personal'].includes(currentView);

  return (
    <div className="bg-background text-foreground min-h-screen font-sans flex transition-colors duration-500">
      <StarryNight />
      <NavigationBar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-20 lg:ml-56 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
           <div className={`grid grid-cols-1 ${showSidebar ? 'xl:grid-cols-3 xl:gap-6' : ''}`}>
              <div className={showSidebar ? 'xl:col-span-2' : 'col-span-1'}>
                {renderMainContent()}
              </div>
              {showSidebar && (
                <aside className="hidden xl:block space-y-6 mt-6 xl:mt-0 animate-fade-in">
                    <PriorityTasks tasks={tasks} onUpdateTask={handleUpdateTask} />
                    {currentView !== 'Personal' && (
                         <PersonalJournal mood={mood} notes={journalNotes} onMoodChange={setMood} onNotesChange={setJournalNotes} />
                    )}
                </aside>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}

export default App;
