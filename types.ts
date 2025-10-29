export enum TaskType {
  Task = 'TASK',
  Meeting = 'MEETING',
  Break = 'BREAK',
}

export enum TaskStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  Unachieved = 'UNACHIEVED',
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  time: string; // e.g., "09:00"
  duration: number; // in minutes
  notes?: string;
  status: TaskStatus;
  reason?: string;
  isPriority: boolean;
}

export interface Achievement {
  id: string;
  text: string;
  proof?: File; // Note: File upload functionality is a placeholder
}

export enum Mood {
    Sad = '😞',
    Neutral = '😐',
    Happy = '😊',
    Ecstatic = '😄',
}

export type FinancialCategory = 'Food' | 'Transport' | 'Shopping' | 'Utilities' | 'Entertainment' | 'Health' | 'Subscriptions' | 'Salary' | 'Freelance' | 'Investment' | 'Gift' | 'Other' | 'Receipt';

export interface FinancialTransaction {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    category: FinancialCategory;
    amount: number;
    date: string; // YYYY-MM-DD
    description: string;
}

export type View = 'Home' | 'Agenda' | 'Completion' | 'Highlights' | 'Personal' | 'Finance' | 'Settings';
