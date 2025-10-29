import React, { useState } from 'react';
import { Mood } from '../types';
import Card from './shared/Card';
import Button from './shared/Button';
import { SparklesIcon } from './icons';
import { getReflectionSummary } from '../services/geminiService';

interface PersonalJournalProps {
    mood: Mood;
    notes: string;
    onMoodChange: (mood: Mood) => void;
    onNotesChange: (notes: string) => void;
}

const PersonalJournal: React.FC<PersonalJournalProps> = ({ mood, notes, onMoodChange, onNotesChange }) => {
    const [aiSummary, setAiSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleGenerateSummary = async () => {
        setIsLoading(true);
        setAiSummary('');
        const result = await getReflectionSummary(mood, notes);
        setAiSummary(result);
        setIsLoading(false);
    };

    return (
        <Card className="w-full animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Personal Journal</h2>
            <div className="space-y-6">
                <div>
                    <label className="font-semibold text-card-foreground mb-2 block">How are you feeling?</label>
                    <div className="flex justify-around bg-muted p-2 rounded-xl">
                        {Object.values(Mood).map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => onMoodChange(emoji)}
                                className={`text-3xl p-2 rounded-lg transition-transform duration-200 ${mood === emoji ? 'bg-primary/20 scale-125' : 'hover:scale-110 grayscale hover:grayscale-0 opacity-70 hover:opacity-100'}`}
                                aria-label={`Select mood: ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="journal-notes" className="font-semibold text-card-foreground mb-2 block">Your Thoughts</label>
                    <textarea
                        id="journal-notes"
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        placeholder="Reflect on your day, thoughts, and feelings..."
                        rows={8}
                        className="w-full bg-muted p-4 rounded-lg focus:ring-2 focus:ring-ring outline-none border border-transparent focus:border-ring"
                    />
                </div>
                <div className="pt-2">
                    <Button onClick={handleGenerateSummary} disabled={isLoading || !notes.trim()} className="w-full">
                       <SparklesIcon className="w-5 h-5" /> {isLoading ? 'Reflecting...' : 'AI Reflection Summary'}
                    </Button>
                    {aiSummary && (
                        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-800 dark:text-emerald-200 animate-fade-in">
                            {aiSummary}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

export default PersonalJournal;
