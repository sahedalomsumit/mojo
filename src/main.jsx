import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Early scroll restoration fix
if (typeof window !== 'undefined') {
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  // Clear hash to prevent jumping to sections on refresh
  if (window.location.hash) {
    window.history.replaceState(null, null, ' ');
  }
}



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
