import React from 'react';
import { Contract, VariationItem } from '../types';
import { X, ShieldAlert, CheckCircle, AlertTriangle, FileText, Info, HelpCircle } from 'lucide-react';

interface WhyFlaggedModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  focusedVariationId?: string;
}

export const WhyFlaggedModal: React.FC<WhyFlaggedModalProps> = ({
  isOpen,
  onClose,
  contract,
  focusedVariationId,
}) => {
  if (!isOpen) return null;

  const variations = contract.variations;
  const activeVariation = focusedVariationId
    ? variations.find((v) => v.id === focusedVariationId) || variations[0]
    : variations[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-300 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-sm tracking-wide text-white uppercase">
                Why This Was Flagged
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Statutory Rule-Based Trigger Breakdown • Contract {contract.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainability Banner */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-3 text-xs text-slate-700 flex items-start gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            CIVIC TRACE operates on <strong>deterministic procurement thresholds</strong>. Flagged items represent statutory triggers requiring human verification, not automated accusations of wrongdoing.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {variations.length === 0 ? (
            <div className="text-center py-8 text-slate-500 font-mono text-xs">
              No active statutory thresholds exceeded for this contract.
            </div>
          ) : (
            variations.map((v) => {
              const rule = v.whyFlagged;
              const isHighlight = v.id === activeVariation?.id;

              return (
                <div
                  key={v.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isHighlight
                      ? 'border-slate-800 bg-slate-50/70 shadow-xs'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {/* Category & Severity Tag */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {v.category}: {v.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        v.severity === 'HIGH'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {v.severity} REVIEW PRIORITY
                    </span>
                  </div>

                  {/* Mathematical / Statutory Rule breakdown */}
                  <div className="bg-white border border-slate-200 rounded p-4 font-mono text-xs space-y-3">
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                        Statutory Rule Applied:
                      </span>
                      <strong className="text-slate-900 text-xs">
                        {rule.ruleName}
                      </strong>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-0.5">
                          Trigger Condition
                        </span>
                        <div className="font-bold text-slate-800">
                          {rule.triggerSummary}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-0.5">
                          Configured Review Threshold
                        </span>
                        <div className="font-bold text-slate-800">
                          {rule.configuredThreshold}
                        </div>
                      </div>
                    </div>

                    {/* Calculated difference */}
                    <div className="bg-amber-50/80 border border-amber-200 p-2.5 rounded text-amber-950">
                      <span className="text-[10px] uppercase text-amber-800 font-semibold block mb-0.5">
                        Statutory Variance Difference
                      </span>
                      <div className="font-bold">
                        {rule.actualDifference}
                      </div>
                    </div>

                    {/* Evidence summary */}
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] uppercase text-slate-400 font-semibold block mb-0.5">
                        Supporting Evidence Status ({rule.evidenceCount} Attached)
                      </span>
                      <div className="text-slate-700 font-sans text-xs">
                        {rule.evidenceStatusSummary}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Procurement Audit Directive #04/2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded transition-colors cursor-pointer"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
