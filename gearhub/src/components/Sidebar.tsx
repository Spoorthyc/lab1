import { NavLink } from 'react-router-dom';
import { useLeads } from '../context/LeadsContext';

export default function Sidebar() {
  const { users } = useLeads();
  const me = users.find(u => u.role === 'Manager') || users[0];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">🚗</div>
        <div className="brand-name">GearHub</div>
      </div>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>Dashboard</NavLink>
        <NavLink to="/leads" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>All Leads</NavLink>
        <NavLink to="/management" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>Lead Management</NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="profile">
          <div className="avatar" style={{ background: me.avatarColor }}>{me.name.split(' ').map(x => x[0]).slice(0,2).join('')}</div>
          <div className="profile-meta">
            <div className="profile-name">{me.name}</div>
            <div className="profile-role">{me.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}