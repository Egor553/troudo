import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import { ForgotPassword, ResetPassword } from './pages/PasswordReset';
import ClientDashboard from './pages/ClientDashboard';
import CreateOrder from './pages/CreateOrder';
import ProjectOffers from './pages/ProjectOffers';
import FreelancerApplication from './pages/FreelancerApplication';
import FreelancerDashboard from './pages/FreelancerDashboard';
import Catalog from './pages/Catalog';
import Exchange from './pages/Exchange';
import OrdersHistory from './pages/OrdersHistory';
import Messenger from './pages/Messenger';
import KworkDetail from './pages/KworkDetail';
import CreateKwork from './pages/CreateKwork';
import OrderPage from './pages/OrderPage';
import DisputePage from './pages/DisputePage';
import AdminPanel from './pages/AdminPanel';
import FreelancerProfile from './pages/FreelancerProfile';
import Settings from './pages/Settings';
import './index.css';

// ── Заглушка: защищённый маршрут ──────────────────────────
function PrivateRoute({ children, requiredRole }) {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (requiredRole && user?.activeRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// ── Маршрут только для гостей (логин/регистрация) ────────
function GuestRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="app-container">
              <Header />
              <main className="main-content">
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/exchange" element={<Exchange />} />
                  <Route path="/orders" element={<OrdersHistory />} />
                  <Route path="/messages" element={<PrivateRoute><Messenger /></PrivateRoute>} />
                  <Route path="/kwork/:id" element={<KworkDetail />} />
                  <Route path="/user/:username" element={<FreelancerProfile />} />

                  {/* Auth (только для гостей) */}
                  <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                  <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify" element={<VerifyEmail />} />

                  {/* Client routes */}
                  <Route path="/dashboard" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
                  <Route path="/create-order" element={<PrivateRoute><CreateOrder /></PrivateRoute>} />
                  <Route path="/project/:id/offers" element={<PrivateRoute requiredRole="client"><ProjectOffers /></PrivateRoute>} />
                  <Route path="/become-freelancer" element={<PrivateRoute><FreelancerApplication /></PrivateRoute>} />
                  <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

                  {/* Freelancer routes */}
                  <Route path="/freelancer/dashboard" element={<PrivateRoute><FreelancerDashboard /></PrivateRoute>} />
                  <Route path="/freelancer/create-kwork" element={<PrivateRoute><CreateKwork /></PrivateRoute>} />

                  {/* Deals */}
                  <Route path="/order/:id" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
                  <Route path="/dispute/:id" element={<PrivateRoute><DisputePage /></PrivateRoute>} />

                  {/* Admin */}
                  <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminPanel /></PrivateRoute>} />

                  {/* 404 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
