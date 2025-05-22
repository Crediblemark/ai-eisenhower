
import React from 'react';

interface IconProps {
  className?: string;
}

export const DoIcon: React.FC<IconProps> = ({ className }) => ( // Fire icon or similar for urgency
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.05L12.936 4.5H2.25A.75.75 0 001.5 5.25v.051a.75.75 0 00.658.743 5.25 5.25 0 013.292 1.853.75.75 0 00.525.203h4.5a.75.75 0 00.525-.203 5.25 5.25 0 013.292-1.853.75.75 0 00.658-.743V5.25a.75.75 0 00-.75-.75h-2.436C14.329 3.505 13.537 2.73 12.963 2.286zM5.606 10.532a.75.75 0 00-.944 1.152 6.75 6.75 0 004.339 2.658V18a.75.75 0 001.5 0v-3.658a6.75 6.75 0 004.339-2.658.75.75 0 10-.944-1.152 5.25 5.25 0 01-3.394 2.064V12a.75.75 0 00-1.5 0v.596a5.25 5.25 0 01-3.394-2.064z" clipRule="evenodd" />
    <path d="M14.25 21a.75.75 0 00.75-.75V18.75a.75.75 0 00-1.5 0v1.5a.75.75 0 00.75.75z" />
  </svg>
);

export const ScheduleIcon: React.FC<IconProps> = ({ className }) => ( // Calendar icon
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zM6 7.5v11.25c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75V7.5H6z" clipRule="evenodd" />
  </svg>
);

export const DelegateIcon: React.FC<IconProps> = ({ className }) => ( // Users icon
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.533 1.403 12.987 12.987 0 01-2.7 2.068A7.5 7.5 0 0117.25 19.128z" />
  </svg>
);

export const DeleteIcon: React.FC<IconProps> = ({ className }) => ( // Trash/X icon
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.85 2.771-2.908A43.748 43.748 0 0112 1.5c1.268 0 2.517.07 3.729.218 1.558.059 2.771 1.344 2.771 2.908zM10.5 6a.75.75 0 00-.75.75v10.5a.75.75 0 001.5 0V6.75a.75.75 0 00-.75-.75zm3.75 0a.75.75 0 00-.75.75v10.5a.75.75 0 001.5 0V6.75a.75.75 0 00-.75-.75z" clipRule="evenodd" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


export const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75H4.75a.75.75 0 000 1.5h.443l.802 10.024a2.75 2.75 0 002.741 2.476h3.528a2.75 2.75 0 002.74-2.476l.803-10.024h.443a.75.75 0 000-1.5H14A2.75 2.75 0 0011.25 1H8.75zM10 4.75a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 0110 4.75zM7.75 6.25a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5zm5 0a.75.75 0 00-1.5 0v7.5a.75.75 0 001.5 0v-7.5z" clipRule="evenodd" />
  </svg>
);

export const ArrowPathIcon: React.FC<IconProps> = ({ className }) => ( // Move icon
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M15.312 5.312a.75.75 0 010 1.061L13.121 8.5H16.25a.75.75 0 010 1.5h-3.129l2.19 2.127a.75.75 0 11-1.06 1.061l-3.5-3.5a.75.75 0 010-1.06l3.5-3.5a.75.75 0 011.06 0zM6.879 8.5H3.75a.75.75 0 000 1.5h3.129l-2.19 2.127a.75.75 0 101.06 1.061l3.5-3.5a.75.75 0 000-1.06l-3.5-3.5a.75.75 0 00-1.06 1.06L6.879 8.5z" clipRule="evenodd" />
  </svg>
);

export const LightBulbIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10 3.5a5.743 5.743 0 00-5.494 4.368.75.75 0 01-1.48-.236A7.243 7.243 0 0110 2c2.973 0 5.562 1.754 6.725 4.314a.75.75 0 01-1.398.577A5.743 5.743 0 0010 3.5z" />
    <path fillRule="evenodd" d="M6.058 9.034h.006a3.572 3.572 0 003.767 3.365c.106.003.213.003.32.003a3.572 3.572 0 003.804-3.247.75.75 0 011.473.294A5.072 5.072 0 0110.32 14a5.07 5.07 0 01-5.028-4.66.75.75 0 011.002-.495l-.005.002-.006-.002h.005zm-.216 5.195A.75.75 0 016.5 14c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75.75.75 0 011.5 0 2.25 2.25 0 01-2.25 2.25h-5.5A2.25 2.25 0 015 14.75a.75.75 0 01.842-.721z" clipRule="evenodd" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>
);

