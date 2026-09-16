import React, { useState } from 'react';
import { Contract, VariationItem, EvidenceDocument } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  Building2,
  FileText,
  AlertCircle,
  FileCheck2,
  ExternalLink,
  ClipboardCheck,
} from 'lucide-react';

interface ContractListProps {
  contracts: Contract[];
  selectedContractId: string | null;
  onSelectContract: (id: string | null) => void;
  onGoToReview: (contractId: string, variationId?: string) => void;
  onPreviewEvidence: (doc: EvidenceDocument) => void;
}

export const ContractList: React.FC<ContractListProps> = ({
  contracts,
  selectedContractId,
  onSelectContract,
  onGoToReview,
  onPreviewEvidence,
}) => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const selectedContract = contracts.find((c) => c.id === selectedContractId);

  const filteredContracts = contracts.filter((c) => {
    const matchSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.project.toLowerCase().includes(search.toLowerCase()) ||
      c.contractor.current.toLowerCase().includes(search.toLowerCase());

    const matchDept = deptFilter === 'ALL' || c.department === deptFilter;
    const matchStatus = statusFilter === 'ALL' || c.overallStatus === statusFilter;

    return matchSearch && matchDept && matchStatus;
  });

  const departments = [
    'ALL',
    'Public Works Department',
    'Transport & Highways Authority',
    'Water Resources & Irrigation',
    'Urban Development Authority',
    'Health Infrastructure Directorate',
    'Education Infrastructure Board',
  ];

  // If a contract is selected, show its detail view
  if (selectedContract) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-sans">
        {/* Back navigation */}
        <div>
          <button
            onClick={() => onSelectContract(null)}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 hover:text-[#1E4E8C] dark:text-[#8295AD] dark:hover:text-[#60A5FA] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Contracts Table</span>
          </button>
        </div>

        {/* Contract Header */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-[#1E4E8C] dark:bg-[#182235] dark:text-[#93C5FD] border border-blue-200/80 dark:border-[#1E3A8A]">
                  {selectedContract.id}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-[#8295AD]">
                  {selectedContract.department}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-[#F1F5F9] mt-2">
                {selectedContract.project}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={selectedContract.overallStatus} size="md" />
            </div>
          </div>
        </div>

        {/* Section 1: Contract Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E4E8C] dark:bg-[#3B82F6]"></span>
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-[#CBD5E1]">
              Contract Information
            </h2>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg p-5 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs font-sans">
              <div>
                <span className="text-slate-500 dark:text-[#8295AD] block font-mono text-[11px]">
                  Contract ID
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-[#F1F5F9] text-sm mt-0.5 block">
                  {selectedContract.id}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-[#8295AD] block font-mono text-[11px]">
                  Contractor
                </span>
                <span className="font-medium text-slate-900 dark:text-[#F1F5F9] text-sm mt-0.5 block">
                  {selectedContract.contractor.current}
                </span>
                {selectedContract.contractor.isChanged && (
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                    Changed from {selectedContract.contractor.original}
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-500 dark:text-[#8295AD] block font-mono text-[11px]">
                  Original Value
                </span>
                <span className="font-mono font-medium text-slate-700 dark:text-[#CBD5E1] text-sm mt-0.5 block">
                  {selectedContract.contractValue.originalFormatted}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-[#8295AD] block font-mono text-[11px]">
                  Current Value
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono font-bold text-slate-900 dark:text-[#F1F5F9] text-sm">
                    {selectedContract.contractValue.currentFormatted}
                  </span>
                  {selectedContract.contractValue.variationPercent !== 0 && (
                    <span
                      className={`text-[11px] font-mono font-semibold ${
                        selectedContract.contractValue.variationPercent > 0
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-teal-700 dark:text-teal-400'
                      }`}
                    >
                      {selectedContract.contractValue.variationPercent > 0 ? '+' : ''}
                      {selectedContract.contractValue.variationPercent}%
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-500 dark:text-[#8295AD] block font-mono text-[11px]">
                  Award / Start Date
                </span>
                <span className="font-mono text-slate-800 dark:text-[#CBD5E1] mt-0.5 block">
                  {selectedContract.awardDate}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-[#8295AD] block font-mono text-[11px]">
                  Original Completion Date
                </span>
                <span className="font-mono text-slate-700 dark:text-[#CBD5E1] mt-0.5 block">
                  {selectedContract.timeline.targetCompletionOriginal}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-500 dark:text-[#8295AD] block font-mono text-[11px]">
                  Current Completion Date
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono font-bold text-slate-900 dark:text-[#F1F5F9]">
                    {selectedContract.timeline.targetCompletionCurrent}
                  </span>
                  {selectedContract.timeline.isChanged && (
                    <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
                      (+{selectedContract.timeline.currentMonths - selectedContract.timeline.originalMonths} months extension)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Current Variations */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-[#CBD5E1]">
                Current Variations ({selectedContract.variations.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8295AD] font-mono">
                Post-award deviations recorded for this contract.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {selectedContract.variations.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-slate-500 dark:text-[#8295AD] bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg">
                No variations recorded for this contract.
              </div>
            ) : (
              selectedContract.variations.map((v) => {
                const linkedDocs = selectedContract.evidenceDocs.filter((d) =>
                  v.linkedEvidenceIds.includes(d.id)
                );

                return (
                  <div
                    key={v.id}
                    className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg p-5 space-y-4 shadow-2xs hover:border-blue-300 dark:hover:border-[#3B4D68] transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-[#263449] pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1E4E8C] dark:bg-[#182235] dark:text-[#93C5FD] border border-blue-200/70 dark:border-[#1E3A8A]">
                          {v.id.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-[#F1F5F9]">
                          {v.title}
                        </span>
                        <span className="text-slate-300 dark:text-[#263449]">•</span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-[#8295AD]">
                          {v.dateDetected}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={v.reviewStatus} />
                        <button
                          onClick={() => onGoToReview(selectedContract.id, v.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#1E4E8C] hover:bg-[#163C6D] active:bg-[#102D52] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] text-white text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5 text-blue-200" />
                          <span>Review</span>
                        </button>
                      </div>
                    </div>

                    {/* What changed & Reason */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50/80 dark:bg-[#182235] p-3 rounded-md border border-slate-200/70 dark:border-[#263449]">
                        <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-[#8295AD] block mb-1">
                          Value Shift / Scope Change:
                        </span>
                        <div className="font-mono text-slate-800 dark:text-[#CBD5E1] space-y-0.5">
                          <div>
                            <span className="text-slate-500 dark:text-[#8295AD]">Original: </span>
                            <span>{v.originalValue}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-[#8295AD]">Updated: </span>
                            <span className="font-semibold text-slate-900 dark:text-[#F1F5F9]">
                              {v.currentValue}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50/80 dark:bg-[#182235] p-3 rounded-md border border-slate-200/70 dark:border-[#263449]">
                        <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-[#8295AD] block mb-1">
                          Stated Rationale:
                        </span>
                        <p className="text-slate-700 dark:text-[#CBD5E1] leading-relaxed text-xs">
                          {v.reasonProvided}
                        </p>
                      </div>
                    </div>

                    {/* Linked Evidence */}
                    {linkedDocs.length > 0 && (
                      <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-[11px] font-mono text-slate-500 dark:text-[#8295AD]">
                          Linked Evidence ({linkedDocs.length}):
                        </span>
                        {linkedDocs.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => onPreviewEvidence(doc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-[#182235] dark:hover:bg-[#202E44] dark:active:bg-[#151D2D] text-slate-700 dark:text-[#E2E8F0] font-mono text-[11px] border border-slate-300 dark:border-[#263449] cursor-pointer transition-colors shadow-2xs"
                          >
                            <FileText className="w-3 h-3 text-[#1E4E8C] dark:text-[#60A5FA]" />
                            <span>{doc.filename}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // Master Table View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 dark:border-[#263449] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1E4E8C] dark:bg-[#3B82F6]"></span>
          <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-[#F1F5F9]">
            Contracts Register
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8295AD] font-mono">
          Public procurement agreements actively tracked for post-award variations.
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
              placeholder="Search ID, project, contractor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#111827] text-slate-900 dark:text-[#F1F5F9] text-xs font-sans focus:outline-none focus:border-[#1E4E8C] dark:focus:border-[#3B82F6] shadow-2xs"
            />
          </div>

          {/* Department */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="py-1.5 px-2.5 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#111827] text-slate-800 dark:text-[#CBD5E1] cursor-pointer shadow-2xs focus:outline-none focus:border-[#1E4E8C]"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? 'All Departments' : d}
              </option>
            ))}
          </select>

          {/* Status */}
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
          Showing {filteredContracts.length} of {contracts.length} contracts
        </div>
      </div>

      {/* Clean Table with exact requested columns:
          Contract ID | Project | Contractor | Contract Value | Start Date | End Date | Current Status | Variations
      */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#182235] text-slate-600 dark:text-[#CBD5E1] border-b border-slate-200 dark:border-[#263449] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Contract ID</th>
                <th className="py-3 px-4 font-semibold">Project</th>
                <th className="py-3 px-4 font-semibold">Contractor</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Contract Value</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Start Date</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">End Date</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Current Status</th>
                <th className="py-3 px-4 font-semibold text-right whitespace-nowrap">Variations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#263449]/60">
              {filteredContracts.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onSelectContract(c.id)}
                  className="hover:bg-blue-50/40 dark:hover:bg-[#182235] transition-colors duration-100 cursor-pointer"
                >
                  {/* Contract ID */}
                  <td className="py-3 px-4 font-mono font-bold text-[#1E4E8C] dark:text-[#60A5FA] whitespace-nowrap">
                    {c.id}
                  </td>

                  {/* Project */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 dark:text-[#F1F5F9] hover:underline block">
                      {c.project}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-[#8295AD] font-mono">
                      {c.department}
                    </span>
                  </td>

                  {/* Contractor */}
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-[#CBD5E1]">
                    {c.contractor.current}
                  </td>

                  {/* Contract Value */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 dark:text-[#F1F5F9] block">
                      {c.contractValue.currentFormatted}
                    </span>
                    {c.contractValue.variationPercent !== 0 ? (
                      <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
                        {c.contractValue.originalFormatted} ({c.contractValue.variationPercent > 0 ? '+' : ''}
                        {c.contractValue.variationPercent}%)
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400 dark:text-[#64748B]">
                        No deviation
                      </span>
                    )}
                  </td>

                  {/* Start Date */}
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-[#8295AD] whitespace-nowrap">
                    {c.awardDate}
                  </td>

                  {/* End Date */}
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-[#8295AD] whitespace-nowrap">
                    {c.timeline.targetCompletionCurrent}
                  </td>

                  {/* Current Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={c.overallStatus} />
                  </td>

                  {/* Variations */}
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        c.variations.length > 0
                          ? 'bg-blue-50 text-[#1E4E8C] dark:bg-[#182235] dark:text-[#93C5FD] border border-blue-200/80 dark:border-[#1E3A8A]'
                          : 'text-slate-400 dark:text-[#64748B]'
                      }`}
                    >
                      {c.variations.length} {c.variations.length === 1 ? 'change' : 'changes'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
