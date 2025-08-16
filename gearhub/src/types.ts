export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Unqualified'
  | 'Engaged'
  | 'Proposal'
  | 'Won'
  | 'Lost';

export type LeadSource =
  | 'Website'
  | 'Facebook'
  | 'Google'
  | 'Twitter'
  | 'Walk-in'
  | 'Referral'
  | 'Event'
  | 'Other';

export type ContactMethod = 'Phone' | 'Email' | 'WhatsApp' | 'SMS';

export interface User {
  id: string;
  name: string;
  role: 'Sales' | 'Manager';
  avatarColor?: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Test Drive' | 'Note' | 'Status Change' | 'Assignment';
  summary: string;
  createdAt: string; // ISO string
  createdBy: string; // user id
  meta?: Record<string, unknown>;
}

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdAt: string; // ISO
  createdBy: string; // user id
  tags?: string[];
}

export interface VehicleInterest {
  make: string;
  model: string;
  trim?: string;
  budgetMin?: number;
  budgetMax?: number;
  newOrUsed?: 'New' | 'Used' | 'Either';
}

export interface LeadRecord {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: string; // user id
  lastActivityAt?: string; // ISO
  createdAt: string; // ISO
  hotnessScore: number; // 0 - 100
  region?: string;
  vehicleInterest?: VehicleInterest;
  preferredContact?: ContactMethod;
  notes?: LeadNote[];
}

export interface GearHubState {
  users: User[];
  leads: LeadRecord[];
  activities: LeadActivity[];
  selectedLeadId?: string;
}

export interface AssignPayload {
  leadId: string;
  userId: string;
}

export interface UpdateStatusPayload {
  leadId: string;
  status: LeadStatus;
}

export interface AddActivityPayload {
  activity: LeadActivity;
}

export interface AddNotePayload {
  note: LeadNote;
}