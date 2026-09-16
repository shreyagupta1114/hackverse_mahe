import React, { useState } from 'react';
import { Contract, VariationItem, EvidenceDocument } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  Search,
  Filter,
  AlertCircle,
  FileText,
  ExternalLink,
  ClipboardCheck,
  X,
  Calendar,
  CheckCircle,
  Building2,
} from 'lucide-react';

interface VariationsRegistryProps {
  contracts: Contract[];
  onSelectContract: (contractId: string) => void;
  onGoToReview: (contractId: string, variationId: string) => void;
  onPreviewEvidence: (doc: EvidenceDocument) => void;
}

interface FlattenedVariation {
  id: string;
  contractId: string;
  contractProject: string;
  department: string;
  category: string;
  title: string;
  originalValue: string;
  currentValue: string;
  dateDetected: string;
  reasonProvided: string;
  reviewStatus: string;
  severity: string;
  linkedEvidenceIds: string[];
}

export const VariationsRegistry: React.FC<VariationsRegistryProps> = ({
  contracts,
  onSelectContract,
  onGoToReview,
  onPreviewEvidence,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVariation, setSelectedVariation] = useState<FlattenedVariation | null>(null);

  // Flatten all variations across contracts
  const allVariations: FlattenedVariation[] = [];
  contracts.forEach((c) => {
    c.variations.forEach((v) => {
      // Clean mapping of category to Variation Type
      let typeLabel = v.category;
      if (v.category === 'Contract Value') typeLabel = 'Cost Change';
      else if (v.category === 'Timeline') typeLabel = 'Timeline Extension';
      else if (v.category === 'Subcontractor') typeLabel = 'Subcontractor Change';
      else if (v.category === 'Materials') typeLabel = 'Material Change';
      else if (v.category === 'Project Scope') typeLabel = 'Specification Change';

      allVariations.push({
        id: v.id,
        contractId: c.id,
        contractProject: c.project,
        department: c.department,
        category: typeLabel,
        title: v.title,
        originalValue: v.originalValue,
        currentValue: v.currentValue,
        dateDetected: v.dateDetected,
        reasonProvided: v.reasonProvided,
        reviewStatus: v.reviewStatus,
        severity: v.severity,
        linkedEvidenceIds: v.linkedEvidenceIds,
      });
    });
  });

  const filteredVariations = allVariations.filter((v) => {
    const matchSearch =
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.contractProject.toLowerCase().includes(search.toLowerCase()) ||
      v.contractId.toLowerCase().includes(search.toLowerCase()) ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.reasonProvided.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === 'ALL' || v.category === typeFilter;
    const matchStatus = statusFilter === 'ALL' || v.reviewStatus === statusFilter;

    return matchSearch && matchType && matchStatus;
  });

  const variationTypes = [
    'ALL',
    'Cost Change',
    'Timeline Extension',
    'Subcontractor Change',
    'Material Change',
    'Specification Change',
  ];

  const getLinkedDocs = (variation: FlattenedVariation): EvidenceDocument[] => {
    const parentContract = contracts.find((c) => c.id === variation.contractId);
    if (!parentContract) return [];
    return parentContract.evidenceDocs.filter((d) =>
      variation.linkedEvidenceIds.includes(d.id)
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 dark:border-[#263449] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-[#F1F5F9]">
            Variations Registry
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8295AD] font-mono">
          Post Contract Modifications in Public Agreements
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8295AD]" />
            <input
              type="text"
              placeholder="Search variation, contract, rationale..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#111827] text-slate-900 dark:text-[#F1F5F9] text-xs font-sans focus:outline-none focus:border-[#1E4E8C] dark:focus:border-[#3B82F6] shadow-2xs"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-1.5 px-2.5 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#111827] text-slate-800 dark:text-[#CBD5E1] cursor-pointer shadow-2xs focus:outline-none focus:border-[#1E4E8C]"
          >
            {variationTypes.map((t) => (
              <option key={t} value={t}>
                {t === 'ALL' ? 'All Variation Types' : t}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#111827] text-slate-800 dark:text-[#CBD5E1] cursor-pointer shadow-2xs focus:outline-none focus:border-[#1E4E8C]"
          >
            <option value="ALL">All Statuses</option>
            <option value="EVIDENCE REQUIRED">Evidence Required</option>
            <option value="REVIEW">Under Review</option>
            <option value="NORMAL">Reviewed</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-[#8295AD]">
          Showing {filteredVariations.length} of {allVariations.length} variations
        </div>
      </div>

      {/* Clean Table with exact columns:
          Variation ID | Contract | Type | Date | Reason | Status | Action
      */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#182235] text-slate-600 dark:text-[#CBD5E1] border-b border-slate-200 dark:border-[#263449] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Variation ID</th>
                <th className="py-3 px-4 font-semibold">Contract</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Type</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Date</th>
                <th className="py-3 px-4 font-semibold">Stated Rationale</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Status</th>
                <th className="py-3 px-4 font-semibold text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#263449]/60">
              {filteredVariations.map((v) => (
                <tr
                  key={`${v.contractId}-${v.id}`}
                  onClick={() => setSelectedVariation(v)}
                  className="hover:bg-blue-50/40 dark:hover:bg-[#182235] transition-colors duration-100 cursor-pointer"
                >
                  {/* Variation ID */}
                  <td className="py-3 px-4 font-mono font-bold text-[#1E4E8C] dark:text-[#60A5FA] whitespace-nowrap">
                    {v.id.toUpperCase()}
                  </td>

                  {/* Contract */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 dark:text-[#F1F5F9] block">
                      {v.contractProject}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-[#8295AD] font-mono">
                      {v.contractId}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4 font-mono font-medium text-slate-800 dark:text-[#CBD5E1] whitespace-nowrap">
                    {v.category}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-[#8295AD] whitespace-nowrap">
                    {v.dateDetected}
                  </td>

                  {/* Reason */}
                  <td className="py-3 px-4 text-slate-600 dark:text-[#CBD5E1] max-w-xs truncate">
                    {v.reasonProvided}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={v.reviewStatus} />
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariation(v);
                      }}
                      className="px-2.5 py-1 rounded border border-slate-300 dark:border-[#263449] bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-[#182235] dark:hover:bg-[#202E44] dark:active:bg-[#151D2D] text-slate-800 dark:text-[#E2E8F0] text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Variation Detail Modal:
          Answers:
          1. What changed? (Variation Type, Original, Updated, Date)
          2. Why was it changed? (Stated reason from docket)
          3. What evidence is available? (Linked documents with preview)
          4. Review Status (Evidence Required / Under Review / Reviewed)
      */}
      {selectedVariation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-2xs transition-opacity">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg max-w-xl w-full p-5 sm:p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Top Bar */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-[#263449] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1E4E8C] dark:text-[#93C5FD] bg-blue-50 dark:bg-[#182235] px-2 py-0.5 rounded border border-blue-200/80 dark:border-[#1E3A8A]">
                    {selectedVariation.id.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-[#8295AD]">
                    {selectedVariation.contractId}
                  </span>
                </div>
                <h3 className="text-base font-bold font-mono text-slate-900 dark:text-[#F1F5F9] mt-1.5">
                  {selectedVariation.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#8295AD]">
                  {selectedVariation.contractProject}
                </p>
              </div>

              <button
                onClick={() => setSelectedVariation(null)}
                className="text-slate-400 hover:text-slate-700 dark:text-[#8295AD] dark:hover:text-[#F1F5F9] p-1 rounded hover:bg-slate-100 dark:hover:bg-[#182235] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. What changed? */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-600 dark:text-[#8295AD]">
                1. What Changed?
              </h4>
              <div className="bg-slate-50/80 dark:bg-[#182235] p-3.5 rounded-md border border-slate-200/80 dark:border-[#263449] space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-slate-200/60 dark:border-[#263449] pb-1.5">
                  <span className="text-slate-500 dark:text-[#8295AD]">Variation Type:</span>
                  <span className="font-semibold text-slate-900 dark:text-[#F1F5F9]">
                    {selectedVariation.category}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 dark:border-[#263449] pb-1.5">
                  <span className="text-slate-500 dark:text-[#8295AD]">Original Baseline:</span>
                  <span className="text-slate-700 dark:text-[#CBD5E1]">
                    {selectedVariation.originalValue}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 dark:border-[#263449] pb-1.5">
                  <span className="text-slate-500 dark:text-[#8295AD]">Updated Current:</span>
                  <span className="font-bold text-slate-900 dark:text-[#F1F5F9]">
                    {selectedVariation.currentValue}
                  </span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-500 dark:text-[#8295AD]">Detection Date:</span>
                  <span className="text-slate-800 dark:text-[#CBD5E1]">
                    {selectedVariation.dateDetected}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Why was it changed? */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-600 dark:text-[#8295AD]">
                2. Why Was It Changed?
              </h4>
              <div className="bg-slate-50/80 dark:bg-[#182235] p-3.5 rounded-md border border-slate-200/80 dark:border-[#263449] text-xs text-slate-700 dark:text-[#CBD5E1] leading-relaxed">
                {selectedVariation.reasonProvided}
              </div>
            </div>

            {/* 3. What evidence is available? */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-600 dark:text-[#8295AD]">
                3. What Evidence Is Available?
              </h4>
              {getLinkedDocs(selectedVariation).length === 0 ? (
                <div className="p-3 text-xs font-mono text-slate-500 dark:text-[#8295AD] bg-slate-50/80 dark:bg-[#182235] rounded-md border border-slate-200/80 dark:border-[#263449]">
                  No linked documents on record. Evidence requested from contractor.
                </div>
              ) : (
                <div className="space-y-2">
                  {getLinkedDocs(selectedVariation).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50/80 dark:bg-[#182235] rounded-md border border-slate-200/80 dark:border-[#263449] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#1E4E8C] dark:text-[#60A5FA]" />
                        <div>
                          <span className="font-medium text-slate-900 dark:text-[#F1F5F9] block">
                            {doc.filename}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-[#8295AD]">
                            {doc.fileSize} • {doc.uploadDate}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onPreviewEvidence(doc)}
                        className="inline-flex items-center gap-1 text-xs font-mono text-slate-700 dark:text-[#E2E8F0] px-2.5 py-1 rounded bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-[#111827] dark:hover:bg-[#202E44] border border-slate-300 dark:border-[#263449] cursor-pointer shadow-2xs transition-colors"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Review Status & Action */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#263449] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 dark:text-[#8295AD]">
                  Status:
                </span>
                <StatusBadge status={selectedVariation.reviewStatus} />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedVariation(null)}
                  className="px-3 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-[#263449] text-slate-700 dark:text-[#E2E8F0] hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-[#182235] transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const v = selectedVariation;
                    setSelectedVariation(null);
                    onGoToReview(v.contractId, v.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1E4E8C] hover:bg-[#163C6D] active:bg-[#102D52] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-blue-200" />
                  <span>Open in Review Desk</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
