
import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "Loading...", size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-[6px]',
  };
  const textSizeClasses = {
    sm: 'text-xs ml-2',
    md: 'text-sm ml-2',
    lg: 'text-base ml-3',
  }

  return (
    <div className="flex items-center justify-center text-slate-300 my-3">
      <div
        className={`${sizeClasses[size]} border-slate-500 border-t-sky-400 rounded-full animate-spin`}
      ></div>
      {text && <span className={`${textSizeClasses[size]} text-slate-400`}>{text}</span>}
    </div>
  );
};
