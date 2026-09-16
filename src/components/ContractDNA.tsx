import React from 'react';
import { Contract, VariationCategory } from '../types';
import { ArrowRight, FileText, CheckCircle2, AlertTriangle, Clock, HelpCircle } from 'lucide-react';

interface ContractDNAProps {
  contract: Contract;
  onOpenWhyFlagged: (variationId?: string) => void;
  onOpenEvidence: (evidenceId: string) => void;
  onSelectCategory?: (category: VariationCategory) => void;
}

export const ContractDNA: React.FC<ContractDNAProps> = ({
  contract,
  onOpenWhyFlagged,
  onOpenEvidence,
  onSelectCategory,
}) => {
  // We represent the 5 core DNA strands: Contract Value, Subcontractor, Timeline, Materials, Scope
  const dnaStrands = [
    {
      category: 'Contract Value' as VariationCategory,
      title: 'CONTRACT VALUE',
      original: contract.contractValue.originalFormatted,
      current: contract.contractValue.currentFormatted,
      variation: contract.contractValue.isChanged
        ? `+${contract.contractValue.variationPercent}% VARIATION`
        : '0% VARIATION',
      isChanged: contract.contractValue.isChanged,
      evidenceTitle: contract.evidenceDocs.find((e) => e.linkedChangeType === 'Contract Value')?.filename || 'Revised Cost Approval.pdf',
      evidenceId: contract.evidenceDocs.find((e) => e.linkedChangeType === 'Contract Value')?.id || 'ev-1',
      reviewStatus: contract.contractValue.isChanged ? 'UNDER REVIEW' : 'VERIFIED',
      severity: contract.contractValue.variationPercent >= 20 ? 'HIGH' : 'MEDIUM',
      variationId: contract.variations.find((v) => v.category === 'Contract Value')?.id,
    },
    {
      category: 'Subcontractor' as VariationCategory,
      title: 'SUBCONTRACTOR',
      original: contract.subcontractor.original,
      current: contract.subcontractor.current,
      variation: contract.subcontractor.isChanged ? 'SIGNIFICANT VARIATION' : 'UNCHANGED',
      isChanged: contract.subcontractor.isChanged,
      evidenceTitle: contract.evidenceDocs.find((e) => e.linkedChangeType === 'Subcontractor')?.filename || 'Subcontractor Approval.pdf',
      evidenceId: contract.evidenceDocs.find((e) => e.linkedChangeType === 'Subcontractor')?.id || 'ev-2',
      reviewStatus: contract.subcontractor.isChanged ? 'PENDING REVIEW' : 'VERIFIED',
      severity: 'HIGH',
      variationId: contract.variations.find((v) => v.category === 'Subcontractor')?.id,
    },
    {
      category: 'Timeline' as VariationCategory,
      title: 'TIMELINE',
      original: contract.timeline.originalFormatted,
      current: contract.timeline.currentFormatted,
      variation: contract.timeline.isChanged
        ? `+${contract.timeline.variationPercent}% VARIATION`
        : 'ON SCHEDULE',
      isChanged: contract.timeline.isChanged,
      evidenceTitle: contract.evidenceDocs[0]?.filename || 'Schedule Revision Memo.pdf',
      evidenceId: contract.evidenceDocs[0]?.id || 'ev-1',
      reviewStatus: contract.timeline.isChanged ? 'UNDER REVIEW' : 'COMPLIANT',
      severity: contract.timeline.variationPercent >= 30 ? 'MEDIUM' : 'LOW',
      variationId: contract.variations.find((v) => v.category === 'Timeline')?.id,
    },
    {
      category: 'Materials' as VariationCategory,
      title: 'MATERIALS SPECIFICATION',
      original: contract.materials.original.split('&')[0].trim(),
      current: contract.materials.current.split('&')[0].trim(),
      variation: contract.materials.isChanged ? 'SPECIFICATION REVISION' : 'CONFORMING',
      isChanged: contract.materials.isChanged,
      evidenceTitle: contract.evidenceDocs.find((e) => e.linkedChangeType === 'Materials')?.filename || 'Invoice_042.pdf',
      evidenceId: contract.evidenceDocs.find((e) => e.linkedChangeType === 'Materials')?.id || 'ev-3',
      reviewStatus: contract.materials.isChanged ? 'UNDER REVIEW' : 'VERIFIED',
      severity: 'MEDIUM',
      variationId: contract.variations.find((v) => v.category === 'Materials')?.id,
    },
    {
      category: 'Project Scope' as VariationCategory,
      title: 'PROJECT SCOPE & CROSS-SECTION',
      original: contract.scope.original.slice(0, 42) + '...',
      current: contract.scope.current.slice(0, 42) + '...',
      variation: contract.scope.isChanged ? 'ALIGNMENT REVISED' : 'UNALTERED',
      isChanged: contract.scope.isChanged,
      evidenceTitle: contract.evidenceDocs[0]?.filename || 'Technical_Addendum.pdf',
      evidenceId: contract.evidenceDocs[0]?.id || 'ev-1',
      reviewStatus: contract.scope.isChanged ? 'UNDER REVIEW' : 'VERIFIED',
      severity: 'MEDIUM',
      variationId: contract.variations.find((v) => v.category === 'Project Scope')?.id,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs">
      {/* Header of DNA Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
            <h3 className="text-base font-extrabold text-slate-900 font-mono tracking-tight uppercase">
              Visual Contract DNA
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
              Differential Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            ORIGINAL COMMITMENT → CURRENT STATUS → VARIATION → EVIDENCE → REVIEW STATUS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenWhyFlagged()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Why This Was Flagged?</span>
          </button>
        </div>
      </div>

      {/* DNA Pipeline Rows */}
      <div className="mt-5 space-y-3.5">
        {dnaStrands.map((strand, index) => (
          <div
            key={index}
            className={`border rounded-md p-3.5 transition-all ${
              strand.isChanged
                ? 'bg-slate-50/70 border-slate-300 hover:border-slate-400'
                : 'bg-white border-slate-200 opacity-90'
            }`}
          >
            {/* Strand Title */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                {strand.title}
              </span>
              {strand.isChanged && (
                <button
                  onClick={() => onOpenWhyFlagged(strand.variationId)}
                  className="text-[10px] font-mono font-semibold text-amber-800 hover:underline cursor-pointer flex items-center gap-1"
                >
                  Inspect Rule & Threshold →
                </button>
              )}
            </div>

            {/* Horizontal 5-Step Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-xs">
              {/* 1. ORIGINAL COMMITMENT */}
              <div className="bg-white border border-slate-200 rounded p-2.5 shadow-2xs">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-0.5">
                  1. Original Commitment
                </div>
                <div className="font-mono font-semibold text-slate-800 truncate" title={strand.original}>
                  {strand.original}
                </div>
              </div>

              {/* 2. CURRENT STATUS */}
              <div
                className={`border rounded p-2.5 shadow-2xs ${
                  strand.isChanged
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold mb-0.5">
                  2. Current Status
                </div>
                <div className="font-mono font-bold truncate" title={strand.current}>
                  {strand.current}
                </div>
              </div>

              {/* 3. VARIATION */}
              <div
                className={`border rounded p-2.5 text-center shadow-2xs ${
                  strand.isChanged
                    ? strand.severity === 'HIGH'
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="text-[10px] font-mono uppercase font-semibold mb-0.5 opacity-80">
                  3. Variation
                </div>
                <div className="font-mono font-bold text-xs truncate">
                  {strand.variation}
                </div>
              </div>

              {/* 4. EVIDENCE */}
              <div
                onClick={() => onOpenEvidence(strand.evidenceId)}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded p-2.5 shadow-2xs cursor-pointer group transition-colors"
              >
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-0.5 flex items-center justify-between">
                  <span>4. Evidence Doc</span>
                  <FileText className="w-3 h-3 text-slate-400 group-hover:text-slate-800" />
                </div>
                <div
                  className="font-mono text-slate-700 group-hover:text-slate-950 font-medium truncate underline decoration-slate-300 text-[11px]"
                  title={strand.evidenceTitle}
                >
                  {strand.evidenceTitle}
                </div>
              </div>

              {/* 5. REVIEW STATUS */}
              <div
                className={`border rounded p-2.5 text-center shadow-2xs ${
                  strand.isChanged
                    ? 'bg-amber-100/70 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <div className="text-[10px] font-mono uppercase font-semibold mb-0.5 opacity-80">
                  5. Review Status
                </div>
                <div className="font-mono font-bold text-xs">
                  {strand.reviewStatus}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
