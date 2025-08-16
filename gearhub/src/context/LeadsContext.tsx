import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import {
  type AddActivityPayload,
  type AddNotePayload,
  type AssignPayload,
  type GearHubState,
  type LeadActivity,

  type LeadRecord,
  type LeadSource,
  type LeadStatus,
  type UpdateStatusPayload,
  type User,
} from '../types';

interface LeadsContextValue extends GearHubState {
  assignLead: (payload: AssignPayload) => void;
  updateStatus: (payload: UpdateStatusPayload) => void;
  addActivity: (payload: AddActivityPayload) => void;
  addNote: (payload: AddNotePayload) => void;
  setSelectedLeadId: (id: string | undefined) => void;
}

const LeadsContext = createContext<LeadsContextValue | undefined>(undefined);

function generateMockUsers(): User[] {
  return [
    { id: 'u1', name: 'Alex Johnson', role: 'Sales', avatarColor: '#6b5bff' },
    { id: 'u2', name: 'Sarah Wilson', role: 'Sales', avatarColor: '#00b894' },
    { id: 'u3', name: 'Mike Chen', role: 'Sales', avatarColor: '#e17055' },
    { id: 'u4', name: 'Emma Davis', role: 'Sales', avatarColor: '#0984e3' },
    { id: 'm1', name: 'Priya Singh', role: 'Manager', avatarColor: '#a29bfe' },
  ];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMockLeads(users: User[]): LeadRecord[] {
  const names = ['David Kumar', 'Lisa Chen', 'Robert Smith', 'Ava Patel', 'Noah Garcia', 'Sophia Lee', 'Ethan Brown', 'Olivia Martin', 'Mason Clark', 'Isabella Lopez'];
  const sources: LeadSource[] = ['Website', 'Facebook', 'Google', 'Twitter', 'Referral', 'Walk-in', 'Event'];
  const statuses: LeadStatus[] = ['New', 'Contacted', 'Engaged', 'Qualified', 'Proposal', 'Won', 'Lost'];

  const now = Date.now();
  return names.map((name, i) => {
    const createdAt = new Date(now - i * 1000 * 60 * 60 * 8).toISOString();
    const status = pick(statuses);
    const hotness = Math.min(100, Math.max(15, Math.floor(Math.random() * 100)));
    const assignedTo = i % 2 === 0 ? pick(users.filter(u => u.role === 'Sales')).id : undefined;
    const lastActivityAt = new Date(now - Math.random() * 1000 * 60 * 60 * 24 * 5).toISOString();
    return {
      id: uuid(),
      name,
      email: name.toLowerCase().replace(/\s/g, '.') + '@example.com',
      phone: '9876' + (300000 + Math.floor(Math.random() * 600000)).toString(),
      status,
      source: pick(sources),
      assignedTo,
      lastActivityAt,
      createdAt,
      hotnessScore: hotness,
      vehicleInterest: {
        make: pick(['Honda', 'Toyota', 'BMW', 'Ford', 'Hyundai']),
        model: pick(['Civic', 'Camry', 'X3', 'F-150', 'Elantra']),
        newOrUsed: pick(['New', 'Used', 'Either']),
        budgetMin: 15000,
        budgetMax: 35000,
      },
      preferredContact: pick(['Phone', 'Email', 'WhatsApp']),
      notes: [],
    };
  });
}

function generateInitialActivities(leads: LeadRecord[], users: User[]): LeadActivity[] {
  const types: LeadActivity['type'][] = ['Call', 'Email', 'Meeting', 'Test Drive', 'Note'];
  return leads.slice(0, 12).map((lead, i) => ({
    id: uuid(),
    leadId: lead.id,
    type: pick(types),
    summary: 'Automated enrichment and scoring completed',
    createdAt: new Date(Date.now() - (i + 1) * 3600 * 1000).toISOString(),
    createdBy: pick(users).id,
  }));
}

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(generateMockUsers());
  const [leads, setLeads] = useState<LeadRecord[]>(() => generateMockLeads(users));
  const [activities, setActivities] = useState<LeadActivity[]>(() => generateInitialActivities(leads, users));
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>(undefined);

  const assignLead = ({ leadId, userId }: AssignPayload) => {
    setLeads(prev => prev.map(l => (l.id === leadId ? { ...l, assignedTo: userId } : l)));
    setActivities(prev => [
      {
        id: uuid(),
        leadId,
        type: 'Assignment',
        summary: `Assigned to ${users.find(u => u.id === userId)?.name ?? 'User'}`,
        createdAt: new Date().toISOString(),
        createdBy: userId,
      },
      ...prev,
    ]);
  };

  const updateStatus = ({ leadId, status }: UpdateStatusPayload) => {
    setLeads(prev => prev.map(l => (l.id === leadId ? { ...l, status } : l)));
    setActivities(prev => [
      {
        id: uuid(),
        leadId,
        type: 'Status Change',
        summary: `Status updated to ${status}`,
        createdAt: new Date().toISOString(),
        createdBy: users.find(u => u.role === 'Manager')?.id ?? 'm1',
      },
      ...prev,
    ]);
  };

  const addActivity = ({ activity }: AddActivityPayload) => {
    setActivities(prev => [activity, ...prev]);
  };

  const addNote = ({ note }: AddNotePayload) => {
    setLeads(prev => prev.map(l => (l.id === note.leadId ? { ...l, notes: [note, ...(l.notes ?? [])] } : l)));
    setActivities(prev => [
      {
        id: uuid(),
        leadId: note.leadId,
        type: 'Note',
        summary: 'Note added',
        createdAt: note.createdAt,
        createdBy: note.createdBy,
      },
      ...prev,
    ]);
  };

  const value = useMemo<LeadsContextValue>(() => ({
    users,
    leads,
    activities,
    selectedLeadId,
    assignLead,
    updateStatus,
    addActivity,
    addNote,
    setSelectedLeadId,
  }), [users, leads, activities, selectedLeadId]);

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider');
  return ctx;
}