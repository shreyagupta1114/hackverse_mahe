export type ReviewStatus = 'NORMAL' | 'REVIEW' | 'EVIDENCE REQUIRED' | 'ESCALATED' | 'RESOLVED';

export type VariationSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export type VariationCategory =
  | 'Contractor'
  | 'Subcontractor'
  | 'Contract Value'
  | 'Materials'
  | 'Project Scope'
  | 'Timeline'
  | 'Quantities'
  | 'Milestones'
  | 'Deliverables';

export interface EvidenceDocument {
  id: string;
  title: string;
  filename: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  linkedChangeType: VariationCategory | string;
  linkedVariationId?: string;
  status: 'Verified' | 'Pending Review' | 'Rejected';
  verificationNotes?: string;
  officerAssigned?: string;
  verifiedAt?: string;
  summary?: string;
}

export interface WhyFlaggedRule {
  ruleName: string;
  triggerSummary: string;
  configuredThreshold: string;
  actualDifference: string;
  thresholdExceeded: boolean;
  evidenceCount: number;
  evidenceStatusSummary: string;
}

export interface VariationItem {
  id: string;
  contractId: string;
  category: VariationCategory;
  title: string;
  originalValue: string;
  currentValue: string;
  changePercent?: number; // e.g. 30 for +30%
  severity: VariationSeverity;
  reviewStatus: ReviewStatus;
  dateDetected: string;
  reasonProvided: string;
  linkedEvidenceIds: string[];
  whyFlagged: WhyFlaggedRule;
}

export interface TimelineEvent {
  id: string;
  contractId: string;
  date: string; // e.g. '12 Jan 2026'
  dateShort: string; // e.g. '12 JAN'
  title: string; // e.g. 'Subcontractor Changed'
  category: VariationCategory | 'Contract Award';
  whatChanged: string;
  previousValue: string;
  newValue: string;
  reasonProvided: string;
  supportingEvidenceTitles: string[];
  reviewStatus: ReviewStatus;
  severity?: VariationSeverity;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  dateDisplay: string;
  timeDisplay?: string;
  contractId: string;
  contractProject?: string;
  actor: string;
  role: string;
  actionType?:
    | 'CONTRACT_AWARDED'
    | 'SUB_UPDATED'
    | 'VARIATION_DETECTED'
    | 'EVIDENCE_ATTACHED'
    | 'REVIEW_STARTED'
    | 'NOTE_RECORDED'
    | 'EVIDENCE_REQUESTED'
    | 'ESCALATED'
    | 'RESOLVED'
    | string;
  action?: string;
  description: string;
  details?: string;
  evidenceTitle?: string;
}

export interface MilestoneItem {
  id: string;
  name: string;
  originalTarget: string;
  currentStatus: string;
  progressPercent: number;
  variationNote?: string;
  isDelayed?: boolean;
}

export interface OfficerNote {
  id: string;
  author: string;
  role: string;
  date: string;
  text: string;
}

export interface Contract {
  id: string; // e.g. 'P08-1042'
  project: string; // e.g. 'Urban Road Development'
  department: string; // e.g. 'Public Works Department'
  awardDate: string;
  contractor: {
    original: string;
    current: string;
    status: ReviewStatus;
    isChanged: boolean;
  };
  subcontractor: {
    original: string;
    current: string;
    status: ReviewStatus;
    isChanged: boolean;
    changeNote?: string;
  };
  contractValue: {
    original: number;
    current: number;
    originalFormatted: string;
    currentFormatted: string;
    variationPercent: number;
    status: ReviewStatus;
    isChanged: boolean;
  };
  timeline: {
    originalMonths: number;
    currentMonths: number;
    originalFormatted: string;
    currentFormatted: string;
    variationPercent: number;
    targetCompletionOriginal: string;
    targetCompletionCurrent: string;
    status: ReviewStatus;
    isChanged: boolean;
  };
  materials: {
    original: string;
    current: string;
    status: ReviewStatus;
    isChanged: boolean;
    specNote?: string;
  };
  scope: {
    original: string;
    current: string;
    status: ReviewStatus;
    isChanged: boolean;
    scopeNote?: string;
  };
  quantities: {
    original: string;
    current: string;
    status: ReviewStatus;
    isChanged: boolean;
    qtyNote?: string;
  };
  milestones: MilestoneItem[];
  overallStatus: ReviewStatus;
  reviewPriority: VariationSeverity;
  priorityReasons: string[];
  variations: VariationItem[];
  timelineEvents: TimelineEvent[];
  evidenceDocs: EvidenceDocument[];
  auditTrail: AuditLogEntry[];
  notes: OfficerNote[];
}

export type ActiveTab =
  | 'overview'
  | 'contracts'
  | 'variations'
  | 'evidence'
  | 'reviews';
