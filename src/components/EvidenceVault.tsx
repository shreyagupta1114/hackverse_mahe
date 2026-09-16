import React, { useState } from 'react';
import { Contract, EvidenceDocument } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  Search,
  Filter,
  FileText,
  Eye,
  ExternalLink,
  Upload,
  CheckCircle,
  Plus,
  X,
} from 'lucide-react';
import { EvidencePreviewModal } from './EvidencePreviewModal';

interface EvidenceVaultProps {
  contracts: Contract[];
  onUploadDocument: (contractId: string, doc: Partial<EvidenceDocument>) => void;
  onVerifyEvidence: (evidenceId: string) => void;
  onSelectContract: (id: string) => void;
  previewDoc?: EvidenceDocument | null;
  onClosePreview?: () => void;
  onOpenPreview?: (doc: EvidenceDocument) => void;
}

interface FlattenedEvidence extends EvidenceDocument {
  contractId: string;
  contractProject: string;
  relatedVariationLabel: string;
  documentType: string;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({
  contracts,
  onUploadDocument,
  onVerifyEvidence,
  onSelectContract,
  previewDoc,
  onClosePreview,
  onOpenPreview,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [activeDocForPreview, setActiveDocForPreview] = useState<EvidenceDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form state for attaching new document
  const [uploadContractId, setUploadContractId] = useState(contracts[0]?.id || 'P08-1042');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadDocType, setUploadDocType] = useState('Variation Order');
  const [uploadVariationRef, setUploadVariationRef] = useState('VO-004');

  // Flatten documents across contracts with related variation mapping
  const allDocs: FlattenedEvidence[] = contracts.flatMap((contract) =>
    contract.evidenceDocs.map((doc) => {
      // Find related variation
      const matchingVar = contract.variations.find((v) =>
        v.linkedEvidenceIds.includes(doc.id) || v.id === doc.linkedVariationId
      );

      // Infer clean document type
      let docType = 'Verification Document';
      const fn = doc.filename.toLowerCase();
      const title = doc.title.toLowerCase();
      if (fn.includes('variation') || title.includes('order') || fn.includes('order')) {
        docType = 'Variation Order';
      } else if (fn.includes('qualif') || fn.includes('subcontractor') || title.includes('qualif')) {
        docType = 'Qualification Document';
      } else if (fn.includes('test') || fn.includes('lab') || fn.includes('strength')) {
        docType = 'Laboratory Test Certificate';
      } else if (fn.includes('approval') || fn.includes('resolution') || title.includes('sanction')) {
        docType = 'Executive Sanction / Order';
      } else if (fn.includes('rate') || fn.includes('schedule') || fn.includes('analysis')) {
        docType = 'Rate Analysis & Schedule';
      } else if (fn.includes('site') || fn.includes('inspection') || fn.includes('report')) {
        docType = 'Field Inspection Report';
      }

      return {
        ...doc,
        contractId: contract.id,
        contractProject: contract.project,
        relatedVariationLabel: matchingVar ? matchingVar.id.toUpperCase() : 'General Addendum',
        documentType: docType,
      };
    })
  );

  const filteredDocs = allDocs.filter((doc) => {
    const matchSearch =
      doc.filename.toLowerCase().includes(search.toLowerCase()) ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.contractId.toLowerCase().includes(search.toLowerCase()) ||
      doc.contractProject.toLowerCase().includes(search.toLowerCase()) ||
      doc.relatedVariationLabel.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || doc.status === statusFilter;
    const matchType = typeFilter === 'ALL' || doc.documentType === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  const docTypes = [
    'ALL',
    'Variation Order',
    'Qualification Document',
    'Laboratory Test Certificate',
    'Executive Sanction / Order',
    'Rate Analysis & Schedule',
    'Field Inspection Report',
  ];

  const handleOpenDoc = (doc: EvidenceDocument) => {
    if (onOpenPreview) {
      onOpenPreview(doc);
    } else {
      setActiveDocForPreview(doc);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    onUploadDocument(uploadContractId, {
      filename: uploadFileName.endsWith('.pdf') ? uploadFileName : `${uploadFileName}.pdf`,
      title: `${uploadDocType} - Reference ${uploadVariationRef}`,
      fileType: 'PDF Document',
      fileSize: '1.8 MB',
      uploadDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      linkedChangeType: uploadDocType,
      summary: `Document deposited for variation reference ${uploadVariationRef} awaiting compliance sign-off.`,
    });

    setUploadFileName('');
    setShowUploadModal(false);
  };

  const currentPreview = previewDoc || activeDocForPreview;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#263449] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 dark:bg-teal-400"></span>
            <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-[#F1F5F9]">
              Evidence Repository
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8295AD] font-mono">
            Every important variation should have traceable supporting evidence.
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1E4E8C] hover:bg-[#163C6D] active:bg-[#102D52] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] text-white text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-blue-200" />
            <span>Deposit Document</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8295AD]" />
            <input
              type="text"
              placeholder="Search document name, contract, variation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#111827] text-slate-900 dark:text-[#F1F5F9] text-xs font-sans focus:outline-none focus:border-[#1E4E8C] dark:focus:border-[#3B82F6] shadow-2xs"
            />
          </div>

          {/* Document Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-1.5 px-2.5 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#111827] text-slate-800 dark:text-[#CBD5E1] cursor-pointer shadow-2xs focus:outline-none focus:border-[#1E4E8C]"
          >
            {docTypes.map((t) => (
              <option key={t} value={t}>
                {t === 'ALL' ? 'All Document Types' : t}
              </option>
            ))}
          </select>

          {/* Verification Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#111827] text-slate-800 dark:text-[#CBD5E1] cursor-pointer shadow-2xs focus:outline-none focus:border-[#1E4E8C]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Verified">Verified / Available</option>
            <option value="Pending Review">Pending Review</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-[#8295AD]">
          {filteredDocs.length} documents on file
        </div>
      </div>

      {/* Clean Table with exact requested columns:
          Document name | Related Contract | Related Variation | Document Type | Date | Verification Status
      */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#182235] text-slate-600 dark:text-[#CBD5E1] border-b border-slate-200 dark:border-[#263449] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Document Name</th>
                <th className="py-3 px-4 font-semibold">Related Contract</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Related Variation</th>
                <th className="py-3 px-4 font-semibold">Document Type</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Date</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Verification Status</th>
                <th className="py-3 px-4 font-semibold text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#263449]/60">
              {filteredDocs.map((doc) => (
                <tr
                  key={`${doc.contractId}-${doc.id}`}
                  onClick={() => handleOpenDoc(doc)}
                  className="hover:bg-blue-50/40 dark:hover:bg-[#182235] transition-colors duration-100 cursor-pointer"
                >
                  {/* Document name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#1E4E8C] dark:text-[#60A5FA] shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-[#F1F5F9] block hover:underline">
                          {doc.filename}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-[#8295AD] font-mono">
                          {doc.fileSize}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Related Contract */}
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-900 dark:text-[#F1F5F9] block">
                      {doc.contractProject}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-[#8295AD] font-mono">
                      {doc.contractId}
                    </span>
                  </td>

                  {/* Related Variation */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-[#CBD5E1] whitespace-nowrap">
                    {doc.relatedVariationLabel}
                  </td>

                  {/* Document Type */}
                  <td className="py-3 px-4 text-slate-700 dark:text-[#CBD5E1] whitespace-nowrap">
                    {doc.documentType}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-[#8295AD] whitespace-nowrap">
                    {doc.uploadDate}
                  </td>

                  {/* Verification Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge
                      status={doc.status === 'Verified' ? 'Available' : 'Evidence Required'}
                    />
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDoc(doc);
                      }}
                      className="px-2.5 py-1 rounded border border-slate-300 dark:border-[#263449] bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-[#182235] dark:hover:bg-[#202E44] dark:active:bg-[#151D2D] text-slate-800 dark:text-[#E2E8F0] text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      {currentPreview && (
        <EvidencePreviewModal
          evidence={currentPreview}
          onClose={() => {
            if (onClosePreview) onClosePreview();
            setActiveDocForPreview(null);
          }}
          onVerify={(id) => {
            onVerifyEvidence(id);
            if (onClosePreview) onClosePreview();
            setActiveDocForPreview(null);
          }}
        />
      )}

      {/* Modal for Attaching Document */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-2xs transition-opacity">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#263449] pb-3">
              <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-[#F1F5F9]">
                Attach Supporting Document
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:text-[#8295AD] dark:hover:text-[#F1F5F9] p-1 rounded hover:bg-slate-100 dark:hover:bg-[#182235]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-600 dark:text-[#CBD5E1] mb-1">
                  Contract
                </label>
                <select
                  value={uploadContractId}
                  onChange={(e) => setUploadContractId(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#182235] text-slate-900 dark:text-[#F1F5F9] shadow-2xs"
                >
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.project}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-[#CBD5E1] mb-1">
                  Document Type
                </label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#182235] text-slate-900 dark:text-[#F1F5F9] shadow-2xs"
                >
                  <option value="Variation Order">Variation Order Docket</option>
                  <option value="Laboratory Test Certificate">Laboratory Test Certificate</option>
                  <option value="Qualification Document">Subcontractor Qualification Proof</option>
                  <option value="Executive Sanction / Order">Executive Sanction / Order</option>
                  <option value="Rate Analysis & Schedule">Rate Analysis & Schedule</option>
                  <option value="Field Inspection Report">Field Inspection Report</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-[#CBD5E1] mb-1">
                  Related Variation Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. VO-004, VO-002"
                  value={uploadVariationRef}
                  onChange={(e) => setUploadVariationRef(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#182235] text-slate-900 dark:text-[#F1F5F9] shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-[#CBD5E1] mb-1">
                  Document Filename
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sanction_Order_Addendum_4.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#182235] text-slate-900 dark:text-[#F1F5F9] shadow-2xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-[#263449] text-slate-700 dark:text-[#E2E8F0] hover:bg-slate-50 dark:hover:bg-[#182235] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-[#1E4E8C] hover:bg-[#163C6D] active:bg-[#102D52] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white font-medium transition-colors cursor-pointer shadow-2xs"
                >
                  Save & Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
