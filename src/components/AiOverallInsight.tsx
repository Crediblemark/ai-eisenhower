import React, { useState, useCallback } from 'react';
import { Task, Quadrant } from '../types';
import { QUADRANT_DEFINITIONS } from '../constants';
import { LightBulbIcon, SparklesIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';
import { getOverallInsightFromAI } from '../services/geminiService';

interface AiOverallInsightProps {
  tasks: Task[];
  geminiApiKey: string;
}

const AiOverallInsight: React.FC<AiOverallInsightProps> = ({ tasks, geminiApiKey }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getOverallInsight = useCallback(async () => {
    if (!geminiApiKey) {
        setError("API Key is missing, cannot fetch insights.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setInsight(null);

    const taskSummary = Object.values(Quadrant).map(qId => {
      const quadrantTasks = tasks.filter(t => t.quadrant === qId);
      const firstTaskDesc = quadrantTasks.length > 0 ? `Example: "${quadrantTasks[0].description.substring(0, 50)}..."` : "None";
      return `- ${QUADRANT_DEFINITIONS[qId].title} (${QUADRANT_DEFINITIONS[qId].description}): ${quadrantTasks.length} tasks. ${firstTaskDesc}`;
    }).join('\n');

    try {
      const fetchedInsight = await getOverallInsightFromAI(taskSummary, geminiApiKey);
      setInsight(fetchedInsight);
    } catch (e: any) {
      console.error("Error getting overall insight:", e);
      setError(`Failed to get AI insight: ${e.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [tasks, geminiApiKey]);

  return (
    <div className="w-full max-w-3xl mt-8 p-4 bg-slate-800/60 border border-slate-700 rounded-lg shadow-xl">
      <h3 className="text-lg font-semibold text-sky-300 mb-3 flex items-center">
        <SparklesIcon className="w-6 h-6 mr-2 text-sky-400" />
        AI Manager's Strategic Overview
      </h3>
      {isLoading && <LoadingSpinner text="Analyzing your workload..." />}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {insight && (
        <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-md">
          <p className="text-sm text-sky-200 italic">{insight}</p>
        </div>
      )}
      {!insight && !isLoading && !error && (
        <p className="text-sm text-slate-400">Click the button to get personalized insights on your task distribution.</p>
      )}
      <button
        onClick={getOverallInsight}
        disabled={isLoading || !geminiApiKey}
        className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors disabled:opacity-50 flex items-center"
      >
        <LightBulbIcon className="w-4 h-4 mr-2" />
        {isLoading ? 'Thinking...' : 'Get Strategic Advice'}
      </button>
    </div>
  );
};

export default AiOverallInsight;
