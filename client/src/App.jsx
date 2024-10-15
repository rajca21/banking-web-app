import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './store/authStore';
import LoadingSpinner from './components/shared/LoadingSpinner';
import PrivateRoute from './components/auth/PrivateRoute';
import RedirectAuthRoute from './components/auth/RedirectAuthRoute';
import LandingLayout from './components/layout/LandingLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Landing from './pages/public/Landing';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/private/Dashboard';
import PinForm from './pages/private/PinForm';
import NotFound from './pages/public/NotFound';

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES START */}
        <Route
          path='/'
          element={
            <LandingLayout>
              <Landing />
            </LandingLayout>
          }
        />
        {/* PUBLIC ROUTES END */}

        {/* AUTH ROUTES START */}
        <Route
          path='/login'
          element={
            <RedirectAuthRoute>
              <LandingLayout>
                <Login />
              </LandingLayout>
            </RedirectAuthRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <RedirectAuthRoute>
              <LandingLayout>
                <SignUp />
              </LandingLayout>
            </RedirectAuthRoute>
          }
        />
        <Route
          path='/verify-email/:email'
          element={
            <RedirectAuthRoute>
              <LandingLayout>
                <VerifyEmail />
              </LandingLayout>
            </RedirectAuthRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <RedirectAuthRoute>
              <LandingLayout>
                <ForgotPassword />
              </LandingLayout>
            </RedirectAuthRoute>
          }
        />
        <Route
          path='/reset-password/:token/:email'
          element={
            <RedirectAuthRoute>
              <LandingLayout>
                <ResetPassword />
              </LandingLayout>
            </RedirectAuthRoute>
          }
        />
        {/* AUTH ROUTES END */}

        {/* PRIVATE ROUTES START */}
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path='/pin'
          element={
            <PrivateRoute>
              <LandingLayout>
                <PinForm />
              </LandingLayout>
            </PrivateRoute>
          }
        />
        {/* PRIVATE ROUTES END */}

        {/* NOT FOUND ROUTE START */}
        <Route
          path='*'
          element={
            <LandingLayout>
              <NotFound />
            </LandingLayout>
          }
        />
        {/* NOT FOUND ROUTE END */}
      </Routes>

      <Toaster reverseOrder={false} position='top-center' />
    </BrowserRouter>
  );
}

export default App;
