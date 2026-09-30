export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  
  CHAT: "/chat",
  CHAT_CONVERSATION: (id: string) => `/chat/${id}`,
  CHAT_PARAM: "/chat/:chatId",
  
  SHARED: (token: string) => `/shared/${token}`,
  SHARED_PARAM: "/shared/:shareToken",

  PROFILE: "/profile",
  
  SETTINGS: "/settings",
  SETTINGS_APPEARANCE: "/settings?tab=appearance",
  SETTINGS_ACCOUNT: "/settings?tab=account",
  SETTINGS_SECURITY: "/settings?tab=security",
  SETTINGS_PREFERENCES: "/settings?tab=preferences",
  
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_DOCUMENTS: "/admin/documents",
  UNAUTHORIZED: "/unauthorized",
} as const
