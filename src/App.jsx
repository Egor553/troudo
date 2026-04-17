import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

// Компоненты
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ServicePage from './pages/ServicePage';
import Chat from './pages/Chat';
import MyServices from './pages/MyServices';
import BuyerLayout from './components/layout/BuyerLayout';
import SellerLayout from './components/layout/SellerLayout';

// Защищенный роут
const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useAppContext();
  if (loading) return <div className="flex h-screen items-center justify-center font-bold">Troudo...</div>;
  return isAuth ? children : <Navigate to="/login" replace />;
};

// Публичный роут
const PublicRoute = ({ children }) => {
  const { isAuth, loading } = useAppContext();
  if (loading) return null;
  return !isAuth ? children : <Navigate to="/dashboard" replace />;
};

// Шлюз главной страницы
const LandingGate = () => {
  const { isAuth } = useAppContext();
  return isAuth ? <Navigate to="/dashboard" replace /> : <Home />;
};

const RoleDashboard = () => {
  const { role } = useAppContext();
  return role === 'seller' ? <SellerLayout /> : <BuyerLayout />;
};

function App() {
  return (
    <AppProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<LandingGate />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/my-services" element={<MyServices />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <RoleDashboard />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
