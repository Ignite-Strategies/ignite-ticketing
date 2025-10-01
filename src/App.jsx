import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
      </Routes>
    </Router>
  );
}

export default App;
