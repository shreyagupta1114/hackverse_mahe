import React, { useState } from 'react';
import { Contract } from '../types';
import { ArrowRight, CheckCircle2, AlertCircle, ArrowLeftRight, HelpCircle, Layers } from 'lucide-react';

interface CommitmentVsCurrentProps {
  contract: Contract;
  onOpenWhyFlagged: (variationId?: string) => void;
}

export const CommitmentVsCurrent: React.FC<CommitmentVsCurrentProps> = ({
  contract,
  onOpenWhyFlagged,
}) => {
  // Micro-interaction state: 'compare' | 'transition_animating' | 'current_only'
  const [activeViewMode, setActiveViewMode] = useState<'comparison' | 'transition'>('comparison');
  const [transitionProgress, setTransitionProgress] = useState<'original' | 'current'>('current');

  const triggerTransitionDemo = () => {
    setActiveViewMode('transition');
    setTransitionProgress('original');
    setTimeout(() => {
      setTransitionProgress('current');
    }, 450);
  };

  const cards = [
    {
      title: 'Contractor',
      category: 'Contractor',
      original: contract.contractor.original,
      current: contract.contractor.current,
      isChanged: contract.contractor.isChanged,
      statusBadge: contract.contractor.isChanged ? 'MODIFIED' : 'CONFORMING',
      delta: null,
      variationId: undefined,
    },
    {
      title: 'Subcontractor',
      category: 'Subcontractor',
      original: contract.subcontractor.original,
      current: contract.subcontractor.current,
      isChanged: contract.subcontractor.isChanged,
      statusBadge: 'SIGNIFICANT VARIATION',
      delta: 'Entity Substitution',
      note: contract.subcontractor.changeNote,
      variationId: contract.variations.find((v) => v.category === 'Subcontractor')?.id,
    },
    {
      title: 'Contract Value',
      category: 'Contract Value',
      original: contract.contractValue.originalFormatted,
      current: contract.contractValue.currentFormatted,
      isChanged: contract.contractValue.isChanged,
      statusBadge: `+${contract.contractValue.variationPercent}% VARIATION`,
      delta: `+₹${(
        contract.contractValue.current - contract.contractValue.original
      ).toLocaleString('en-IN')}`,
      variationId: contract.variations.find((v) => v.category === 'Contract Value')?.id,
    },
    {
      title: 'Timeline',
      category: 'Timeline',
      original: contract.timeline.originalFormatted,
      current: contract.timeline.currentFormatted,
      isChanged: contract.timeline.isChanged,
      statusBadge: `+${contract.timeline.variationPercent}% EXTENSION`,
      delta: `+${
        contract.timeline.currentMonths - contract.timeline.originalMonths
      } Months`,
      variationId: contract.variations.find((v) => v.category === 'Timeline')?.id,
    },
    {
      title: 'Materials',
      category: 'Materials',
      original: contract.materials.original,
      current: contract.materials.current,
      isChanged: contract.materials.isChanged,
      statusBadge: 'REVIEW REQUIRED',
      delta: 'Specification Downgrade',
      note: contract.materials.specNote,
      variationId: contract.variations.find((v) => v.category === 'Materials')?.id,
    },
    {
      title: 'Project Scope',
      category: 'Project Scope',
      original: contract.scope.original,
      current: contract.scope.current,
      isChanged: contract.scope.isChanged,
      statusBadge: contract.scope.isChanged ? 'ALIGNMENT REVISION' : 'CONFORMING',
      delta: contract.scope.isChanged ? 'Geometry Shift' : null,
      note: contract.scope.scopeNote,
      variationId: contract.variations.find((v) => v.category === 'Project Scope')?.id,
    },
    {
      title: 'Quantities & Workload',
      category: 'Quantities',
      original: contract.quantities.original,
      current: contract.quantities.current,
      isChanged: contract.quantities.isChanged,
      statusBadge: contract.quantities.isChanged ? 'VOLUME INCREASE' : 'CONFORMING',
      delta: contract.quantities.isChanged ? '+15.2% Bituminous' : null,
      note: contract.quantities.qtyNote,
      variationId: undefined,
    },
    {
      title: 'Active Deliverable Milestones',
      category: 'Milestones',
      original: `${contract.milestones.length} Milestones Scheduled`,
      current: `${
        contract.milestones.filter((m) => m.progressPercent === 100).length
      }/${contract.milestones.length} Delivered (${
        contract.milestones.filter((m) => m.currentStatus.includes('Delayed')).length
      } Delayed)`,
      isChanged: true,
      statusBadge: 'SCHEDULE MONITOR',
      delta: 'Target Shifts',
      note: 'Critical path delayed on Sub-grade and Granular Sub-base phases.',
      variationId: undefined,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            <h3 className="text-base font-extrabold text-slate-900 font-mono tracking-tight uppercase">
              Commitment vs Current
            </h3>
            <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
              Contract Baseline Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Direct comparison between awarded tender commitments and active contractor disclosures.
          </p>
        </div>

        {/* Micro-interaction controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveViewMode('comparison')}
            className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
              activeViewMode === 'comparison'
                ? 'bg-slate-900 text-white border-slate-900 font-bold'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Side-by-Side View
          </button>
          <button
            onClick={triggerTransitionDemo}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
              activeViewMode === 'transition'
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Simulate transition animation from original baseline to current values"
          >
            <ArrowLeftRight className="w-3 h-3 text-amber-700" />
            <span>Transition Demo</span>
          </button>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`border rounded-lg p-4 transition-all duration-300 ${
              card.isChanged
                ? 'bg-slate-50/70 border-slate-300 hover:border-slate-400'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Card Top Label */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/80">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                {card.title}
              </span>

              <div className="flex items-center gap-2">
                {card.isChanged ? (
                  <button
                    onClick={() => onOpenWhyFlagged(card.variationId)}
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer"
                    title="Field has post-award modifications. Click to inspect rule trigger."
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                    <span>Changed</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Conforming</span>
                  </span>
                )}
              </div>
            </div>

            {/* Values Comparison Display */}
            {activeViewMode === 'comparison' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Original */}
                <div className="bg-white border border-slate-200 rounded p-2.5 shadow-2xs">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1">
                    Original Commitment
                  </div>
                  <div className="text-xs font-semibold text-slate-700 font-mono leading-snug">
                    {card.original}
                  </div>
                </div>

                {/* Current */}
                <div
                  className={`border rounded p-2.5 shadow-2xs ${
                    card.isChanged
                      ? 'bg-amber-50/60 border-amber-200 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold mb-1 flex items-center justify-between">
                    <span>Current Status</span>
                    {card.statusBadge && card.isChanged && (
                      <span className="text-[9px] font-bold text-amber-800 font-mono">
                        {card.statusBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold font-mono leading-snug text-slate-900">
                    {card.current}
                  </div>
                </div>
              </div>
            ) : (
              /* Transition mode (animates from original to current on button click) */
              <div className="bg-white border border-slate-200 rounded p-3 text-xs font-mono transition-all">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>
                    State:{' '}
                    <strong className="text-slate-800 uppercase">
                      {transitionProgress === 'original'
                        ? 'Original Approved Tender'
                        : 'Current Field Value'}
                    </strong>
                  </span>
                  <span className="text-amber-700 font-bold">
                    {transitionProgress === 'original' ? 'Baseline' : 'Active Variance'}
                  </span>
                </div>
                <div
                  className={`text-sm font-bold transition-all duration-300 ${
                    transitionProgress === 'original'
                      ? 'text-slate-600'
                      : card.isChanged
                      ? 'text-amber-900 font-extrabold bg-amber-50 p-1.5 rounded border border-amber-200'
                      : 'text-slate-900'
                  }`}
                >
                  {transitionProgress === 'original' ? card.original : card.current}
                </div>
              </div>
            )}

            {/* Note or contextual change observation */}
            {card.note && (
              <div className="mt-2.5 text-[11px] text-slate-500 font-sans bg-slate-100/60 rounded px-2 py-1.5 border border-slate-200/60 flex items-start gap-1.5">
                <span className="font-semibold text-slate-700 font-mono text-[10px]">NOTE:</span>
                <span>{card.note}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
