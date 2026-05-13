import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientBookPage from './pages/patient/PatientBookPage';
import PhysicianDashboard from './pages/physician/PhysicianDashboard';
import PhysicianSchedulePage from './pages/physician/PhysicianSchedulePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSchedulePage from './pages/admin/AdminSchedulePage';
import AdminBookPage from './pages/admin/AdminBookPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';

function ProtectedRoute({ children, role }) {
  const { currentUser } = useApp();
  const location = useLocation();
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (role && currentUser.role !== role) {
    const dest =
      currentUser.role === 'patient'
        ? '/patient/dashboard'
        : currentUser.role === 'physician'
        ? '/physician/dashboard'
        : '/admin/dashboard';
    return <Navigate to={dest} replace />;
  }
  return children;
}

function RootRedirect() {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'patient') return <Navigate to="/patient/dashboard" replace />;
  if (currentUser.role === 'physician') return <Navigate to="/physician/dashboard" replace />;
  return <Navigate to="/admin/dashboard" replace />;
}

/** ScrollRestoration only works with createBrowserRouter; with BrowserRouter we scroll to top on navigation. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute role="patient">
            <PatientAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/book"
        element={
          <ProtectedRoute role="patient">
            <PatientBookPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/physician/dashboard"
        element={
          <ProtectedRoute role="physician">
            <PhysicianDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/physician/schedule"
        element={
          <ProtectedRoute role="physician">
            <PhysicianSchedulePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/schedule"
        element={
          <ProtectedRoute role="admin">
            <AdminSchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute role="admin">
            <AdminBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/book"
        element={
          <ProtectedRoute role="admin">
            <AdminBookPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
