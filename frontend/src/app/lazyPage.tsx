import { lazy, Suspense, type ComponentType, type ReactElement } from "react"

/**
 * Wraps a page in React.lazy so every route ships as its own chunk.
 *
 * The Suspense boundary is per-page rather than app-level on purpose: navigating
 * between routes then only suspends the page body, so the already-mounted shell
 * (sidebar, header, toast host) never blanks out.
 */
export function lazyPage(loader: () => Promise<{ default: ComponentType }>): ReactElement {
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
      className="flex-1 min-h-0 h-full w-full min-w-0 flex items-center justify-center p-8 bg-bg-primary"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="h-6 w-6 rounded-full border-2 border-border-strong border-t-brand animate-spin" />
    </div>
  )
}
