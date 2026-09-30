import { createBrowserRouter } from "react-router-dom"
import { RootLayout } from "@/layouts/RootLayout"
import { AdminLayout } from "@/layouts/AdminLayout"

import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ForgotPasswordPage from "@/pages/ForgotPasswordPage"
import ResetPasswordPage from "@/pages/ResetPasswordPage"

import ChatPage from "@/pages/ChatPage"
import ChatConversationPage from "@/pages/ChatConversationPage"
import SharedChatPage from "@/pages/SharedChatPage"
import SearchPage from "@/pages/SearchPage"
import StudentSearchPage from "@/pages/StudentSearchPage"
import StudentDetailPage from "@/pages/StudentDetailPage"
import ProfilePage from "@/pages/ProfilePage"
import SettingsPage from "@/pages/SettingsPage"

import AdminDashboardPage from "@/pages/AdminDashboardPage"
import AdminUsersPage from "@/pages/AdminUsersPage"
import AdminStudentsPage from "@/pages/AdminStudentsPage"
import AdminDocumentsPage from "@/pages/AdminDocumentsPage"

import NotFoundPage from "@/pages/NotFoundPage"
import UnauthorizedPage from "@/pages/UnauthorizedPage"
import ErrorPage from "@/pages/ErrorPage"

export const router = createBrowserRouter([
  // Public Landing & Auth Routes
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/shared/:shareToken",
    element: <SharedChatPage />,
  },

  // Authenticated Application Shell Routes
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/chat",
        element: <ChatPage />,
      },
      {
        path: "/chat/:chatId",
        element: <ChatConversationPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/students",
        element: <StudentSearchPage />,
      },
      {
        path: "/students/:studentId",
        element: <StudentDetailPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },

  // Admin Area Routes
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: "users",
        element: <AdminUsersPage />,
      },
      {
        path: "students",
        element: <AdminStudentsPage />,
      },
      {
        path: "documents",
        element: <AdminDocumentsPage />,
      },
    ],
  },

  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  // 404 Catch-All
  {
    path: "*",
    element: <NotFoundPage />,
  },
])
