import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLeads } from '../context/LeadsContext';
import { type LeadRecord, type LeadStatus } from '../types';

function useFilteredLeads(leads: LeadRecord[], query: string, status: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads
      .filter(l => (status === 'All' || l.status === status))
      .filter(l => !q || l.name.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.phone?.includes(q));
  }, [leads, query, status]);
}

const statuses: (LeadStatus | 'All')[] = ['All','New','Contacted','Engaged','Qualified','Proposal','Won','Lost'];

export default function LeadList() {
  const { leads } = useLeads();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(LeadStatus | 'All')>('All');
  const [sortKey, setSortKey] = useState<'hotness' | 'recent'>('hotness');

  const filtered = useFilteredLeads(leads, query, status);
  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sortKey === 'hotness') copy.sort((a, b) => b.hotnessScore - a.hotnessScore);
    else copy.sort((a, b) => (b.lastActivityAt || '').localeCompare(a.lastActivityAt || ''));
    return copy;
  }, [filtered, sortKey]);

  return (
    <div className="page lead-list">
      <div className="toolbar">
        <input className="search large" placeholder="Search leads..." value={query} onChange={e => setQuery(e.target.value)} />
        <div className="toolbar-right">
          <select className="select" value={status} onChange={e => setStatus(e.target.value as any)}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="select" value={sortKey} onChange={e => setSortKey(e.target.value as any)}>
            <option value="hotness">Hotness</option>
            <option value="recent">Most Recent</option>
          </select>
          <button className="btn primary">+ New Lead</button>
        </div>
      </div>

      <div className="table">
        <div className="thead">
          <div className="th w24">Lead Name</div>
          <div className="th w12">Status</div>
          <div className="th w12">Source</div>
          <div className="th w18">Last Activity</div>
          <div className="th w18">Assigned To</div>
          <div className="th w8">Score</div>
          <div className="th w8">Action</div>
        </div>
        {sorted.map(l => (
          <Link key={l.id} to={`/leads/${l.id}`} className="tr">
            <div className="td w24">
              <div className="lead-name">{l.name}</div>
              <div className="lead-sub">{l.email} • {l.phone}</div>
            </div>
            <div className="td w12"><span className="badge" data-status={l.status}>{l.status}</span></div>
            <div className="td w12">{l.source}</div>
            <div className="td w18">{new Date(l.lastActivityAt || l.createdAt).toLocaleString()}</div>
            <div className="td w18">{l.assignedTo ? 'Sales ' + l.assignedTo.toUpperCase() : 'Unassigned'}</div>
            <div className="td w8"><span className="score">{l.hotnessScore}</span></div>
            <div className="td w8"><span className="link">Open</span></div>
          </Link>
        ))}
      </div>
    </div>
  );
}