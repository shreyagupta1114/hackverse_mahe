import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const normalized = status.toUpperCase();

  let text = status;
  let classes =
    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#182235] dark:text-[#CBD5E1] dark:border-[#263449]';

  if (normalized.includes('EVIDENCE') || normalized === 'EVIDENCE REQUIRED') {
    text = 'Evidence Required';
    classes =
      'bg-blue-50/90 text-[#1E4E8C] border-blue-200/90 dark:bg-[#132238] dark:text-[#93C5FD] dark:border-[#1E3A8A]';
  } else if (normalized.includes('ESCALAT') || normalized === 'ESCALATED') {
    text = 'Escalated';
    classes =
      'bg-rose-50/90 text-rose-800 border-rose-200/90 dark:bg-[#2B151C] dark:text-[#FDA4AF] dark:border-[#881337]';
  } else if (normalized.includes('REVIEW') || normalized === 'UNDER REVIEW') {
    text = 'Under Review';
    classes =
      'bg-amber-50/90 text-amber-900 border-amber-200/90 dark:bg-[#2D1F12] dark:text-[#FCD34D] dark:border-[#78350F]';
  } else if (
    normalized.includes('REVIEWED') ||
    normalized === 'NORMAL' ||
    normalized === 'RESOLVED' ||
    normalized === 'VERIFIED'
  ) {
    text = 'Reviewed';
    classes =
      'bg-teal-50/90 text-teal-800 border-teal-200/90 dark:bg-[#102422] dark:text-[#5EEAD4] dark:border-[#134E4A]';
  } else if (normalized === 'AVAILABLE') {
    text = 'Available';
    classes =
      'bg-teal-50/90 text-teal-800 border-teal-200/90 dark:bg-[#102422] dark:text-[#5EEAD4] dark:border-[#134E4A]';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium font-mono rounded border whitespace-nowrap shadow-2xs ${padding} ${classes}`}
    >
      {text}
    </span>
  );
};
