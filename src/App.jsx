import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ROLES } from './lib/roles';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { RequireRole } from './components/auth/RequireRole';
import { RoleHomeRedirect } from './components/auth/RoleHomeRedirect';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { AccountPendingPage } from './pages/AccountPendingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PropertiesPage } from './pages/customer/PropertiesPage';
import { DashboardPage } from './pages/owner/DashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages: no chatbot */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/account-pending" element={<AccountPendingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Sends a signed-in user to their role's home page */}
          <Route path="/app" element={<RoleHomeRedirect />} />

          {/* Customer-only pages */}
          <Route element={<RequireRole role={ROLES.CUSTOMER} />}>
            <Route element={<AppLayout />}>
              <Route path="/properties" element={<PropertiesPage />} />
            </Route>
          </Route>

          {/* Owner-only pages */}
          <Route element={<RequireRole role={ROLES.OWNER} />}>
            <Route element={<AppLayout />}>
              <Route path="/owner/dashboard" element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
