import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MockupStudio from './pages/user/MockupStudio'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDevices from './pages/admin/AdminDevices'
import AdminTemplates from './pages/admin/AdminTemplates'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MockupStudio />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="devices" element={<AdminDevices />} />
          <Route path="templates" element={<AdminTemplates />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1c1917',
            color: '#fafaf9',
            border: '1px solid #292524',
            fontSize: '13px',
            borderRadius: '10px',
            fontFamily: "'Inter', sans-serif",
          },
          success: {
            iconTheme: { primary: '#f97316', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  )
}
