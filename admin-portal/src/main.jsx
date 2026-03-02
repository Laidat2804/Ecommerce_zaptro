import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { SearchProvider } from './context/SearchContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
