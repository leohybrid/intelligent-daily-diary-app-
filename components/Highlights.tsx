import React, { useState } from 'react';
import { Achievement } from '../types';
import Card from './shared/Card';
import Button from './shared/Button';
import { PaperClipIcon, SparklesIcon, StarIcon } from './icons';
import { getAchievementInsight } from '../services/geminiService';

interface HighlightsProps {
  achievements: Achievement[];
  onUpdateAchievement: (id: string, text: string) => void;
}

const Highlights: React.FC<HighlightsProps> = ({ achievements, onUpdateAchievement }) => {
    const [aiInsight, setAiInsight] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateInsight = async () => {
        setIsLoading(true);
        setAiInsight('');
        const result = await getAchievementInsight(achievements);
        setAiInsight(result);
        setIsLoading(false);
    };

  return (
    <Card className="h-full max-h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Today's Highlights</h2>
      <div className="flex-grow space-y-3 overflow-y-auto pr-2 -mr-2">
        {achievements.map((ach, index) => (
          <div key={ach.id} className="relative animate-fade-in">
            <textarea
              value={ach.text}
              onChange={(e) => onUpdateAchievement(ach.id, e.target.value)}
              placeholder={`Achievement #${index + 1}`}
              rows={2}
              className="w-full bg-muted p-3 pl-4 rounded-lg focus:ring-2 focus:ring-ring outline-none resize-none border border-transparent focus:border-ring"
            />
            <Button 
                variant="ghost" 
                className="absolute bottom-2 right-2 !p-1.5 h-auto text-muted-foreground hover:text-primary"
                onClick={() => alert("Attaching proof feature is coming soon!")}
                title="Attach proof (coming soon)"
            >
              <PaperClipIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {achievements.length === 0 && (
             <div className="text-center h-full flex flex-col justify-center items-center text-muted-foreground">
                <StarIcon className="w-16 h-16 text-border" />
                <p className="mt-4 font-semibold">No highlights yet.</p>
                <p className="text-sm">Record your wins for the day!</p>
            </div>
        )}
      </div>
       <div className="mt-auto pt-6 border-t border-border">
          <Button onClick={handleGenerateInsight} disabled={isLoading} className="w-full">
            <SparklesIcon className="w-5 h-5"/> {isLoading ? 'Generating Insight...' : 'Generate AI Insight'}
          </Button>
          {aiInsight && (
            <div className="mt-4 p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg text-sm text-violet-800 dark:text-violet-200 animate-fade-in">
              {aiInsight}
            </div>
          )}
        </div>
    </Card>
  );
};

export default Highlights;
