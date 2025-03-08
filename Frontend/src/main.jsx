import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './Reducers/UserReducer.jsx'
import { AdminProvider } from './Reducers/AdminReducer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </UserProvider>
    </BrowserRouter>


  </StrictMode>,
)
