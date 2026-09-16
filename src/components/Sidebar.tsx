import React from 'react';
import { ActiveTab } from '../types';
import {
  Layers,
  FileText,
  AlertCircle,
  FileCheck2,
  ClipboardCheck,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingReviewsCount: number;
  evidencePendingCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingReviewsCount,
  evidencePendingCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Overview',
      icon: Layers,
    },
    {
      id: 'contracts' as ActiveTab,
      label: 'Contracts',
      icon: FileText,
    },
    {
      id: 'variations' as ActiveTab,
      label: 'Variations',
      icon: AlertCircle,
    },
    {
      id: 'evidence' as ActiveTab,
      label: 'Evidence',
      icon: FileCheck2,
      badge: evidencePendingCount > 0 ? evidencePendingCount : undefined,
    },
    {
      id: 'reviews' as ActiveTab,
      label: 'Review',
      icon: ClipboardCheck,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-56 flex-shrink-0 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Brand header */}
          <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-mono font-bold text-xs tracking-wider border border-slate-700">
                CT
              </div>
              <div>
                <span className="font-mono font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 block leading-tight">
                  CIVIC TRACE
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                  Contract Compliance
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Workflow caption */}
          <div className="px-4 pt-4 pb-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Core Workflow
            </div>
          </div>

          {/* Nav items */}
          <nav className="px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium font-mono transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-slate-200 dark:text-slate-300'
                          : 'text-slate-400 dark:text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-slate-700 text-slate-200 dark:bg-slate-700 dark:text-slate-200'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer status notice */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Auditing Active</span>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-400">
            Contracts → Variations → Evidence → Review
          </div>
        </div>
      </aside>
    </>
  );
};
