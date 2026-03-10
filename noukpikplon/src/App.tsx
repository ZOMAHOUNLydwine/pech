import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/context/AppContext';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Community from '@/pages/Community';
import Leaderboard from '@/pages/Leaderboard';
import Lessons from '@/pages/Lessons';
import LessonPlayer from '@/pages/LessonPlayer';
import Games from '@/pages/Games';
import Progress from '@/pages/Progress';
import AppLayout from '@/components/AppLayout';

import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import VerifyOTP from '@/pages/VerifyOTP';
import Subscription from '@/pages/Subscription';

// Admin Imports
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminLevels from '@/pages/admin/Levels';
import AdminContent from '@/pages/admin/Content';
import AdminUsers from '@/pages/admin/Users';
import AdminSettings from '@/pages/admin/Settings';
import AdminStats from '@/pages/admin/Stats';
import AdminMessages from '@/pages/admin/Messages';

function AppRoutes() {
  const { isAuthenticated, user, loading } = useApp();

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/" element={<Navigate to={isAuthenticated ? (user.targetLanguage ? "/dashboard" : "/onboarding") : "/onboarding"} replace />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Lesson Player (Fullscreen, no layout) */}
      <Route path="/lesson/:questId" element={isAuthenticated ? <LessonPlayer /> : <Navigate to="/onboarding" replace />} />
      <Route path="/games" element={isAuthenticated ? <Games /> : <Navigate to="/onboarding" replace />} />
      <Route path="/subscription" element={isAuthenticated ? <Subscription /> : <Navigate to="/onboarding" replace />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={isAuthenticated && user.isAdmin ? <AdminLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="levels" element={<AdminLevels />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="stats" element={<AdminStats />} />
        <Route path="messages" element={<AdminMessages />} />
      </Route>

      {/* Protected Routes wrapped in Layout */}
      <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/onboarding" replace />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}
