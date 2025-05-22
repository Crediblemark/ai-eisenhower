
import React from 'react';
import { Task, Quadrant, QuadrantDefinition } from '../types';
import TaskItem from './TaskItem';
import { PlusCircleIcon } from './Icons'; // Assuming you might want an add button per quadrant later

interface QuadrantColumnProps {
  quadrantInfo: QuadrantDefinition;
  tasks: Task[];
  onMoveTask: (taskId: string, newQuadrant: Quadrant) => void;
  onDeleteTask: (taskId: string) => void;
  onGetTaskAdvice: (task: Task) => Promise<string>;
  isLoadingAiAdvice: boolean;
  isFull: boolean;
}

const QuadrantColumn: React.FC<QuadrantColumnProps> = ({
  quadrantInfo,
  tasks,
  onMoveTask,
  onDeleteTask,
  onGetTaskAdvice,
  isLoadingAiAdvice,
  isFull
}) => {
  return (
    <div className={`p-4 rounded-xl shadow-lg h-full flex flex-col ${quadrantInfo.colorClasses} border-2`}>
      <div className="flex items-center mb-4">
        {quadrantInfo.icon}
        <div className="ml-3">
            <h2 className="text-xl font-semibold text-slate-100">{quadrantInfo.title}</h2>
            <p className="text-xs text-slate-400">{quadrantInfo.description}</p>
        </div>
      </div>
      {isFull && <p className="text-xs text-yellow-400 mb-2">This quadrant is full.</p>}
      <div className="space-y-3 overflow-y-auto flex-grow pr-1 max-h-[calc(100vh-300px)] min-h-[200px]">
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500 italic text-center py-4">No tasks here yet.</p>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onMoveTask={onMoveTask}
              onDeleteTask={onDeleteTask}
              onGetTaskAdvice={onGetTaskAdvice}
              isLoadingAiAdvice={isLoadingAiAdvice}
              currentQuadrantId={quadrantInfo.id}
              isQuadrantFull={isFull}
            />
          ))
        )}
      </div>
      {/* Placeholder for potential future add button per quadrant */}
      {/* <button className="mt-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-md flex items-center justify-center text-sm">
        <PlusCircleIcon className="w-4 h-4 mr-1" /> Add to {quadrantInfo.title}
      </button> */}
    </div>
  );
};

export default QuadrantColumn;
