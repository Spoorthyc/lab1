import { useMemo, useState } from 'react';
import { useLeads } from '../context/LeadsContext';

export default function LeadManagement() {
  const { leads, users, assignLead } = useLeads();
  const salesUsers = users.filter(u => u.role === 'Sales');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [assignee, setAssignee] = useState('');

  const selectedIds = useMemo(() => Object.keys(selected).filter(k => selected[k]), [selected]);

  const workload = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => {
      if (l.assignedTo) map[l.assignedTo] = (map[l.assignedTo] || 0) + 1;
    });
    return salesUsers.map(u => ({ id: u.id, name: u.name, leads: map[u.id] || 0 }));
  }, [leads, salesUsers]);

  const recommendAssignee = useMemo(() => {
    return workload.sort((a, b) => a.leads - b.leads)[0]?.id || '';
  }, [workload]);

  const bulkAssign = () => {
    const to = assignee || recommendAssignee;
    selectedIds.forEach(id => assignLead({ leadId: id, userId: to }));
    setSelected({});
  };

  return (
    <div className="page lead-mgmt">
      <div className="toolbar">
        <div>{selectedIds.length} selected</div>
        <div className="toolbar-right">
          <select className="select" value={assignee} onChange={e => setAssignee(e.target.value)}>
            <option value="">Assign to...</option>
            {salesUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <button className="btn primary" disabled={!selectedIds.length} onClick={bulkAssign}>Reassign</button>
        </div>
      </div>

      <div className="grid two">
        <div className="panel">
          <div className="panel-title">Reassign Leads</div>
          <div className="table compact">
            <div className="thead">
              <div className="th w6"><input type="checkbox" checked={selectedIds.length === leads.length} onChange={e => setSelected(Object.fromEntries(leads.map(l => [l.id, e.target.checked])))} /></div>
              <div className="th w24">Lead</div>
              <div className="th w14">Status</div>
              <div className="th w18">Source</div>
              <div className="th w18">Assigned</div>
              <div className="th w10">Score</div>
              <div className="th w10">Select</div>
            </div>
            {leads.map(l => (
              <div className="tr" key={l.id}>
                <div className="td w6"><input type="checkbox" checked={!!selected[l.id]} onChange={e => setSelected(s => ({ ...s, [l.id]: e.target.checked }))} /></div>
                <div className="td w24">
                  <div className="lead-name">{l.name}</div>
                  <div className="lead-sub">{l.email}</div>
                </div>
                <div className="td w14"><span className="badge" data-status={l.status}>{l.status}</span></div>
                <div className="td w18">{l.source}</div>
                <div className="td w18">{l.assignedTo || '-'}</div>
                <div className="td w10"><span className="score">{l.hotnessScore}</span></div>
                <div className="td w10"><input type="checkbox" checked={!!selected[l.id]} onChange={e => setSelected(s => ({ ...s, [l.id]: e.target.checked }))} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-title">Workload Balancing</div>
          <div className="workload">
            {workload.map(w => (
              <div className="workload-row" key={w.id}>
                <div className="name">{w.name}</div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${Math.min(100, w.leads * 8)}%` }} />
                </div>
                <div className="num">{w.leads}</div>
              </div>
            ))}
          </div>
          <div className="panel-subtle">Recommendation: <strong>{salesUsers.find(u => u.id === recommendAssignee)?.name || 'N/A'}</strong> has the lightest load.</div>
        </div>
      </div>
    </div>
  );
}