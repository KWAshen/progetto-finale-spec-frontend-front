import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DestinationsProvider } from './context/DestinationsContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DestinationsProvider>
      <App />
<Toaster
  position="bottom-right"
  toastOptions={{
    style: {
      background: "#fff",
      color: "#111",
      borderRadius: "12px",
      padding: "10px 16px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      fontSize: "15px",
      fontWeight: "500",
      border: "1px solid #f0f0f0",
      maxWidth: "260px",
    },
    duration: 3500, 
  }}
/>

    </DestinationsProvider>
  </StrictMode>,
)