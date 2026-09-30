import { createBrowserRouter, type RouteObject } from "react-router-dom"
import { lazy, Suspense, type ComponentType } from "react"
import { RootLayout } from "@/layouts/RootLayout"
import { AdminLayout } from "@/layouts/AdminLayout"

import LandingPage from "@/pages/LandingPage"

import ErrorPage from "@/pages/ErrorPage"

/**
 * Leaf pages are code-split so the initial bundle stays small. Each page gets its
 * own Suspense boundary so navigating between routes never blanks the app shell
 * (sidebar, header, toast host) that is already mounted.
 */
function lazyPage(loader: () => Promise<{ default: ComponentType }>): React.ReactElement {
  const Lazy = lazy(loader)
  return (
    <Suspense fallback={<RouteFallback />}>
      <Lazy />
    </Suspense>
  )
}

function RouteFallback() {
  return (
    <div
      className="flex-1 min-h-0 h-full w-full flex items-center justify-center p-8 bg-bg-primary"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="h-6 w-6 rounded-full border-2 border-border-strong border-t-brand animate-spin" />
    </div>
  )
}

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
        path: "/search",
        element: lazyPage(() => import("@/pages/SearchPage")),
      },
      {
        path: "/students",
        element: lazyPage(() => import("@/pages/StudentSearchPage")),
      },
      {
        path: "/students/:studentId",
        element: lazyPage(() => import("@/pages/StudentDetailPage")),
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

