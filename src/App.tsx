import React, { useState, useEffect } from 'react';
import { mockContracts } from './data/mockContracts';
import { Contract, ActiveTab, AuditLogEntry, EvidenceDocument } from './types';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { ContractList } from './components/ContractList';
import { VariationsRegistry } from './components/VariationsRegistry';
import { EvidenceVault } from './components/EvidenceVault';
import { ReviewWorkflow } from './components/ReviewWorkflow';
import { ActionType } from './components/OfficerActionModal';
import { EvidencePreviewModal } from './components/EvidencePreviewModal';
import { ShieldCheck, X } from 'lucide-react';

export default function App() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Target IDs when deep-linking into Review Desk
  const [targetReviewContractId, setTargetReviewContractId] = useState<string | undefined>(undefined);
  const [targetReviewVariationId, setTargetReviewVariationId] = useState<string | undefined>(undefined);

  // Evidence preview state
  const [previewDoc, setPreviewDoc] = useState<EvidenceDocument | null>(null);

  // Theme state ('light' | 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('civic_trace_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Sync theme class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('civic_trace_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Metric counts
  const pendingReviewsCount = contracts.reduce(
    (acc, c) =>
      acc +
      c.variations.filter(
        (v) => v.reviewStatus === 'REVIEW' || v.reviewStatus === 'EVIDENCE REQUIRED' || v.reviewStatus === 'ESCALATED'
      ).length,
    0
  );

  const evidencePendingCount = contracts.reduce(
    (acc, c) => acc + c.evidenceDocs.filter((d) => d.status === 'Pending Review').length,
    0
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  };

  // Handler for officer review actions
  const handleTakeOfficerAction = (
    actionType: ActionType,
    contractId: string,
    variationId?: string,
    noteText?: string,
    officerName?: string
  ) => {
    const actor = officerName || 'S. Ramanathan (Vigilance Directorate)';
    const now = new Date();
    const dateDisplay = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    let actionLabel = 'Officer Note Recorded';
    let newStatus = 'REVIEW';

    if (actionType === 'REQUEST_EVIDENCE') {
      actionLabel = 'Evidence Requested';
      newStatus = 'EVIDENCE REQUIRED';
    } else if (actionType === 'MARK_REVIEWED') {
      actionLabel = 'Variation Approved';
      newStatus = 'NORMAL';
    } else if (actionType === 'ESCALATE') {
      actionLabel = 'Escalated to Authority';
      newStatus = 'ESCALATED';
    }

    const newAuditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      contractId,
      timestamp: now.toISOString(),
      dateDisplay,
      actor,
      role: 'Compliance Officer',
      action: actionLabel,
      description: `${actionLabel} on contract ${contractId}`,
      details: noteText || 'Action recorded pursuant to §14 statutory guidelines.',
    };

    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== contractId) return c;

        let updatedOverallStatus = c.overallStatus;
        if (actionType === 'ESCALATE') updatedOverallStatus = 'ESCALATED';
        else if (actionType === 'REQUEST_EVIDENCE') updatedOverallStatus = 'EVIDENCE REQUIRED';
        else if (actionType === 'MARK_REVIEWED') updatedOverallStatus = 'NORMAL';

        const updatedVariations = c.variations.map((v) => {
          if (variationId && v.id === variationId) {
            return {
              ...v,
              reviewStatus: (newStatus as any),
            };
          }
          return v;
        });

        return {
          ...c,
          overallStatus: updatedOverallStatus,
          variations: updatedVariations,
          auditTrail: [newAuditEntry, ...c.auditTrail],
        };
      })
    );

    showToast(`${actionLabel} recorded on contract ${contractId}`);
  };

  // Handler for verifying evidence doc
  const handleVerifyEvidence = (evidenceId: string) => {
    setContracts((prev) =>
      prev.map((c) => {
        const hasDoc = c.evidenceDocs.some((d) => d.id === evidenceId);
        if (!hasDoc) return c;

        const updatedDocs = c.evidenceDocs.map((d) => {
          if (d.id === evidenceId) {
            return {
              ...d,
              status: 'Verified' as const,
              verifiedAt: new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
            };
          }
          return d;
        });

        return {
          ...c,
          evidenceDocs: updatedDocs,
        };
      })
    );

    showToast('Evidence document verified and archived.');
  };

  // Handler for uploading new evidence document
  const handleUploadDocument = (contractId: string, doc: Partial<EvidenceDocument>) => {
    const fullDoc: EvidenceDocument = {
      id: doc.id || `ev-${Date.now()}`,
      filename: doc.filename || 'Supplementary_Docket.pdf',
      title: doc.title || 'Supplementary Document',
      uploadDate: doc.uploadDate || '16 Sep 2026',
      fileSize: doc.fileSize || '1.4 MB',
      fileType: 'PDF Document',
      linkedChangeType: doc.linkedChangeType || 'Contract Value',
      status: 'Pending Review',
      summary: doc.summary,
      officerAssigned: 'S. Ramanathan (Compliance Desk)',
    };

    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== contractId) return c;
        return {
          ...c,
          evidenceDocs: [fullDoc, ...c.evidenceDocs],
        };
      })
    );

    showToast(`Attached ${fullDoc.filename} to contract ${contractId}.`);
  };

  // Deep-link helper to jump directly to Review Desk with pre-filtered item
  const handleGoToReviewDesk = (contractId?: string, variationId?: string) => {
    setTargetReviewContractId(contractId);
    setTargetReviewVariationId(variationId);
    setActiveTab('reviews');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0B1220] text-slate-900 dark:text-[#CBD5E1] flex flex-col font-sans transition-colors selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
      {/* Top Horizontal Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'reviews') {
            setTargetReviewContractId(undefined);
            setTargetReviewVariationId(undefined);
          }
          setActiveTab(tab);
        }}
        pendingReviewsCount={pendingReviewsCount}
        evidencePendingCount={evidencePendingCount}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Workspace Area with Generous Padding & Max Readable Width */}
      <main className="flex-1 w-full pb-16">
        {/* 1. Overview */}
        {activeTab === 'overview' && (
          <DashboardOverview
            contracts={contracts}
            onSelectContract={(id) => {
              setSelectedContractId(id);
              setActiveTab('contracts');
            }}
            onGoToReviews={handleGoToReviewDesk}
            onGoToVariations={() => setActiveTab('variations')}
            onGoToEvidence={() => setActiveTab('evidence')}
          />
        )}

        {/* 2. Contracts (Master Table & Detail View) */}
        {activeTab === 'contracts' && (
          <ContractList
            contracts={contracts}
            selectedContractId={selectedContractId}
            onSelectContract={(id) => setSelectedContractId(id)}
            onGoToReview={(cId, vId) => handleGoToReviewDesk(cId, vId)}
            onPreviewEvidence={(doc) => setPreviewDoc(doc)}
          />
        )}

        {/* 3. Variations */}
        {activeTab === 'variations' && (
          <VariationsRegistry
            contracts={contracts}
            onSelectContract={(id) => {
              setSelectedContractId(id);
              setActiveTab('contracts');
            }}
            onGoToReview={(cId, vId) => handleGoToReviewDesk(cId, vId)}
            onPreviewEvidence={(doc) => setPreviewDoc(doc)}
          />
        )}

        {/* 4. Evidence */}
        {activeTab === 'evidence' && (
          <EvidenceVault
            contracts={contracts}
            onUploadDocument={handleUploadDocument}
            onVerifyEvidence={handleVerifyEvidence}
            onSelectContract={(id) => {
              setSelectedContractId(id);
              setActiveTab('contracts');
            }}
            previewDoc={previewDoc}
            onClosePreview={() => setPreviewDoc(null)}
            onOpenPreview={(doc) => setPreviewDoc(doc)}
          />
        )}

        {/* 5. Review */}
        {activeTab === 'reviews' && (
          <ReviewWorkflow
            contracts={contracts}
            onTakeOfficerAction={handleTakeOfficerAction}
            onSelectContract={(id) => {
              setSelectedContractId(id);
              setActiveTab('contracts');
            }}
            targetContractId={targetReviewContractId}
            targetVariationId={targetReviewVariationId}
          />
        )}
      </main>

      {/* Global Evidence Preview Modal */}
      {previewDoc && activeTab !== 'evidence' && (
        <EvidencePreviewModal
          evidence={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onVerify={(id) => {
            handleVerifyEvidence(id);
            setPreviewDoc(null);
          }}
        />
      )}

      {/* Static Statutory Footer */}
      <footer className="border-t border-slate-200 dark:border-[#263449] bg-white/70 dark:bg-[#111827]/70 py-4 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-500 dark:text-[#8295AD] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-[#F1F5F9]">CIVIC TRACE</span>
            <span>• Statutory Procurement Oversight (§14 Guidelines)</span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-[#64748B]">
            All post-award deviations require traceable evidentiary records before sign-off.
          </div>
        </div>
      </footer>

      {/* Floating Action Confirmation Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#111827] dark:bg-[#182235] text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 dark:border-[#263449] flex items-center gap-3 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
