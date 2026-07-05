import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import AdminPanel from './AdminPanel.jsx'

createRoot(document.getElementById('admin-root')).render(
  <StrictMode>
    <AdminPanel />
  </StrictMode>,
)
