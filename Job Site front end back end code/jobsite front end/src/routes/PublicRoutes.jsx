// Public routes
import { Routes, Route } from 'react-router-dom';
import GuestGuard from '../guards/GuestGuard';
import LandingPage from '../pages/Public/LandingPage';
import About from '../pages/Public/About';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import NotFound from '../pages/Public/NotFound';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/login"
        element={
          <GuestGuard>
            <Login />
          </GuestGuard>
        }
      />
      <Route
        path="/register"
        element={
          <GuestGuard>
            <Register />
          </GuestGuard>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestGuard>
            <ForgotPassword />
          </GuestGuard>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;

