import { useLocation, Link } from 'react-router-dom';

export default function Topbar() {
  const location = useLocation();
  const title = location.pathname === '/'
    ? 'Dashboard'
    : location.pathname.startsWith('/leads/')
      ? 'Lead Details'
      : location.pathname.startsWith('/leads')
        ? 'All Leads'
        : 'Lead Management';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span> / </span>
          <span>{title}</span>
        </div>
      </div>
      <div className="topbar-actions">
        <input className="search" placeholder="Search leads..." />
        <button className="btn ghost">Create Lead</button>
        <button className="btn primary">+ Add Activity</button>
      </div>
    </header>
  );
}