import React, { useState } from 'react';
import { TimelineEvent } from '../types';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';

interface VariationTimelineProps {
  events: TimelineEvent[];
  contractId: string;
  onOpenEventModal: (event: TimelineEvent) => void;
}

export const VariationTimeline: React.FC<VariationTimelineProps> = ({
  events,
  contractId,
  onOpenEventModal,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    events[1]?.id || events[0]?.id || ''
  );

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
            <h3 className="text-base font-extrabold text-slate-900 font-mono tracking-tight uppercase">
              Variation Timeline
            </h3>
            <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
              Chronological Audit Trail
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Sequential progression of contract award and subsequent modifications. Click any event node to inspect evidence.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Total Events: <strong className="text-slate-800">{events.length}</strong>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Timeline Chain (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
            Event Sequence (Click to inspect)
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {events.map((evt, idx) => {
              const isSelected = evt.id === selectedEventId;
              const isAward = evt.category === 'Contract Award';

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`relative group cursor-pointer transition-all rounded-md p-3 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  {/* Timeline node circle */}
                  <span
                    className={`absolute -left-[27px] top-3.5 w-3 h-3 rounded-full border-2 transition-transform ${
                      isSelected
                        ? 'bg-amber-400 border-slate-900 scale-125'
                        : isAward
                        ? 'bg-emerald-500 border-white'
                        : 'bg-slate-400 border-white group-hover:scale-110'
                    }`}
                  ></span>

                  {/* Event summary header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-mono font-extrabold uppercase tracking-wider ${
                        isSelected ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      {evt.dateShort}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isSelected
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {evt.category}
                    </span>
                  </div>

                  <div className="mt-1 font-bold text-xs leading-snug">
                    {evt.title}
                  </div>

                  <div
                    className={`text-[11px] mt-1 truncate ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {evt.whatChanged}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Event Inspector Card (lg:col-span-7) */}
        {selectedEvent && (
          <div className="lg:col-span-7 bg-slate-50 border border-slate-300 rounded-lg p-5 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                  {selectedEvent.date}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  Ref: {selectedEvent.id}
                </span>
              </div>

              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  selectedEvent.reviewStatus === 'NORMAL'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedEvent.reviewStatus === 'ESCALATED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {selectedEvent.reviewStatus}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-base font-bold text-slate-900">
                {selectedEvent.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {selectedEvent.whatChanged}
              </p>
            </div>

            {/* Previous vs New Value Box */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white border border-slate-200 rounded p-3">
                <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 block mb-1">
                  Previous Value
                </span>
                <span className="text-xs font-mono font-medium text-slate-700">
                  {selectedEvent.previousValue}
                </span>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded p-3">
                <span className="text-[10px] font-mono font-semibold uppercase text-amber-800 block mb-1">
                  New Value
                </span>
                <span className="text-xs font-mono font-bold text-amber-950">
                  {selectedEvent.newValue}
                </span>
              </div>
            </div>

            {/* Reason Provided */}
            <div className="mt-4 bg-white border border-slate-200 rounded p-3">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 block mb-1">
                Reason Provided by Contractor / Department:
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-sans">
                "{selectedEvent.reasonProvided}"
              </p>
            </div>

            {/* Supporting Evidence */}
            <div className="mt-4">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 block mb-1.5">
                Supporting Evidence Attached:
              </span>
              <div className="space-y-1.5">
                {selectedEvent.supportingEvidenceTitles.map((title, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white border border-slate-200 rounded px-3 py-2 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-800 truncate">{title}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0 ml-2">
                      On Record
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Open full inspection modal button */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => onOpenEventModal(selectedEvent)}
                className="text-xs font-mono font-bold text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Full Event Audit Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
