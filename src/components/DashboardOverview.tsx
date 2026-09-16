import React from 'react';
import { Contract, VariationItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { ArrowRight, FileText, AlertCircle, FileCheck2, ClipboardCheck } from 'lucide-react';

interface DashboardOverviewProps {
  contracts: Contract[];
  onSelectContract: (contractId: string) => void;
  onGoToReviews: (contractId?: string, variationId?: string) => void;
  onGoToVariations: () => void;
  onGoToEvidence: () => void;
}

interface AttentionItem {
  contractId: string;
  contractProject: string;
  variationId: string;
  variationType: string;
  deviation: string;
  original: string;
  current: string;
  date: string;
  status: string;
  priority: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  contracts,
  onSelectContract,
  onGoToReviews,
  onGoToVariations,
  onGoToEvidence,
}) => {
  // Aggregate 4 summary metrics
  const activeContractsCount = contracts.length;

  const totalVariationsCount = contracts.reduce(
    (acc, c) => acc + c.variations.length,
    0
  );

  const evidencePendingCount = contracts.reduce(
    (acc, c) => acc + c.evidenceDocs.filter((d) => d.status === 'Pending Review').length,
    0
  );

  const reviewsPendingCount = contracts.reduce(
    (acc, c) =>
      acc +
      c.variations.filter(
        (v) => v.reviewStatus === 'REVIEW' || v.reviewStatus === 'EVIDENCE REQUIRED' || v.reviewStatus === 'ESCALATED'
      ).length,
    0
  );

  // Collect items requiring attention
  const attentionItems: AttentionItem[] = [];
  contracts.forEach((c) => {
    c.variations
      .filter(
        (v) =>
          v.reviewStatus === 'REVIEW' ||
          v.reviewStatus === 'EVIDENCE REQUIRED' ||
          v.reviewStatus === 'ESCALATED'
      )
      .forEach((v) => {
        let typeLabel: string = v.category;
        if (v.category === 'Contract Value') typeLabel = 'Cost Change';
        else if (v.category === 'Timeline') typeLabel = 'Timeline Extension';
        else if (v.category === 'Subcontractor') typeLabel = 'Subcontractor Change';
        else if (v.category === 'Materials') typeLabel = 'Material Change';
        else if (v.category === 'Project Scope') typeLabel = 'Specification Change';

        attentionItems.push({
          contractId: c.id,
          contractProject: c.project,
          variationId: v.id,
          variationType: typeLabel,
          deviation: v.title,
          original: v.originalValue,
          current: v.currentValue,
          date: v.dateDetected,
          status: v.reviewStatus,
          priority: v.severity,
        });
      });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#263449] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E4E8C] dark:bg-[#3B82F6]"></span>
            <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-[#F1F5F9]">
              Compliance Overview
            </h1>
          </div>

        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#8295AD]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      {/* 4 Summary Blocks with subtle elevation and alive hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Active Contracts */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-[#263449] rounded-lg p-5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-blue-300 dark:hover:border-[#3B4D68] transition-all duration-150">
          <div className="flex items-center justify-between text-slate-600 dark:text-[#8295AD]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Active Contracts
            </span>
            <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-[#182235] flex items-center justify-center text-[#1E4E8C] dark:text-[#60A5FA]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 dark:text-[#F1F5F9]">
              {activeContractsCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-[#8295AD]">Monitored</span>
          </div>
        </div>

        {/* Recent Variations */}
        <button
          onClick={onGoToVariations}
          className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-[#263449] rounded-lg p-5 text-left shadow-2xs hover:shadow-md hover:border-amber-300 dark:hover:border-[#78350F] hover:bg-slate-50/50 dark:hover:bg-[#182235] transition-all duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-[#8295AD]">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
              Recent Variations
            </span>
            <div className="w-8 h-8 rounded-md bg-amber-50 dark:bg-[#2D1F12] flex items-center justify-center text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 dark:text-[#F1F5F9]">
              {totalVariationsCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-[#8295AD] group-hover:underline">
              View all 
            </span>
          </div>
        </button>

        {/* Evidence Pending */}
        <button
          onClick={onGoToEvidence}
          className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-[#263449] rounded-lg p-5 text-left shadow-2xs hover:shadow-md hover:border-teal-300 dark:hover:border-[#134E4A] hover:bg-slate-50/50 dark:hover:bg-[#182235] transition-all duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-[#8295AD]">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
              Evidence Pending
            </span>
            <div className="w-8 h-8 rounded-md bg-teal-50 dark:bg-[#102422] flex items-center justify-center text-teal-700 dark:text-teal-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 dark:text-[#F1F5F9]">
              {evidencePendingCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-[#8295AD] group-hover:underline">
              Inspect vault 
            </span>
          </div>
        </button>

        {/* Reviews Pending */}
        <button
          onClick={() => onGoToReviews()}
          className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-[#263449] rounded-lg p-5 text-left shadow-2xs hover:shadow-md hover:border-[#1E4E8C]/40 dark:hover:border-[#1E3A8A] hover:bg-slate-50/50 dark:hover:bg-[#182235] transition-all duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-slate-600 dark:text-[#8295AD]">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-[#1E4E8C] dark:group-hover:text-[#60A5FA] transition-colors">
              Reviews Pending
            </span>
            <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-[#132238] flex items-center justify-center text-[#1E4E8C] dark:text-[#60A5FA]">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#1E4E8C] dark:text-[#60A5FA]">
              {reviewsPendingCount}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:underline">
              Action needed 
            </span>
          </div>
        </button>
      </div>

      {/* Requires Attention Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-mono tracking-tight text-slate-900 dark:text-[#F1F5F9]">
              Requires Attention
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8295AD] font-mono">
              Contracts and post-award deviations awaiting verification or officer attention.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-[#8295AD]">
            {attentionItems.length} items flagged
          </span>
        </div>

        {/* Primary Table with Subtle Accent-Tinted Hover Rows */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-[#182235] text-slate-600 dark:text-[#CBD5E1] border-b border-slate-200 dark:border-[#263449] font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Contract</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Variation Type</th>
                  <th className="py-3 px-4 font-semibold">Deviation / Change</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 font-semibold text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#263449]/60">
                {attentionItems.slice(0, 8).map((item) => (
                  <tr
                    key={`${item.contractId}-${item.variationId}`}
                    className="hover:bg-blue-50/40 dark:hover:bg-[#182235] transition-colors duration-100 cursor-pointer"
                  >
                    {/* Contract */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectContract(item.contractId)}
                        className="text-left group cursor-pointer focus:outline-none"
                      >
                        <span className="font-semibold text-slate-900 dark:text-[#F1F5F9] group-hover:text-[#1E4E8C] dark:group-hover:text-[#60A5FA] group-hover:underline block">
                          {item.contractProject}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-[#8295AD]">
                          {item.contractId}
                        </span>
                      </button>
                    </td>

                    {/* Variation Type */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-800 dark:text-[#CBD5E1] whitespace-nowrap">
                      {item.variationType}
                    </td>

                    {/* Deviation / Change */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 dark:text-[#F1F5F9] block">
                        {item.deviation}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-[#8295AD] font-mono block mt-0.5">
                        {item.original} → {item.current}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Action (Review / View Evidence) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onGoToEvidence()}
                          className="px-2.5 py-1 rounded border border-slate-300 dark:border-[#263449] bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-[#182235] dark:hover:bg-[#202E44] dark:active:bg-[#151D2D] text-slate-700 dark:text-[#E2E8F0] text-xs font-mono font-medium transition-colors cursor-pointer"
                          title="View supporting evidence"
                        >
                          Evidence
                        </button>
                        <button
                          onClick={() => onGoToReviews(item.contractId, item.variationId)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#1E4E8C] hover:bg-[#163C6D] active:bg-[#102D52] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] text-white text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3 text-blue-200" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {attentionItems.length > 8 && (
            <div className="p-3.5 border-t border-slate-100 dark:border-[#263449] bg-slate-50/50 dark:bg-[#182235]/40 text-center">
              <button
                onClick={() => onGoToReviews()}
                className="text-xs font-mono font-medium text-[#1E4E8C] dark:text-[#60A5FA] hover:underline cursor-pointer"
              >
                View all {attentionItems.length} review items in Review Desk 
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
