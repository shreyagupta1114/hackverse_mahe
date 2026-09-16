import React, { useState } from 'react';
import { Contract, TimelineEvent, EvidenceDocument, VariationItem } from '../types';
import { ContractDNA } from './ContractDNA';
import { CommitmentVsCurrent } from './CommitmentVsCurrent';
import { VariationTimeline } from './VariationTimeline';
import { WhyFlaggedModal } from './WhyFlaggedModal';
import { EventDetailModal } from './EventDetailModal';
import { EvidencePreviewModal } from './EvidencePreviewModal';
import { OfficerActionModal, ActionType } from './OfficerActionModal';
import {
  FileText,
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Send,
  HelpCircle,
  FolderGit2,
  PlusCircle,
  MessageSquare,
  History,
} from 'lucide-react';

interface ContractDetailProps {
  contract: Contract;
  onTakeOfficerAction: (
    actionType: ActionType,
    contractId: string,
    variationId?: string,
    noteText?: string,
    officerName?: string
  ) => void;
  onVerifyEvidence: (evidenceId: string) => void;
  onOpenComparisonWithSelf: (contractId: string) => void;
}

export const ContractDetail: React.FC<ContractDetailProps> = ({
  contract,
  onTakeOfficerAction,
  onVerifyEvidence,
  onOpenComparisonWithSelf,
}) => {
  // Modal states
  const [whyFlaggedOpen, setWhyFlaggedOpen] = useState(false);
  const [focusedVariationId, setFocusedVariationId] = useState<string | undefined>(undefined);

  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<TimelineEvent | null>(null);
  const [selectedEvidenceDoc, setSelectedEvidenceDoc] = useState<EvidenceDocument | null>(null);

  const [officerActionModalOpen, setOfficerActionModalOpen] = useState(false);
  const [activeActionType, setActiveActionType] = useState<ActionType>('RECORD_NOTE');
  const [activeVariationForAction, setActiveVariationForAction] = useState<VariationItem | undefined>(undefined);

  const handleOpenAction = (type: ActionType, variation?: VariationItem) => {
    setActiveActionType(type);
    setActiveVariationForAction(variation);
    setOfficerActionModalOpen(true);
  };

  const handleOpenWhyFlagged = (variationId?: string) => {
    setFocusedVariationId(variationId);
    setWhyFlaggedOpen(true);
  };

  const handleOpenEvidence = (evidenceId: string) => {
    const doc = contract.evidenceDocs.find((d) => d.id === evidenceId) || contract.evidenceDocs[0];
    if (doc) setSelectedEvidenceDoc(doc);
  };

  const priorityColor =
    contract.reviewPriority === 'HIGH'
      ? 'bg-rose-50 border-rose-300 text-rose-950'
      : contract.reviewPriority === 'MEDIUM'
      ? 'bg-amber-50 border-amber-300 text-amber-950'
      : 'bg-emerald-50 border-emerald-300 text-emerald-950';

  const priorityBadgeColor =
    contract.reviewPriority === 'HIGH'
      ? 'bg-rose-600 text-white'
      : contract.reviewPriority === 'MEDIUM'
      ? 'bg-amber-600 text-white'
      : 'bg-emerald-700 text-white';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* 1. TOP SECTION: Contract Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-white tracking-wider">
                CONTRACT {contract.id}
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300">
                {contract.department}
              </span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                  contract.overallStatus === 'ESCALATED'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : contract.overallStatus === 'EVIDENCE REQUIRED'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : contract.overallStatus === 'REVIEW'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                STATUS: {contract.overallStatus}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {contract.project}
            </h1>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-slate-600 font-mono">
              <div>
                Department: <strong className="text-slate-800">{contract.department}</strong>
              </div>
              <div>
                Primary Contractor: <strong className="text-slate-800">{contract.contractor.current}</strong>
              </div>
              <div>
                Award Date: <strong className="text-slate-800">{contract.awardDate}</strong>
              </div>
            </div>
          </div>

          {/* Quick Value Badge */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-right min-w-[220px]">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Procurement Value Shift
            </div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              {contract.contractValue.originalFormatted} →{' '}
              <span className="text-amber-700 font-extrabold">
                {contract.contractValue.currentFormatted}
              </span>
            </div>
            <div className="text-xs font-semibold text-amber-800 mt-0.5">
              +{contract.contractValue.variationPercent}% Variation (
              +₹{(contract.contractValue.current - contract.contractValue.original).toLocaleString('en-IN')})
            </div>
          </div>
        </div>

        {/* Action Bar inside Top Section */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-500 font-semibold uppercase text-[11px]">
              Officer Actions:
            </span>
            <button
              onClick={() => handleOpenAction('REQUEST_EVIDENCE')}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-900 border border-blue-300 rounded font-mono font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Request Evidence
            </button>
            <button
              onClick={() => handleOpenAction('MARK_REVIEWED')}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-emerald-900 border border-emerald-300 rounded font-mono font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Mark as Reviewed
            </button>
            <button
              onClick={() => handleOpenAction('ESCALATE')}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-rose-900 border border-rose-300 rounded font-mono font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Escalate for Review
            </button>
            <button
              onClick={() => handleOpenAction('RECORD_NOTE')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-mono font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Record Note
            </button>
          </div>

          <div>
            <button
              onClick={() => onOpenComparisonWithSelf(contract.id)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded font-mono font-bold transition-colors cursor-pointer"
            >
              Open Snapshot Comparison →
            </button>
          </div>
        </div>
      </div>

      {/* 2. UNIQUE CORE UI: Visual CONTRACT DNA View */}
      <ContractDNA
        contract={contract}
        onOpenWhyFlagged={handleOpenWhyFlagged}
        onOpenEvidence={handleOpenEvidence}
      />

      {/* 3. Section: COMMITMENT VS CURRENT */}
      <CommitmentVsCurrent
        contract={contract}
        onOpenWhyFlagged={handleOpenWhyFlagged}
      />

      {/* 4. Section: REVIEW PRIORITY (Rule-based, NOT AI risk score) */}
      <div className={`border rounded-lg p-5 sm:p-6 ${priorityColor}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-current/20 gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className={`font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-2xs ${priorityBadgeColor}`}
            >
              {contract.reviewPriority} PRIORITY
            </span>
            <h3 className="font-mono font-extrabold text-sm uppercase tracking-wide">
              Statutory Review Priority & Criteria
            </h3>
          </div>
          <span className="text-[11px] font-mono opacity-80">
            Rule-based compliance determination • Directive §14.4
          </span>
        </div>

        <div className="mt-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2">
            Deterministic Grounds for Prioritization:
          </div>
          <ul className="space-y-1.5 text-xs font-sans">
            {contract.priorityReasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-slate-800 font-mono mt-0.5">•</span>
                <span className="font-medium text-slate-900">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 pt-3 border-t border-current/15 flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span>
            CIVIC TRACE Policy: High or Medium Priority flags mandate verification and do NOT constitute an accusation of malfeasance.
          </span>
          <button
            onClick={() => handleOpenWhyFlagged()}
            className="underline font-bold text-slate-900 cursor-pointer"
          >
            Review exact thresholds →
          </button>
        </div>
      </div>

      {/* 5. Section: VARIATION TIMELINE */}
      <VariationTimeline
        events={contract.timelineEvents}
        contractId={contract.id}
        onOpenEventModal={(event) => setSelectedTimelineEvent(event)}
      />

      {/* 6. Section: EVIDENCE VAULT FOR THIS CONTRACT */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
              <h3 className="text-base font-extrabold text-slate-900 font-mono tracking-tight uppercase">
                Supporting Evidence Documents
              </h3>
              <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
                {contract.evidenceDocs.length} On Record
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Authenticated addenda, engineering lab certificates, and approvals tied directly to contract variations.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {contract.evidenceDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedEvidenceDoc(doc)}
              className="border border-slate-200 hover:border-slate-400 bg-slate-50/60 hover:bg-white rounded-lg p-4 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded bg-white border border-slate-300 flex items-center justify-center text-slate-700 group-hover:text-slate-900">
                  <FileText className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    doc.status === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : doc.status === 'Pending Review'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              <div className="mt-3 font-mono font-bold text-xs text-slate-900 group-hover:underline">
                {doc.filename}
              </div>

              <div className="mt-2 text-[11px] font-mono text-slate-500 space-y-0.5">
                <div>Uploaded: {doc.uploadDate}</div>
                <div>Linked: <strong className="text-slate-700">{doc.linkedChangeType}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Section: IMMUTABLE AUDIT TRAIL LOG */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
              <h3 className="text-base font-extrabold text-slate-900 font-mono tracking-tight uppercase">
                Contract Audit Trail & Officer Activity
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Chronological immutable ledger recording who changed what, when, and what evidence was attached.
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-200">
          {contract.auditTrail.length === 0 ? (
            <div className="text-xs text-slate-400 font-mono py-4 text-center">
              No manual interventions logged. System audit active.
            </div>
          ) : (
            contract.auditTrail.map((entry) => (
              <div key={entry.id} className="py-3 flex items-start justify-between gap-4 text-xs font-mono">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-slate-700 min-w-[90px] shrink-0 text-[11px]">
                    {entry.dateDisplay}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{entry.description}</span>
                    {entry.details && (
                      <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                        {entry.details}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-600 font-semibold">{entry.actor}</div>
                  <div className="text-[9px] text-slate-400">{entry.role}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <WhyFlaggedModal
        isOpen={whyFlaggedOpen}
        onClose={() => setWhyFlaggedOpen(false)}
        contract={contract}
        focusedVariationId={focusedVariationId}
      />

      <EventDetailModal
        event={selectedTimelineEvent}
        onClose={() => setSelectedTimelineEvent(null)}
        onOpenEvidenceFile={(f) => alert(`Opening ${f}`)}
      />

      <EvidencePreviewModal
        evidence={selectedEvidenceDoc}
        onClose={() => setSelectedEvidenceDoc(null)}
        onVerify={onVerifyEvidence}
      />

      <OfficerActionModal
        isOpen={officerActionModalOpen}
        onClose={() => setOfficerActionModalOpen(false)}
        contract={contract}
        variation={activeVariationForAction}
        actionType={activeActionType}
        onConfirmAction={onTakeOfficerAction}
      />
    </div>
  );
};
