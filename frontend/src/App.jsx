import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { syncWithBackend } from "./services/api";

import PublicRoot from "./layouts/PublicRoot";
import DashRoot from "./layouts/DashRoot";
import AdminRoot from "./layouts/AdminRoot";

import Home from "./pages/public/Home";
import Directory from "./pages/public/Directory";
import AlumniProfile from "./pages/public/AlumniProfile";
import Stories from "./pages/public/Stories";
import Events from "./pages/public/Events";
import Jobs from "./pages/public/Jobs";
import Mentorship from "./pages/public/Mentorship";
import Donate from "./pages/public/Donate";
import About from "./pages/public/About";
import Gallery from "./pages/public/Gallery";
import Community from "./pages/public/Community";
import Contact from "./pages/public/Contact";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import DashboardOverview from "./pages/dashboard/Overview";
import DashboardNetwork from "./pages/dashboard/Network";
import DashboardMessages from "./pages/dashboard/Messages";
import DashboardMentorship from "./pages/dashboard/Mentorship";
import DashboardJobs from "./pages/dashboard/Jobs";
import DashboardCommunity from "./pages/dashboard/Community";
import DashboardAchievements from "./pages/dashboard/Achievements";
import DashboardProfile from "./pages/dashboard/Profile";
import DashboardSettings from "./pages/dashboard/Settings";
import DashboardNotifications from "./pages/dashboard/Notifications";

import AdminOverview from "./pages/admin/Overview";
import AdminUsers from "./pages/admin/Users";
import AdminVerification from "./pages/admin/Verification";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminEvents from "./pages/admin/AdminEvents";

import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicRoot,
    children: [
      { index: true, Component: Home },
      { path: "alumni", Component: Directory },
      { path: "alumni/:id", Component: AlumniProfile },
      { path: "stories", Component: Stories },
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
  { path: "*", Component: NotFound },
]);

export default function App() {
  useEffect(() => {
    syncWithBackend();
  }, []);
  return <RouterProvider router={router} />;
}
