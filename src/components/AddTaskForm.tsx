
import React, { useState } from 'react';
import { PlusIcon } from './Icons';

interface AddTaskFormProps {
  onAddTask: (description: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, isLoading, disabled }) => {
  const [description, setDescription] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isLoading || disabled) return;
    await onAddTask(description.trim());
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-800/50 border border-slate-700 rounded-lg shadow-md">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter new task description..."
          className="flex-grow p-3 bg-slate-700 text-slate-200 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none w-full sm:w-auto placeholder-slate-500"
          disabled={isLoading || disabled}
        />
        <button
          type="submit"
          disabled={isLoading || !description.trim() || disabled}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </div>
      {disabled && !isLoading && <p className="text-xs text-yellow-400 mt-1 text-center">Task submission disabled (e.g., API key missing or task limit reached).</p>}
    </form>
  );
};

export default AddTaskForm;
