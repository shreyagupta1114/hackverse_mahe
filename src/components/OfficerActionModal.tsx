import React, { useState } from 'react';
import { Contract, VariationItem } from '../types';
import { X, Send, ShieldAlert, CheckCircle, FileQuestion, MessageSquarePlus } from 'lucide-react';

export type ActionType = 'REQUEST_EVIDENCE' | 'MARK_REVIEWED' | 'ESCALATE' | 'RECORD_NOTE';

interface OfficerActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  variation?: VariationItem;
  actionType: ActionType;
  onConfirmAction: (
    actionType: ActionType,
    contractId: string,
    variationId?: string,
    noteText?: string,
    officerName?: string
  ) => void;
}

export const OfficerActionModal: React.FC<OfficerActionModalProps> = ({
  isOpen,
  onClose,
  contract,
  variation,
  actionType,
  onConfirmAction,
}) => {
  const [noteText, setNoteText] = useState('');
  const [officerName, setOfficerName] = useState('S. Ramanathan (Vigilance Directorate)');

  if (!isOpen) return null;

  const getActionConfig = () => {
    switch (actionType) {
      case 'REQUEST_EVIDENCE':
        return {
          title: 'Request Additional Evidence',
          icon: FileQuestion,
          btnClass:
            'bg-[#1E4E8C] hover:bg-[#163C6D] active:bg-[#102D52] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] text-white',
          btnLabel: 'Issue Formal Request',
          placeholder:
            'Specify what documents or certifications are required from the contractor (e.g. Subcontractor qualification dossier, revised rate analysis, lab test logs)...',
          defaultNote:
            'Formal request issued for supplementary evidentiary documentation under Section §14.',
        };
      case 'MARK_REVIEWED':
        return {
          title: 'Mark as Reviewed',
          icon: CheckCircle,
          btnClass:
            'bg-teal-700 hover:bg-teal-800 active:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-700 dark:active:bg-teal-800 text-white',
          btnLabel: 'Confirm Review',
          placeholder: 'Record formal compliance rationale for accepting this variation...',
          defaultNote:
            'Variation audited and determined compliant with public procurement guidelines §14.',
        };
      case 'ESCALATE':
        return {
          title: 'Escalate Variation',
          icon: ShieldAlert,
          btnClass:
            'bg-rose-700 hover:bg-rose-800 active:bg-rose-900 dark:bg-rose-600 dark:hover:bg-rose-700 dark:active:bg-rose-800 text-white',
          btnLabel: 'Escalate to Authority',
          placeholder:
            'Provide justification for referral to technical audit / vigilance cell...',
          defaultNote:
            'Escalated due to unverified subcontractor substitution and significant cost growth.',
        };
      case 'RECORD_NOTE':
        return {
          title: 'Add Officer Note',
          icon: MessageSquarePlus,
          btnClass:
            'bg-[#1E4E8C] hover:bg-[#163C6D] active:bg-[#102D52] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] text-white',
          btnLabel: 'Save Note',
          placeholder: 'Type your observation, investigation finding, or field note...',
          defaultNote: '',
        };
    }
  };

  const config = getActionConfig();
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNote = noteText.trim() || config.defaultNote;
    onConfirmAction(actionType, contract.id, variation?.id, finalNote, officerName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-2xs">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#263449] rounded-lg max-w-lg w-full flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="bg-[#111827] dark:bg-[#0B1220] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 dark:border-[#263449]">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-amber-400" />
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white">
              {config.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 dark:hover:bg-[#182235] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Context block */}
          <div className="bg-slate-50/80 dark:bg-[#182235] border border-slate-200/80 dark:border-[#263449] rounded-md p-3 font-mono">
            <div className="flex justify-between text-slate-500 dark:text-[#8295AD] mb-1 text-[11px]">
              <span>
                Contract ID: <strong className="text-slate-900 dark:text-[#F1F5F9]">{contract.id}</strong>
              </span>
              <span>{contract.department}</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-[#F1F5F9] text-xs">
              {contract.project}
            </div>
            {variation && (
              <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-[#263449] text-slate-800 dark:text-[#CBD5E1] text-[11px]">
                Target Change: <strong>{variation.title}</strong> ({variation.id.toUpperCase()})
              </div>
            )}
          </div>

          {/* Officer identity */}
          <div>
            <label className="font-mono font-semibold text-slate-700 dark:text-[#CBD5E1] block mb-1 uppercase text-[10px]">
              Responsible Officer:
            </label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#182235] text-slate-900 dark:text-[#F1F5F9] text-xs font-mono focus:outline-none focus:border-[#1E4E8C] dark:focus:border-[#3B82F6] shadow-2xs"
              required
            />
          </div>

          {/* Note Input */}
          <div>
            <label className="font-mono font-semibold text-slate-700 dark:text-[#CBD5E1] block mb-1 uppercase text-[10px]">
              Officer Observation / Directive:
            </label>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={config.placeholder}
              defaultValue={config.defaultNote}
              className="w-full p-2.5 border border-slate-300 dark:border-[#263449] rounded-md bg-white dark:bg-[#182235] text-slate-900 dark:text-[#F1F5F9] text-xs font-sans focus:outline-none focus:border-[#1E4E8C] dark:focus:border-[#3B82F6] leading-relaxed shadow-2xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-200 dark:border-[#263449] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-mono rounded-md border border-slate-300 dark:border-[#263449] text-slate-700 dark:text-[#E2E8F0] hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-[#182235] dark:active:bg-[#151D2D] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-md cursor-pointer transition-colors shadow-2xs ${config.btnClass}`}
            >
              {config.btnLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
