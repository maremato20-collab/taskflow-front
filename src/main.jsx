import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx' // Asegúrate de que este también termine en .jsx
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)