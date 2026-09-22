import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { PlatformShell } from './components/platform/PlatformShell'
import { AppDataProvider } from './context/AppDataContext'
import { PlatformProvider } from './context/PlatformContext'
import { AuditLogPage } from './pages/AuditLogPage'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { PatientProfilePage } from './pages/PatientProfilePage'
import { PatientsPage } from './pages/PatientsPage'
import { PlatformAuditLogPage } from './pages/platform/PlatformAuditLogPage'
import { PlatformDashboardPage } from './pages/platform/PlatformDashboardPage'
import { PlatformLoginPage } from './pages/platform/PlatformLoginPage'
import { PlatformOrganisationsPage } from './pages/platform/PlatformOrganisationsPage'
import { PlatformPricingPage } from './pages/platform/PlatformPricingPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { StaffPage } from './pages/StaffPage'

function App() {
  return (
    <PlatformProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/platform/login" element={<PlatformLoginPage />} />
            <Route path="/app" element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="patients" element={<PatientsPage />} />
              <Route path="patients/:id" element={<PatientProfilePage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="audit-log" element={<AuditLogPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="/platform" element={<PlatformShell />}>
              <Route index element={<PlatformDashboardPage />} />
              <Route path="organisations" element={<PlatformOrganisationsPage />} />
              <Route path="pricing" element={<PlatformPricingPage />} />
              <Route path="audit-log" element={<PlatformAuditLogPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </PlatformProvider>
  )
}

export default App
