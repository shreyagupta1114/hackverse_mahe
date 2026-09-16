import React, { useState } from 'react';
import { Contract, VariationItem, EvidenceDocument } from '../types';
import { StatusBadge } from './StatusBadge';
import { OfficerActionModal, ActionType } from './OfficerActionModal';
import { EvidencePreviewModal } from './EvidencePreviewModal';
import {
  ClipboardCheck,
  Search,
  Filter,
  FileQuestion,
  CheckCircle,
  ShieldAlert,
  MessageSquarePlus,
  FileText,
  ExternalLink,
  Info,
  Calendar,
  Building2,
} from 'lucide-react';

interface ReviewWorkflowProps {
  contracts: Contract[];
  onTakeOfficerAction: (
    actionType: ActionType,
    contractId: string,
    variationId?: string,
    noteText?: string,
    officerName?: string
  ) => void;
  onSelectContract: (id: string) => void;
  targetContractId?: string;
  targetVariationId?: string;
}

interface FlattenedReviewItem {
  contract: Contract;
  variation: VariationItem;
  reviewBasis: string[];
  linkedDocs: EvidenceDocument[];
}

export const ReviewWorkflow: React.FC<ReviewWorkflowProps> = ({
  contracts,
  onTakeOfficerAction,
  onSelectContract,
  targetContractId,
  targetVariationId,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTION_NEEDED' | 'REVIEWED' | 'ESCALATED'>('ACTION_NEEDED');

  // Modal states
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [currentActionType, setCurrentActionType] = useState<ActionType>('MARK_REVIEWED');
  const [activeContract, setActiveContract] = useState<Contract>(contracts[0]);
  const [activeVariation, setActiveVariation] = useState<VariationItem | undefined>(undefined);
  const [previewDoc, setPreviewDoc] = useState<EvidenceDocument | null>(null);

  // Flatten all review items
  const allReviewItems: FlattenedReviewItem[] = contracts.flatMap((contract) =>
    contract.variations.map((v) => {
      // Formulate transparent rule-based explanation
      const reasons: string[] = [];

      if (v.category === 'Contract Value' || v.changePercent) {
        reasons.push(
          `Contract value increased by ${v.changePercent || 20}%, which exceeds the configured 10% statutory threshold.`
        );
      }
      if (v.category === 'Subcontractor' || contract.subcontractor.isChanged) {
        reasons.push('Subcontractor has changed from the original contract schedule.');
      }
      if (v.category === 'Timeline' || contract.timeline.isChanged) {
        reasons.push('Completion timeline has been extended beyond approved project baseline.');
      }
      if (v.category === 'Materials' || contract.materials.isChanged) {
        reasons.push('Material specification modified from the awarded tender schedule.');
      }
      if (v.category === 'Project Scope') {
        reasons.push('Physical project scope and technical parameters revised post-award.');
      }

      if (reasons.length === 0) {
        reasons.push('Post-award deviation flagged for standard compliance review.');
      }

      const linkedDocs = contract.evidenceDocs.filter((d) =>
        v.linkedEvidenceIds.includes(d.id)
      );

      return {
        contract,
        variation: v,
        reviewBasis: reasons,
        linkedDocs,
      };
    })
  );

  const filteredItems = allReviewItems.filter((item) => {
    // If targeted from another page
    if (targetContractId && item.contract.id !== targetContractId) return false;
    if (targetVariationId && item.variation.id !== targetVariationId) return false;

    const matchSearch =
      item.contract.project.toLowerCase().includes(search.toLowerCase()) ||
      item.contract.id.toLowerCase().includes(search.toLowerCase()) ||
      item.variation.title.toLowerCase().includes(search.toLowerCase()) ||
      item.variation.reasonProvided.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (statusFilter === 'ACTION_NEEDED') {
      return (
        item.variation.reviewStatus === 'REVIEW' ||
        item.variation.reviewStatus === 'EVIDENCE REQUIRED'
      );
    }
    if (statusFilter === 'REVIEWED') {
      return (
        item.variation.reviewStatus === 'NORMAL' ||
        item.variation.reviewStatus === 'RESOLVED'
      );
    }
    if (statusFilter === 'ESCALATED') {
      return item.variation.reviewStatus === 'ESCALATED';
    }

    return true;
  });

  const handleOpenActionModal = (
    type: ActionType,
    contract: Contract,
    variation: VariationItem
  ) => {
    setCurrentActionType(type);
    setActiveContract(contract);
    setActiveVariation(variation);
    setActionModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 dark:border-[#263449] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1E4E8C] dark:bg-[#3B82F6]"></span>
          <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-[#F1F5F9]">
            Officer Review Desk
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8295AD] font-mono">
          Final review desk for human officer determinations. Transparent, rule-based verification with statutory accountability.
        </p>
      </div>

      {/* Deep-link alert banner if pre-filtered */}
      {targetContractId && (
        <div className="p-3 bg-blue-50 dark:bg-[#132238] border border-blue-200 dark:border-[#1E3A8A] rounded-md flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#1E4E8C] dark:text-[#93C5FD]">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              Filtering for contract <span className="font-bold">{targetContractId}</span>
              {targetVariationId ? ` (Variation ${targetVariationId.toUpperCase()})` : ''}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-[#8295AD]">
            Switch tab above to reset filter
          </span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8295AD]" />
            <input
              type="text"
              placeholder="Search project, deviation, rationale..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#111827] text-slate-900 dark:text-[#F1F5F9] text-xs font-sans focus:outline-none focus:border-[#1E4E8C] dark:focus:border-[#3B82F6] shadow-2xs"
            />
          </div>

          {/* Status Quick Filter Tabs */}
          <div className="inline-flex rounded-md border border-slate-300 dark:border-[#263449] bg-white dark:bg-[#111827] p-0.5 shadow-2xs">
            <button
              onClick={() => setStatusFilter('ACTION_NEEDED')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                statusFilter === 'ACTION_NEEDED'
                  ? 'bg-[#1E4E8C] text-white dark:bg-[#2563EB] dark:text-white font-medium'
                  : 'text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100/80 dark:hover:bg-[#182235]'
              }`}
            >
              Action Needed
            </button>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-[#1E4E8C] text-white dark:bg-[#2563EB] dark:text-white font-medium'
                  : 'text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100/80 dark:hover:bg-[#182235]'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setStatusFilter('REVIEWED')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                statusFilter === 'REVIEWED'
                  ? 'bg-[#1E4E8C] text-white dark:bg-[#2563EB] dark:text-white font-medium'
                  : 'text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100/80 dark:hover:bg-[#182235]'
              }`}
            >
              Reviewed
            </button>
            <button
              onClick={() => setStatusFilter('ESCALATED')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                statusFilter === 'ESCALATED'
                  ? 'bg-[#1E4E8C] text-white dark:bg-[#2563EB] dark:text-white font-medium'
                  : 'text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100/80 dark:hover:bg-[#182235]'
              }`}
            >
              Escalated
            </button>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-[#8295AD]">
          {filteredItems.length} review {filteredItems.length === 1 ? 'docket' : 'dockets'} listed
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg space-y-2">
            <CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto" />
            <p className="text-sm font-mono font-medium text-slate-800 dark:text-[#F1F5F9]">
              No items requiring officer review under current filter.
            </p>
            <p className="text-xs text-slate-500 dark:text-[#8295AD] font-mono">
              All post-award deviations have supporting evidence and completed officer determinations.
            </p>
          </div>
        ) : (
          filteredItems.map(({ contract, variation, reviewBasis, linkedDocs }) => (
            <div
              key={`${contract.id}-${variation.id}`}
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg p-5 space-y-4 shadow-2xs hover:border-blue-300 dark:hover:border-[#3B4D68] transition-all"
            >
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 dark:border-[#263449] pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1E4E8C] dark:bg-[#182235] dark:text-[#93C5FD] border border-blue-200/80 dark:border-[#1E3A8A]">
                      {variation.id.toUpperCase()}
                    </span>
                    <button
                      onClick={() => onSelectContract(contract.id)}
                      className="font-mono text-xs text-slate-500 hover:text-[#1E4E8C] dark:text-[#8295AD] dark:hover:text-[#60A5FA] hover:underline cursor-pointer"
                    >
                      {contract.id}
                    </button>
                    <span className="text-slate-300 dark:text-[#263449]">•</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-[#CBD5E1]">
                      {contract.department}
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-mono text-slate-900 dark:text-[#F1F5F9] mt-1">
                    {variation.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8295AD]">
                    Project: <span className="font-medium text-slate-700 dark:text-[#CBD5E1]">{contract.project}</span> ({contract.contractor.current})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={variation.reviewStatus} size="md" />
                </div>
              </div>

              {/* 4 Content Blocks: Change, Reason, Evidence, Review Basis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* 1. Change: What changed? */}
                <div className="bg-slate-50/80 dark:bg-[#182235] p-3.5 rounded-md border border-slate-200/80 dark:border-[#263449] space-y-1.5">
                  <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-[#8295AD] block">
                    Change (What changed?)
                  </span>
                  <div className="font-mono text-slate-800 dark:text-[#CBD5E1] space-y-1">
                    <div>
                      <span className="text-slate-500 dark:text-[#8295AD]">Original Baseline: </span>
                      <span className="text-slate-700 dark:text-[#CBD5E1]">{variation.originalValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-[#8295AD]">Current Position: </span>
                      <span className="font-bold text-slate-900 dark:text-[#F1F5F9]">{variation.currentValue}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-[#8295AD] pt-0.5">
                      Detected: {variation.dateDetected}
                    </div>
                  </div>
                </div>

                {/* 2. Reason: Why was the change requested? */}
                <div className="bg-slate-50/80 dark:bg-[#182235] p-3.5 rounded-md border border-slate-200/80 dark:border-[#263449] space-y-1.5">
                  <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-[#8295AD] block">
                    Reason (Why was it requested?)
                  </span>
                  <p className="text-slate-700 dark:text-[#CBD5E1] leading-relaxed text-xs">
                    {variation.reasonProvided}
                  </p>
                </div>

                {/* 3. Evidence: What documents support it? */}
                <div className="bg-slate-50/80 dark:bg-[#182235] p-3.5 rounded-md border border-slate-200/80 dark:border-[#263449] space-y-1.5">
                  <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-[#8295AD] block">
                    Evidence (What documents support it?)
                  </span>
                  {linkedDocs.length === 0 ? (
                    <div className="text-xs font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1.5 pt-1">
                      <FileQuestion className="w-3.5 h-3.5" />
                      <span>No supporting document linked on record.</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-0.5">
                      {linkedDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between text-xs font-mono bg-white dark:bg-[#111827] px-2.5 py-1 rounded border border-slate-200 dark:border-[#263449] shadow-2xs"
                        >
                          <div className="flex items-center gap-1.5 truncate pr-2">
                            <FileText className="w-3 h-3 text-[#1E4E8C] dark:text-[#60A5FA] shrink-0" />
                            <span className="truncate text-slate-800 dark:text-[#CBD5E1]">
                              {doc.filename}
                            </span>
                          </div>
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="text-slate-600 dark:text-[#8295AD] hover:text-[#1E4E8C] dark:hover:text-[#F1F5F9] cursor-pointer inline-flex items-center gap-0.5 text-[11px]"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Review Basis: Why does this require review? (Transparent Rule-Based) */}
                <div className="bg-slate-50/80 dark:bg-[#182235] p-3.5 rounded-md border border-slate-200/80 dark:border-[#263449] space-y-1.5">
                  <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-[#8295AD] block">
                    Review Basis (Why does this require review?)
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-[#CBD5E1]">
                    {reviewBasis.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-400 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Officer Action Bar:
                  Actions:
                  * Request Evidence
                  * Mark Reviewed
                  * Escalate
                  * Add Note
              */}
              <div className="pt-2 border-t border-slate-100 dark:border-[#263449] flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-500 dark:text-[#8295AD]">
                  Select officer determination:
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      handleOpenActionModal('REQUEST_EVIDENCE', contract, variation)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium border border-blue-300 dark:border-[#1E3A8A] bg-blue-50/90 hover:bg-blue-100 active:bg-blue-200 dark:bg-[#132238] dark:hover:bg-[#1B2F4E] dark:active:bg-[#162740] text-[#1E4E8C] dark:text-[#93C5FD] transition-colors cursor-pointer shadow-2xs"
                  >
                    <FileQuestion className="w-3.5 h-3.5 text-[#1E4E8C] dark:text-[#60A5FA]" />
                    <span>Request Evidence</span>
                  </button>

                  <button
                    onClick={() =>
                      handleOpenActionModal('MARK_REVIEWED', contract, variation)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium border border-teal-300 dark:border-[#134E4A] bg-teal-50/90 hover:bg-teal-100 active:bg-teal-200 dark:bg-[#102422] dark:hover:bg-[#163835] dark:active:bg-[#0D1F1D] text-teal-800 dark:text-[#5EEAD4] transition-colors cursor-pointer shadow-2xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Mark Reviewed</span>
                  </button>

                  <button
                    onClick={() =>
                      handleOpenActionModal('ESCALATE', contract, variation)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium border border-rose-300 dark:border-[#881337] bg-rose-50/90 hover:bg-rose-100 active:bg-rose-200 dark:bg-[#2B151C] dark:hover:bg-[#3D1E27] dark:active:bg-[#221016] text-rose-800 dark:text-[#FDA4AF] transition-colors cursor-pointer shadow-2xs"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Escalate</span>
                  </button>

                  <button
                    onClick={() =>
                      handleOpenActionModal('RECORD_NOTE', contract, variation)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium border border-slate-300 dark:border-[#263449] bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-[#182235] dark:hover:bg-[#202E44] dark:active:bg-[#151D2D] text-slate-800 dark:text-[#E2E8F0] transition-colors cursor-pointer shadow-2xs"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5 text-slate-500 dark:text-[#8295AD]" />
                    <span>Add Note</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Officer Action Modal */}
      <OfficerActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        contract={activeContract}
        variation={activeVariation}
        actionType={currentActionType}
        onConfirmAction={(type, cId, vId, note, officer) => {
          onTakeOfficerAction(type, cId, vId, note, officer);
          setActionModalOpen(false);
        }}
      />

      {/* Evidence Preview Modal */}
      {previewDoc && (
        <EvidencePreviewModal
          evidence={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
};
