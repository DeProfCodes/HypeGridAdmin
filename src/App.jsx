import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

import PortalLayout from '@/components/layout/PortalLayout';
import Dashboard from '@/pages/Dashboard';
import Campaigns from '@/pages/Campaigns';
import CampaignDetail from '@/pages/CampaignDetail';
import Clients from '@/pages/Clients';
import ClientDetail from '@/pages/ClientDetail';
import Creators from '@/pages/Creators';
import CreatorDetail from '@/pages/CreatorDetail';
import Requests from '@/pages/Requests';
import Deliverables from '@/pages/Deliverables';
import CalendarPage from '@/pages/CalendarPage';
import Quotes from '@/pages/Quotes';
import Payments from '@/pages/Payments';
import Payouts from '@/pages/Payouts';
import Reports from '@/pages/Reports';
import Team from '@/pages/Team';
import Settings from '@/pages/Settings';
import Messages from '@/pages/Messages';
import HeroAds from '@/pages/HeroAds';
import Deals from '@/pages/Deals';
import FeaturedVideoPage from '@/pages/FeaturedVideoPage';
import PlacementAnalytics from '@/pages/PlacementAnalytics';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background grid-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-lg font-display">H</span>
          </div>
          <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<PortalLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/creators/:id" element={<CreatorDetail />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/deliverables" element={<Deliverables />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/payouts" element={<Payouts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/hero-ads" element={<HeroAds />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/featured-video" element={<FeaturedVideoPage />} />
          <Route path="/placement-analytics" element={<PlacementAnalytics />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/messages" element={<Messages />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App