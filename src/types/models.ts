/**
 * Domain models for Platione Sales Assist.
 *
 * These interfaces are the single source of truth for the shape of business
 * entities across factories, API clients and assertions. Keeping them here
 * (rather than inlining `any`) means a backend field rename breaks the build
 * in one place instead of silently passing bad data into tests.
 */

export type ContactStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type LeadType = 'HOT' | 'WARM' | 'COLD';
export type LeadStage = 'NEW' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';
export type ActionStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ActionType = 'CALL' | 'EMAIL' | 'MEETING' | 'DEMO' | 'FOLLOW_UP';
export type InteractionChannel = 'CALL' | 'EMAIL' | 'MEETING' | 'WHATSAPP' | 'IN_PERSON';
export type CatchupType = 'COLD' | 'WARM' | 'HOT' | 'RE_ENGAGE';

export interface Contact {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  jobTitle?: string;
  status: ContactStatus;
  ownerId?: string;
  tags?: string[];
  createdAt?: string;
}

export interface Lead extends Contact {
  leadType: LeadType;
  stage: LeadStage;
  score: number; // 0-100
  estimatedValue?: number;
  source?: string;
}

export interface Customer extends Contact {
  accountId: string;
  contractValue: number;
  isActive: boolean;
  renewalDate?: string;
}

export interface PlannedAction {
  id?: string;
  contactId: string;
  type: ActionType;
  status: ActionStatus;
  title: string;
  notes?: string;
  dueDate: string;
  ownerId?: string;
}

export interface Interaction {
  id?: string;
  contactId: string;
  channel: InteractionChannel;
  summary: string;
  occurredAt: string;
  durationMinutes?: number;
  outcome?: string;
}

export interface FollowUpScenario {
  contact: Contact;
  action: PlannedAction;
  interaction: Interaction;
}
