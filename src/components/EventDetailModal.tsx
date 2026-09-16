import React from 'react';
import { TimelineEvent } from '../types';
import { X, Calendar, FileText, CheckCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface EventDetailModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
  onOpenEvidenceFile?: (filename: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onOpenEvidenceFile,
}) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-300 rounded-lg max-w-xl w-full flex flex-col shadow-xl overflow-hidden font-sans">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
              {event.date}
            </span>
            <span className="font-mono font-bold text-sm uppercase text-slate-200">
              {event.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Category & Status */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="font-mono text-slate-500 uppercase font-semibold">
              Category: <strong className="text-slate-900">{event.category}</strong>
            </span>
            <span
              className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                event.reviewStatus === 'NORMAL'
                  ? 'bg-emerald-100 text-emerald-800'
                  : event.reviewStatus === 'ESCALATED'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {event.reviewStatus}
            </span>
          </div>

          {/* What Changed */}
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block mb-1">
              What Changed:
            </span>
            <div className="p-3 bg-white border border-slate-200 rounded font-medium text-slate-800 leading-relaxed">
              {event.whatChanged}
            </div>
          </div>

          {/* Previous Value vs New Value */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <span className="font-mono text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Previous Value
              </span>
              <div className="font-mono font-semibold text-slate-700">
                {event.previousValue}
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded p-3">
              <span className="font-mono text-[10px] uppercase font-semibold text-amber-800 block mb-1">
                New Value
              </span>
              <div className="font-mono font-bold text-amber-950">
                {event.newValue}
              </div>
            </div>
          </div>

          {/* Reason Provided */}
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Reason Provided by Contractor / Department:
            </span>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-800 leading-relaxed italic">
              "{event.reasonProvided}"
            </div>
          </div>

          {/* Supporting Evidence */}
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Supporting Evidence on File:
            </span>
            <div className="space-y-1.5">
              {event.supportingEvidenceTitles.map((title, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded font-mono text-slate-700"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{title}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Logged & Signed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Audit Event Hash: #EVT-{event.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold rounded cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
