import { useMemo } from 'react';
import { useLeads } from '../context/LeadsContext';
import { type LeadRecord } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

function kpi(leads: LeadRecord[]) {
  const total = leads.length;
  const qualified = leads.filter(l => ['Qualified', 'Proposal', 'Won'].includes(l.status)).length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const avgResponseHrs = 1.2;
  return { total, qualified, newLeads, avgResponseHrs };
}

export default function Dashboard() {
  const { leads } = useLeads();
  const { total, qualified, newLeads, avgResponseHrs } = useMemo(() => kpi(leads), [leads]);

  const sourceData = useMemo(() => {
    const bySource: Record<string, number> = {};
    leads.forEach(l => {
      bySource[l.source] = (bySource[l.source] || 0) + 1;
    });
    return Object.entries(bySource).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const activityData = useMemo(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months.map((m) => ({ month: m, leads: Math.floor(10 + Math.random()*25) }));
  }, []);

  const COLORS = ['#6b5bff', '#00b894', '#e17055', '#0984e3', '#a29bfe', '#fdcb6e'];

  return (
    <div className="page dashboard">
      <div className="kpi-row">
        <div className="kpi-card purple"><div className="kpi-label">New Leads</div><div className="kpi-value">{newLeads}</div></div>
        <div className="kpi-card green"><div className="kpi-label">Qualified</div><div className="kpi-value">{qualified}</div></div>
        <div className="kpi-card orange"><div className="kpi-label">Avg Response Time</div><div className="kpi-value">{avgResponseHrs.toFixed(1)}h</div></div>
        <div className="kpi-card"><div className="kpi-label">Total Leads</div><div className="kpi-value">{total}</div></div>
      </div>

      <div className="grid two">
        <div className="panel">
          <div className="panel-title">Lead Funnel (Monthly)</div>
          <div className="chart">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={activityData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#6b5bff" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-title">Source Performance</div>
          <div className="chart">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {sourceData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend">
            {sourceData.map((d, i) => (
              <div key={d.name} className="legend-item">
                <span className="dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span>{d.name}</span>
                <span className="spacer" />
                <span>{Math.round((d.value / (leads.length || 1)) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid two">
        <div className="panel">
          <div className="panel-title">Sales Team Leaderboard</div>
          <div className="leaderboard">
            {['Alex Johnson','Sarah Wilson','Mike Chen','Emma Davis'].map((name, i) => (
              <div key={name} className="leader-row">
                <div className="rank">{i + 1}</div>
                <div className="name">{name}</div>
                <div className="metric">{20 - i * 2} deals</div>
                <div className="metric pill">{92 - i * 7}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-title">Recent Leads</div>
          <div className="recent-list">
            {leads.slice(0, 5).map(l => (
              <Link className="recent-item" key={l.id} to={`/leads/${l.id}`}>
                <div className="badge" data-status={l.status}>{l.status}</div>
                <div className="recent-meta">
                  <div className="recent-name">{l.name}</div>
                  <div className="recent-sub">{l.source} • {l.vehicleInterest?.make} {l.vehicleInterest?.model}</div>
                </div>
                <div className="recent-score">{l.hotnessScore}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Monthly Performance</div>
        <div className="progress">
          <div className="progress-bar" style={{ width: '75%' }} />
          <div className="progress-text">Target 200 • 75%</div>
        </div>
        <div className="subtle">You are reaching 75% of your monthly target. Keep pushing to exceed your goal!</div>
      </div>
    </div>
  );
}