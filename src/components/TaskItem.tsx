
import React, { useState } from 'react';
import { Task, Quadrant } from '../types';
import { QUADRANT_DEFINITIONS } from '../constants';
import { TrashIcon, ArrowPathIcon, LightBulbIcon, ChevronDownIcon, ChevronUpIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';

interface TaskItemProps {
  task: Task;
  onMoveTask: (taskId: string, newQuadrant: Quadrant) => void;
  onDeleteTask: (taskId: string) => void;
  onGetTaskAdvice: (task: Task) => Promise<string>;
  isLoadingAiAdvice: boolean;
  currentQuadrantId: Quadrant;
  isQuadrantFull: boolean; // This prop might be slightly misnamed, should be for target quadrant. Let's simplify.
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onMoveTask,
  onDeleteTask,
  onGetTaskAdvice,
  isLoadingAiAdvice,
  currentQuadrantId,
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [specificAdvice, setSpecificAdvice] = useState<string | null>(null);
  const [isGettingAdvice, setIsGettingAdvice] = useState<boolean>(false);
  const [showMoveOptions, setShowMoveOptions] = useState<boolean>(false);

  const handleGetSpecificAdvice = async () => {
    setIsGettingAdvice(true);
    setSpecificAdvice(null); // Clear previous advice
    const advice = await onGetTaskAdvice(task);
    setSpecificAdvice(advice);
    setIsGettingAdvice(false);
    setShowDetails(true); // Ensure details are shown when advice is fetched
  };

  const availableQuadrantsToMove = Object.values(Quadrant).filter(q => q !== currentQuadrantId);

  return (
    <div className="bg-slate-800/70 p-3 rounded-lg shadow-md border border-slate-700 hover:border-slate-600 transition-all duration-200">
      <div className="flex justify-between items-start">
        <p className="text-sm text-slate-200 flex-grow break-words">{task.description}</p>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label={showDetails ? "Hide details" : "Show details"}
        >
          {showDetails ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
        </button>
      </div>

      {showDetails && (
        <div className="mt-2 pt-2 border-t border-slate-700">
          {task.aiRecommendation && (
            <p className="text-xs text-sky-300/80 italic mb-1">
              <LightBulbIcon className="w-3 h-3 inline mr-1" />
              AI Suggestion: {task.aiRecommendation}
            </p>
          )}
          {isGettingAdvice && <LoadingSpinner text="Fetching advice..." size="sm"/>}
          {specificAdvice && (
            <p className="text-xs text-amber-300/90 mt-1 p-2 bg-amber-500/10 rounded">
              <LightBulbIcon className="w-3 h-3 inline mr-1" />
              Manager's Tip: {specificAdvice}
            </p>
          )}
          <div className="text-xs text-slate-500 mt-1">
            Added: {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center justify-end space-x-2">
        <button
            onClick={handleGetSpecificAdvice}
            disabled={isLoadingAiAdvice || isGettingAdvice}
            className="p-1 text-xs text-amber-400 hover:text-amber-300 disabled:opacity-50 transition-colors"
            title="Get AI Manager's Advice"
        >
            <LightBulbIcon className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMoveOptions(!showMoveOptions)}
            className="p-1 text-xs text-sky-400 hover:text-sky-300 transition-colors"
            title="Move Task"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
          {showMoveOptions && (
            <div className="absolute right-0 mt-1 z-10 w-36 bg-slate-700 border border-slate-600 rounded-md shadow-lg py-1">
              {availableQuadrantsToMove.map(qId => (
                <button
                  key={qId}
                  onClick={() => {
                    onMoveTask(task.id, qId);
                    setShowMoveOptions(false);
                  }}
                  className="block w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-600 hover:text-slate-100"
                >
                  Move to {QUADRANT_DEFINITIONS[qId].title}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => onDeleteTask(task.id)}
          className="p-1 text-xs text-red-400 hover:text-red-300 transition-colors"
          title="Delete Task"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
