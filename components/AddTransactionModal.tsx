import React, { useState, useEffect } from 'react';
import { FinancialTransaction, FinancialCategory } from '../types';
import Button from './shared/Button';
import { XCircleIcon } from './icons';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTransaction: (transaction: Omit<FinancialTransaction, 'id'>) => void;
}

const expenseCategories: FinancialCategory[] = ['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Health', 'Subscriptions', 'Other'];
const incomeCategories: FinancialCategory[] = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAddTransaction }) => {
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [category, setCategory] = useState<FinancialCategory>(expenseCategories[0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        // Reset category when type changes to avoid invalid combinations
        if (type === 'EXPENSE') {
            setCategory(expenseCategories[0]);
        } else {
            setCategory(incomeCategories[0]);
        }
    }, [type]);
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description && amount && Number(amount) > 0) {
            onAddTransaction({ type, description, amount: Number(amount), category, date });
            // Reset form and close
            setDescription('');
            setAmount('');
            setType('EXPENSE');
            setDate(new Date().toISOString().split('T')[0]);
            onClose();
        } else {
            alert("Please fill out all fields with valid data.");
        }
    };

    const InputField: React.FC<{label: string, id: string, children: React.ReactNode}> = ({label, id, children}) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
            {children}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-card rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative border border-border" onClick={e => e.stopPropagation()}>
                <Button variant="ghost" onClick={onClose} className="absolute top-4 right-4 !p-1.5 text-muted-foreground hover:text-foreground" aria-label="Close">
                    <XCircleIcon className="w-6 h-6" />
                </Button>
                <h2 className="text-2xl font-bold mb-6">Add Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Type" id="type-toggle">
                        <div className="flex gap-2 p-1 bg-muted rounded-lg">
                             <button type="button" onClick={() => setType('EXPENSE')} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors ${type === 'EXPENSE' ? 'bg-card shadow' : 'hover:bg-card/50'}`}>
                                Expense
                            </button>
                             <button type="button" onClick={() => setType('INCOME')} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors ${type === 'INCOME' ? 'bg-card shadow' : 'hover:bg-card/50'}`}>
                                Income
                            </button>
                        </div>
                    </InputField>
                    <InputField label="Description" id="description">
                        <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full bg-muted p-2 rounded-lg border-2 border-transparent focus:ring-2 focus:ring-ring focus:bg-background outline-none" />
                    </InputField>
                     <InputField label="Amount" id="amount">
                        <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} required min="0.01" step="0.01" placeholder="0.00" className="w-full bg-muted p-2 rounded-lg border-2 border-transparent focus:ring-2 focus:ring-ring focus:bg-background outline-none" />
                    </InputField>
                     <InputField label="Category" id="category">
                        <select id="category" value={category} onChange={e => setCategory(e.target.value as FinancialCategory)} className="w-full bg-muted p-2 rounded-lg border-2 border-transparent focus:ring-2 focus:ring-ring focus:bg-background outline-none appearance-none">
                           {(type === 'EXPENSE' ? expenseCategories : incomeCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </InputField>
                    <InputField label="Date" id="date">
                        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-muted p-2 rounded-lg border-2 border-transparent focus:ring-2 focus:ring-ring focus:bg-background outline-none" />
                    </InputField>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button onClick={onClose} variant="secondary" type="button">Cancel</Button>
                        <Button type="submit" variant="primary" className="!px-6">Add</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
