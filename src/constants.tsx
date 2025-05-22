
import React from 'react';
import { Quadrant, QuadrantDefinition } from './types';
import { DoIcon, ScheduleIcon, DelegateIcon, DeleteIcon, SparklesIcon } from './components/Icons';

export const QUADRANT_DEFINITIONS: Record<Quadrant, QuadrantDefinition> = {
  [Quadrant.DO]: {
    id: Quadrant.DO,
    title: 'Do First',
    description: 'Urgent & Important',
    colorClasses: 'bg-rose-600/20 border-rose-500',
    icon: <DoIcon className="w-6 h-6 text-rose-400" />
  },
  [Quadrant.SCHEDULE]: {
    id: Quadrant.SCHEDULE,
    title: 'Schedule',
    description: 'Not Urgent & Important',
    colorClasses: 'bg-amber-500/20 border-amber-400',
    icon: <ScheduleIcon className="w-6 h-6 text-amber-300" />
  },
  [Quadrant.DELEGATE]: {
    id: Quadrant.DELEGATE,
    title: 'Delegate',
    description: 'Urgent & Not Important',
    colorClasses: 'bg-sky-500/20 border-sky-400',
    icon: <DelegateIcon className="w-6 h-6 text-sky-300" />
  },
  [Quadrant.DELETE]: {
    id: Quadrant.DELETE,
    title: 'Eliminate',
    description: 'Not Urgent & Not Important',
    colorClasses: 'bg-slate-600/30 border-slate-500',
    icon: <DeleteIcon className="w-6 h-6 text-slate-400" />
  },
};

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const AppTitleIcon: React.FC<{className?: string}> = ({className}) => <SparklesIcon className={className} />;

export const TASK_LIMIT_PER_QUADRANT = 10;
export const TOTAL_TASK_LIMIT = 40;
