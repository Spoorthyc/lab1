import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import LeadList from './pages/LeadList'
import LeadDetails from './pages/LeadDetails'
import LeadManagement from './pages/LeadManagement'
import { LeadsProvider } from './context/LeadsContext'
import './App.css'

function App() {
  return (
    <LeadsProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<LeadList />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="management" element={<LeadManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </LeadsProvider>
  )
}

export default App
