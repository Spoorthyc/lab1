import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function AppLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Topbar />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}