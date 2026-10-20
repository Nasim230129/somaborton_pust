import React, { useEffect, Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { syncWithBackend } from "./services/api";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingFallback from "./components/LoadingFallback";

import PublicRoot from "./layouts/PublicRoot";
import DashRoot from "./layouts/DashRoot";
import AdminRoot from "./layouts/AdminRoot";

// Public Pages (Code-split for performance)
const Home = lazy(() => import("./pages/public/Home"));
const Directory = lazy(() => import("./pages/public/Directory"));
const AlumniProfile = lazy(() => import("./pages/public/AlumniProfile"));
const Stories = lazy(() => import("./pages/public/Stories"));
const Events = lazy(() => import("./pages/public/Events"));
const Jobs = lazy(() => import("./pages/public/Jobs"));
const Mentorship = lazy(() => import("./pages/public/Mentorship"));
const Donate = lazy(() => import("./pages/public/Donate"));
const About = lazy(() => import("./pages/public/About"));
const Gallery = lazy(() => import("./pages/public/Gallery"));
const Community = lazy(() => import("./pages/public/Community"));
const Contact = lazy(() => import("./pages/public/Contact"));

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// Dashboard Pages
const DashboardOverview = lazy(() => import("./pages/dashboard/Overview"));
const DashboardNetwork = lazy(() => import("./pages/dashboard/Network"));
const DashboardMessages = lazy(() => import("./pages/dashboard/Messages"));
const DashboardMentorship = lazy(() => import("./pages/dashboard/Mentorship"));
const DashboardJobs = lazy(() => import("./pages/dashboard/Jobs"));
const DashboardCommunity = lazy(() => import("./pages/dashboard/Community"));
const DashboardAchievements = lazy(() => import("./pages/dashboard/Achievements"));
const DashboardProfile = lazy(() => import("./pages/dashboard/Profile"));
const DashboardSettings = lazy(() => import("./pages/dashboard/Settings"));
const DashboardNotifications = lazy(() => import("./pages/dashboard/Notifications"));

// Admin Pages
const AdminOverview = lazy(() => import("./pages/admin/Overview"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminVerification = lazy(() => import("./pages/admin/Verification"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminJobs = lazy(() => import("./pages/admin/AdminJobs"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));

// 404 Fallback Page
const NotFound = lazy(() => import("./pages/NotFound"));

function NotFoundWrapper() {
  return (
    <Suspense fallback={<LoadingFallback message="Loading..." />}>
      <NotFound />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicRoot,
    children: [
      { index: true, Component: Home },
      { path: "alumni", Component: Directory },
      { path: "alumni/:id", Component: AlumniProfile },
      { path: "directory", Component: Directory },
      { path: "directory/:id", Component: AlumniProfile },
      { path: "stories", Component: Stories },
      { path: "stories/:id", Component: Stories },
      { path: "news", Component: Stories },
      { path: "news/:id", Component: Stories },
      { path: "events", Component: Events },
      { path: "jobs", Component: Jobs },
      { path: "mentorship", Component: Mentorship },
      { path: "donate", Component: Donate },
      { path: "about", Component: About },
      { path: "gallery", Component: Gallery },
      { path: "community", Component: Community },
      { path: "contact", Component: Contact },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  {
    path: "/dashboard",
    Component: DashRoot,
    children: [
      { index: true, Component: DashboardOverview },
      { path: "network", Component: DashboardNetwork },
      { path: "messages", Component: DashboardMessages },
      { path: "mentorship", Component: DashboardMentorship },
      { path: "jobs", Component: DashboardJobs },
      { path: "community", Component: DashboardCommunity },
      { path: "achievements", Component: DashboardAchievements },
      { path: "profile", Component: DashboardProfile },
      { path: "settings", Component: DashboardSettings },
      { path: "notifications", Component: DashboardNotifications },
    ],
  },
  {
    path: "/admin",
    Component: AdminRoot,
    children: [
      { index: true, Component: AdminOverview },
      { path: "users", Component: AdminUsers },
      { path: "verification", Component: AdminVerification },
      { path: "analytics", Component: AdminAnalytics },
      { path: "jobs", Component: AdminJobs },
      { path: "events", Component: AdminEvents },
    ],
  },
  { path: "*", Component: NotFoundWrapper },
]);

export default function App() {
  useEffect(() => {
    syncWithBackend();
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
