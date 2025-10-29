import React, { useState, useRef, useMemo } from 'react';
import { FinancialTransaction, FinancialCategory } from '../types';
import Card from './shared/Card';
import Button from './shared/Button';
import { 
    SparklesIcon, PlusIcon, PaperClipIcon, ArrowUpIcon, ArrowDownIcon, BanknotesIcon,
    ShoppingCartIcon, TruckIcon, BuildingLibraryIcon, FilmIcon, HeartIcon, CreditCardIcon,
    BriefcaseIcon, ArrowTrendingUpIcon, GiftIcon, InboxIcon, ReceiptPercentIcon, PuzzlePieceIcon
} from './icons';
import { getSpendingInsight, parseReceipt } from '../services/geminiService';
import AddTransactionModal from './AddTransactionModal';

interface FinancesProps {
    transactions: FinancialTransaction[];
    onAddTransaction: (transaction: Omit<FinancialTransaction, 'id'>) => void;
}

const categoryIcons: Record<FinancialCategory, React.ReactNode> = {
    'Food': <PuzzlePieceIcon className="w-5 h-5" />,
    'Transport': <TruckIcon className="w-5 h-5" />,
    'Shopping': <ShoppingCartIcon className="w-5 h-5" />,
    'Utilities': <BuildingLibraryIcon className="w-5 h-5" />,
    'Entertainment': <FilmIcon className="w-5 h-5" />,
    'Health': <HeartIcon className="w-5 h-5" />,
    'Subscriptions': <CreditCardIcon className="w-5 h-5" />,
    'Salary': <BriefcaseIcon className="w-5 h-5" />,
    'Freelance': <BriefcaseIcon className="w-5 h-5" />,
    'Investment': <ArrowTrendingUpIcon className="w-5 h-5" />,
    'Gift': <GiftIcon className="w-5 h-5" />,
    'Receipt': <ReceiptPercentIcon className="w-5 h-5" />,
    'Other': <InboxIcon className="w-5 h-5" />,
};

const Finances: React.FC<FinancesProps> = ({ transactions, onAddTransaction }) => {
    const [aiInsight, setAiInsight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerateInsight = async () => {
        setIsLoading(true);
        setAiInsight('');
        const result = await getSpendingInsight(transactions);
        setAiInsight(result);
        setIsLoading(false);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsParsing(true);
            const parsedData = await parseReceipt(file);
            if (parsedData.description !== "Error parsing image" && parsedData.amount) {
                onAddTransaction({
                    type: 'EXPENSE',
                    category: 'Receipt',
                    amount: Math.abs(parsedData.amount),
                    date: parsedData.date || new Date().toISOString().split('T')[0],
                    description: parsedData.description || 'Parsed from receipt',
                });
            } else {
                alert('Could not parse the receipt image. Please try again.');
            }
            setIsParsing(false);
        }
        if(event.target) event.target.value = '';
    };
    
    const triggerFileUpload = () => fileInputRef.current?.click();

    const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome: income, totalExpenses: expenses, netBalance: income - expenses };
    }, [transactions]);

    return (
        <>
            <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTransaction={onAddTransaction} />
            <div className="space-y-6 animate-fade-in">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-lg"><ArrowUpIcon className="w-6 h-6 text-green-500" /></div>
                            <div>
                                <h3 className="text-sm text-muted-foreground">Income Today</h3>
                                <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-lg"><ArrowDownIcon className="w-6 h-6 text-red-500" /></div>
                            <div>
                                <h3 className="text-sm text-muted-foreground">Expenses Today</h3>
                                <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg"><BanknotesIcon className="w-6 h-6 text-blue-500" /></div>
                            <div>
                                <h3 className="text-sm text-muted-foreground">Net Balance</h3>
                                <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>${netBalance.toFixed(2)}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="flex flex-col h-full">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <h2 className="text-2xl font-bold">Transactions</h2>
                        <div className="flex gap-2">
                             <Button onClick={triggerFileUpload} variant="secondary" disabled={isParsing}>
                                <PaperClipIcon className="w-4 h-4" /> {isParsing ? 'Parsing...' : 'Scan Receipt'}
                            </Button>
                            <Button onClick={() => setIsModalOpen(true)}>
                                <PlusIcon className="w-5 h-5" /> Add New
                            </Button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>
                    <div className="flex-grow overflow-y-auto space-y-2 pr-2 -mr-2 max-h-96">
                        {transactions.length > 0 ? [...transactions].sort((a, b) => b.date.localeCompare(a.date)).map(t => (
                            <div key={t.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${t.type === 'INCOME' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {categoryIcons[t.category]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-card-foreground">{t.description}</p>
                                        <p className="text-sm text-muted-foreground">{t.category}</p>
                                    </div>
                                </div>
                                <p className={`font-bold text-lg ${t.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}`}>
                                    {t.type === 'EXPENSE' ? '-' : '+'}${t.amount.toFixed(2)}
                                </p>
                            </div>
                        )) : <p className="text-center text-muted-foreground py-10">No transactions recorded today.</p>}
                    </div>
                    <div className="mt-auto pt-6 border-t border-border">
                        <Button onClick={handleGenerateInsight} disabled={isLoading || transactions.length === 0} className="w-full">
                            <SparklesIcon className="w-5 h-5" /> {isLoading ? 'Analyzing...' : 'Generate AI Spending Insight'}
                        </Button>
                        {aiInsight && (
                            <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-800 dark:text-indigo-200 animate-fade-in">
                                {aiInsight}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Finances;
