import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import TicketPage from './components/TicketPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/ticket" element={<TicketPage />} />
        <Route path="/ticket/:num" element={<TicketPage />} />
        <Route path="*" element={<div className="p-6">페이지를 찾을 수 없습니다.</div>} />
      </Routes>
    </BrowserRouter>
  );
}
