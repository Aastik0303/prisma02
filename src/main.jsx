import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DeveloperPortal from './pages/DeveloperPortal.jsx'
const isDeveloperPortal = window.location.pathname.replace(/\/+$/, '') === '/developers'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isDeveloperPortal ? <DeveloperPortal /> : <App />}
  </StrictMode>,
)
