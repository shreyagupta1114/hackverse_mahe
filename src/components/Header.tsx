import React, { useState } from 'react';
import { ActiveTab } from '../types';
import {
  Layers,
  FileText,
  AlertCircle,
  FileCheck2,
  ClipboardCheck,
  Sun,
  Moon,
  Shield,
  User,
  Menu,
  X,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingReviewsCount: number;
  evidencePendingCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingReviewsCount,
  evidencePendingCount,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xs border-b border-slate-200 dark:border-[#263449] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded bg-[#1E4E8C] dark:bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs border border-blue-600/30 dark:border-blue-400/30 transition-transform group-hover:scale-[1.02]">
                AF
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-sm tracking-tight text-slate-900 dark:text-[#F1F5F9]">
                    Audit Flow
                  </span>
                </div>
                <span className="hidden md:block text-[11px] text-slate-500 dark:text-[#8295AD] font-mono leading-tight">
                  Contract Variation & Compliance Monitoring
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Horizontal Navigation (Center/Left) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-[#1E4E8C] dark:text-[#60A5FA] bg-blue-50/90 dark:bg-[#182235] font-semibold border-b-2 border-[#1E4E8C] dark:border-[#3B82F6]'
                      : 'text-slate-600 dark:text-[#CBD5E1] hover:text-[#1E4E8C] dark:hover:text-[#F1F5F9] hover:bg-slate-100/70 dark:hover:bg-[#182235]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-[#1E4E8C] dark:text-[#60A5FA]'
                        : 'text-slate-400 dark:text-[#8295AD]'
                    }`}
                  />
                  <span>{item.label}</span>

                  {item.badge !== undefined && (
                    <span
                      className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-[#1E4E8C] text-white dark:bg-[#2563EB] dark:text-white'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Officer Info & Theme Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Officer details */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-[#CBD5E1] bg-slate-50 dark:bg-[#182235] px-2.5 py-1.5 rounded border border-slate-200 dark:border-[#263449]">
              <User className="w-3.5 h-3.5 text-[#1E4E8C] dark:text-[#60A5FA]" />
              <span className="font-medium text-slate-800 dark:text-[#F1F5F9]">
                S. Ramanathan
              </span>
              <span className="text-[11px] text-slate-400 dark:text-[#8295AD]">
                (Vigilance)
              </span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono font-medium border border-slate-200 dark:border-[#263449] bg-slate-50 hover:bg-slate-100 active:bg-slate-200 dark:bg-[#182235] dark:hover:bg-[#202E44] dark:active:bg-[#151D2D] text-slate-700 dark:text-[#E2E8F0] transition-colors cursor-pointer shadow-2xs"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#182235] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-[#263449] bg-white dark:bg-[#111827] px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#1E4E8C] dark:text-[#60A5FA] bg-blue-50/90 dark:bg-[#182235] font-semibold'
                    : 'text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#182235]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-[#263449] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#8295AD] px-2">
            <span>Logged in as: S. Ramanathan </span>
          </div>
        </div>
      )}
    </header>
  );
};
