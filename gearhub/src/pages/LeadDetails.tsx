import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLeads } from '../context/LeadsContext';
import { type LeadNote, type LeadStatus } from '../types';
import { v4 as uuid } from 'uuid';

const statusOrder: LeadStatus[] = ['New','Contacted','Engaged','Qualified','Proposal','Won','Lost'];

export default function LeadDetails() {
  const { id } = useParams();
  const { leads, users, activities, updateStatus, assignLead, addNote } = useLeads();
  const lead = leads.find(l => l.id === id);
  const [note, setNote] = useState('');

  const leadActivities = useMemo(() => activities.filter(a => a.leadId === lead?.id), [activities, lead?.id]);

  if (!lead) return <div className="page"><div className="panel">Lead not found. <Link to="/leads">Back to list</Link></div></div>;

  const currentStatusIdx = statusOrder.indexOf(lead.status as any);
  const nextStatus = statusOrder[currentStatusIdx + 1];

  const onQuickAdvance = () => {
    if (nextStatus) updateStatus({ leadId: lead.id, status: nextStatus });
  };

  const onAddNote = () => {
    if (!note.trim()) return;
    const newNote: LeadNote = {
      id: uuid(),
      leadId: lead.id,
      content: note.trim(),
      createdAt: new Date().toISOString(),
      createdBy: users[0].id,
    };
    addNote({ note: newNote });
    setNote('');
  };

  return (
    <div className="page lead-details">
      <div className="lead-header">
        <div className="lead-title">
          <div className="title">{lead.name}</div>
          <div className="sub">{lead.email} • {lead.phone}</div>
        </div>
        <div className="lead-actions">
          <span className="badge" data-status={lead.status}>{lead.status}</span>
          <button className="btn" onClick={onQuickAdvance} disabled={!nextStatus}>Advance</button>
          <select className="select" value={lead.assignedTo || ''} onChange={e => assignLead({ leadId: lead.id, userId: e.target.value })}>
            <option value="">Unassigned</option>
            {users.filter(u => u.role === 'Sales').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid two">
        <div className="panel">
          <div className="panel-title">Lead Information</div>
          <div className="info-grid">
            <div>
              <div className="label">Preferred Contact</div>
              <div>{lead.preferredContact}</div>
            </div>
            <div>
              <div className="label">Source</div>
              <div>{lead.source}</div>
            </div>
            <div>
              <div className="label">Assigned To</div>
              <div>{users.find(u => u.id === lead.assignedTo)?.name || 'Unassigned'}</div>
            </div>
            <div>
              <div className="label">Hotness Score</div>
              <div className="score large">{lead.hotnessScore}</div>
            </div>
          </div>
          <div className="car-card">
            <div className="car-img" />
            <div>
              <div className="label">Vehicle Interest</div>
              <div>{lead.vehicleInterest?.make} {lead.vehicleInterest?.model} • {lead.vehicleInterest?.newOrUsed}</div>
              <div className="subtle">Budget: ${lead.vehicleInterest?.budgetMin?.toLocaleString()} - ${lead.vehicleInterest?.budgetMax?.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-title">Activity Timeline</div>
          <div className="timeline">
            {leadActivities.map(a => (
              <div key={a.id} className="timeline-item">
                <div className="dot" />
                <div>
                  <div className="timeline-title">{a.type}</div>
                  <div className="timeline-sub">{a.summary}</div>
                  <div className="timeline-meta">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Interactive Notes</div>
        <textarea className="textarea" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a quick qualification, key highlights, concerns, or next steps..." />
        <div className="note-actions">
          <button className="btn ghost">Bold</button>
          <button className="btn ghost">Italic</button>
          <div className="spacer" />
          <button className="btn primary" onClick={onAddNote}>Save Notes</button>
        </div>
        <div className="notes-list">
          {(lead.notes || []).map(n => (
            <div key={n.id} className="note-item">
              <div className="note-meta">{new Date(n.createdAt).toLocaleString()}</div>
              <div>{n.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}