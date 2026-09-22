import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AppDataProvider } from './context/AppDataContext'
import { AuditLogPage } from './pages/AuditLogPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { PatientProfilePage } from './pages/PatientProfilePage'
import { PatientsPage } from './pages/PatientsPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { StaffPage } from './pages/StaffPage'

function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientProfilePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/audit-log" element={<AuditLogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  )
}

export default App
