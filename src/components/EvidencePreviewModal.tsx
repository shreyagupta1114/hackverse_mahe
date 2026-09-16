import React from 'react';
import { EvidenceDocument } from '../types';
import { X, FileText, CheckCircle, Clock, ShieldCheck, Download, Printer } from 'lucide-react';

interface EvidencePreviewModalProps {
  evidence?: EvidenceDocument | null;
  document?: EvidenceDocument | null;
  onClose: () => void;
  onVerify?: (evidenceId: string) => void;
}

export const EvidencePreviewModal: React.FC<EvidencePreviewModalProps> = ({
  evidence,
  document,
  onClose,
  onVerify,
}) => {
  const doc = evidence || document;
  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-2xs">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Modal Top Bar */}
        <div className="bg-[#111827] dark:bg-[#0B1220] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 dark:border-[#263449]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold truncate max-w-md">
              {doc.filename}
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                doc.status === 'Verified'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {doc.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 dark:hover:bg-[#182235] cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metadata sub-strip */}
        <div className="bg-slate-50/80 dark:bg-[#182235] border-b border-slate-200 dark:border-[#263449] px-5 py-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-600 dark:text-[#8295AD]">
          <div>
            <span className="text-slate-400 dark:text-[#64748B] block text-[9px] uppercase">
              Upload Date
            </span>
            <strong className="text-slate-800 dark:text-[#E2E8F0]">{doc.uploadDate}</strong>
          </div>
          <div>
            <span className="text-slate-400 dark:text-[#64748B] block text-[9px] uppercase">
              Format / Size
            </span>
            <strong className="text-slate-800 dark:text-[#E2E8F0]">
              {doc.fileSize} • {doc.fileType}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 dark:text-[#64748B] block text-[9px] uppercase">
              Category
            </span>
            <strong className="text-slate-800 dark:text-[#E2E8F0]">{doc.linkedChangeType}</strong>
          </div>
          <div>
            <span className="text-slate-400 dark:text-[#64748B] block text-[9px] uppercase">
              Assigned Cell
            </span>
            <strong className="text-slate-800 dark:text-[#E2E8F0]">
              {doc.officerAssigned || 'Compliance Cell'}
            </strong>
          </div>
        </div>

        {/* Authentic Document Viewer Paper */}
        <div className="p-5 overflow-y-auto bg-slate-100 dark:bg-[#0B1220] flex justify-center">
          <div className="bg-[#FFFDF9] text-slate-900 border border-slate-300 dark:border-slate-700 shadow-md p-6 sm:p-8 max-w-xl w-full font-serif min-h-[360px] relative rounded-xs">
            {/* Stamp if verified */}
            {doc.status === 'Verified' && (
              <div className="absolute top-8 right-8 border-2 border-teal-700 text-teal-800 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest rotate-[-8deg] opacity-80 pointer-events-none">
                ✓ AUTHENTICATED & SEALED
              </div>
            )}

            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
              <div className="text-[10px] font-sans uppercase tracking-widest text-slate-500">
                Statutory Public Procurement Docket
              </div>
              <h4 className="text-base font-bold font-serif text-slate-900 mt-1">
                {doc.title || doc.filename}
              </h4>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                Ref No: DOC-{doc.id.toUpperCase()} • Issued pursuant to §14
              </p>
            </div>

            {/* Content body */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-800 font-sans">
              <p>
                <strong>Subject Matter:</strong> Formal verification certificate and evidentiary schedule submitted in relation to contract variation orders and field modifications.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded text-[11px] font-mono text-slate-700">
                <p>
                  <strong>Summary of Docket:</strong>{' '}
                  {doc.summary ||
                    'Official submission containing contractor justification, revised specifications, rate certifications, and regulatory sanctions.'}
                </p>
              </div>
              <p className="text-slate-600 text-[11px]">
                This document serves as immutable public record under the Public Procurement Compliance Directorate. All signatures and dates have been verified by the assigned compliance officer.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-3.5 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-[#263449] flex items-center justify-between text-xs font-mono">
          <div className="text-slate-500 dark:text-[#8295AD] text-[11px]">
            {doc.status === 'Verified' ? 'Document verified and archived.' : 'Pending officer verification.'}
          </div>

          <div className="flex items-center gap-2">
            {onVerify && doc.status !== 'Verified' && (
              <button
                onClick={() => onVerify(doc.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-700 hover:bg-teal-800 active:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium cursor-pointer transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Document</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-[#263449] text-slate-700 dark:text-[#E2E8F0] hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-[#182235] dark:active:bg-[#151D2D] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
