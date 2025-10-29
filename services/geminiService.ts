import { GoogleGenAI, Type } from "@google/genai";
import { Task, FinancialTransaction, Mood, Achievement } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set. App will run without AI features.");
}

// Initialize AI client, but handle the case where API_KEY might be missing.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const generateContent = async (prompt: string, fallback: string): Promise<string> => {
    if (!ai) return fallback;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content:", error);
        return `Error: Could not generate response. ${error instanceof Error ? error.message : ''}`;
    }
}

export const getDailyBriefing = async (tasks: Task[]): Promise<string> => {
    const fallback = "Could not generate your daily briefing. Please check your API key.";
    const priorityTasks = tasks.filter(t => t.isPriority || t.type === 'MEETING').map(t => ({ title: t.title, time: t.time, type: t.type }));
    
    if (priorityTasks.length === 0) {
        return "Your day looks clear! Pick a task and make it a priority to get started.";
    }
    const prompt = `
        As an executive assistant, analyze this list of important tasks and meetings for today.
        Provide a very short (1-2 sentence) "Daily Briefing" to help the user focus.
        Highlight the most important priority task or the first major meeting. Be encouraging and professional.
        Example: "Your focus today is the 'Q4 Planning Session' at 10 AM. Nailing this will set the tone for the quarter. You've got this!"
        Tasks: ${JSON.stringify(priorityTasks)}
    `;
    return generateContent(prompt, fallback);
};

export const getCompletionAnalysis = async (tasks: Task[]): Promise<string> => {
    const fallback = "Could not generate analysis. Please check your API key.";
    const prompt = `
      As a productivity coach, analyze the following daily task list.
      Provide a short, encouraging analysis (2 sentences max) of the user's productivity and one actionable suggestion for improvement.
      Focus on trends and be supportive.
      Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, status: t.status, reason: t.reason })))}
    `;
    return generateContent(prompt, fallback);
};

export const getAchievementInsight = async (achievements: Achievement[]): Promise<string> => {
    const fallback = "Could not generate insight. Please check your API key.";
    const achievementTexts = achievements.map(a => a.text).filter(Boolean);
    if (achievementTexts.length === 0) return "Add some achievements to get an insight.";

    const prompt = `
      As a motivational coach, review these achievements for the day.
      Generate a brief, powerful, and motivational summary of the user's progress and momentum. Keep it to 2 sentences.
      Achievements: ${JSON.stringify(achievementTexts)}
    `;
    return generateContent(prompt, fallback);
};

export const getReflectionSummary = async (mood: Mood, notes: string): Promise<string> => {
    const fallback = "Could not generate summary. Please check your API key.";
    if (!notes.trim()) return "Write some notes to get a reflection summary.";
    
    const prompt = `
        As a mindfulness coach, analyze these journal entries and mood.
        Provide a gentle, insightful summary (2-3 sentences) and a supportive, open-ended question for further reflection.
        Mood: ${mood}
        Notes: "${notes}"
    `;
    return generateContent(prompt, fallback);
};

export const getSpendingInsight = async (transactions: FinancialTransaction[]): Promise<string> => {
    const fallback = "Could not generate insight. Please check your API key.";
    if (transactions.length === 0) return "Add some transactions to get an insight.";

    const prompt = `
        As a financial analyst, briefly analyze this list of today's financial transactions.
        Provide a single, concise insight into the user's spending habits for the day.
        Example: "Subscriptions accounted for the majority of your expenses today."
        Transactions: ${JSON.stringify(transactions)}
    `;
    return generateContent(prompt, fallback);
};

export const parseReceipt = async (imageFile: File): Promise<Partial<FinancialTransaction>> => {
    if (!ai) {
        alert("AI features are disabled. Please configure your API key.");
        return { description: "AI disabled", amount: 0 };
    }
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = { text: "You are a financial data extractor. Analyze this receipt image. Extract the vendor/description, date (in YYYY-MM-DD format if available), and total amount. Return strict JSON. For vendor use 'description'. For date use 'date'. For total use 'amount'. Use null if a value is not found." };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING },
                        date: { type: Type.STRING },
                        amount: { type: Type.NUMBER }
                    }
                }
            }
        });

        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }
        
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as Partial<FinancialTransaction>;

    } catch (error) {
        console.error("Error parsing receipt:", error);
        return { description: "Error parsing image", amount: 0 };
    }
};
