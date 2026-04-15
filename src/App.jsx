import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Главная страница (Positivus Landing) */}
        <Route path="/" element={<Home />} />

        {/* Внутренние страницы приложения */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />

        {/* Редиректы для удобства */}
        <Route path="/messages" element={<Navigate to="/chat" replace />} />
        <Route path="/services" element={<Navigate to="/" replace />} />

        {/* 404 - на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
