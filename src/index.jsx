import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import CheckoutPage from './pages/CheckoutPage'
import SuccessPage from './pages/SuccessPage'
import CancelPage from './pages/CancelPage'
import PublicForm from './pages/PublicForm'
import FormSuccess from './pages/FormSuccess'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/forms/event/:eventId" element={<PublicForm />} />
        <Route path="/form-success" element={<FormSuccess />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)

