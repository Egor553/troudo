import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Exchange from './pages/Exchange';
import ServicePage from './pages/ServicePage';
import CategoryHub from './pages/CategoryHub';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

// Компонент-обертка для защищенных страниц
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center bg-white font-bold text-2xl">Troudo...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/service/:id" element={<ServicePage />} />
          <Route path="/category/:slug" element={<CategoryHub />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } />
          
          <Route path="/chat" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
