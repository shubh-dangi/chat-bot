import { createBrowserRouter, type RouteObject } from "react-router-dom"
import { RootLayout } from "@/layouts/RootLayout"
import { AdminLayout } from "@/layouts/AdminLayout"
import { lazyPage } from "./lazyPage"

import LandingPage from "@/pages/LandingPage"

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
    element: lazyPage(() => import("@/pages/LoginPage")),
  },
  {
    path: "/register",
    element: lazyPage(() => import("@/pages/RegisterPage")),
  },
  {
    path: "/forgot-password",
    element: lazyPage(() => import("@/pages/ForgotPasswordPage")),
  },
  {
    path: "/reset-password",
    element: lazyPage(() => import("@/pages/ResetPasswordPage")),
  },
  {
    path: "/shared/:shareToken",
    element: lazyPage(() => import("@/pages/SharedChatPage")),
  },

  // Authenticated Application Shell Routes
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/chat",
        element: lazyPage(() => import("@/pages/ChatPage")),
      },
      {
        path: "/chat/:chatId",
        element: lazyPage(() => import("@/pages/ChatConversationPage")),
      },
      {
        path: "/profile",
        element: lazyPage(() => import("@/pages/ProfilePage")),
      },
      {
        path: "/settings",
        element: lazyPage(() => import("@/pages/SettingsPage")),
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
        element: lazyPage(() => import("@/pages/AdminDashboardPage")),
      },
      {
        path: "users",
        element: lazyPage(() => import("@/pages/AdminUsersPage")),
      },
      {
        path: "students",
        element: lazyPage(() => import("@/pages/AdminStudentsPage")),
      },
      {
        path: "documents",
        element: lazyPage(() => import("@/pages/AdminDocumentsPage")),
      },
    ],
  },

  {
    path: "/unauthorized",
    element: lazyPage(() => import("@/pages/UnauthorizedPage")),
  },

  // 404 Catch-All
  {
    path: "*",
    element: lazyPage(() => import("@/pages/NotFoundPage")),
  },
] satisfies RouteObject[])

