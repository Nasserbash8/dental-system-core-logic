import { NextResponse } from "next/server";
import type { NextRequest } from "next/request";

/**
 * @Edge_Runtime_Middleware
 * This middleware acts as a centralized 'Guard' for the administrative dashboard.
 * It manages: 
 * 1. Global Maintenance Mode (via Environment Variables).
 * 2. Route-based Authentication (Cookie validation).
 * 3. Redirect Logic for unauthorized access.
 */

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isSigninPage = pathname === "/dashboard/signin";
  const isMaintenancePage = pathname === "/dashboard/maintenance";

  // Configuration-driven Maintenance Mode
  const maintenanceMode = process.env.NEXT_PUBLIC_DASHBOARD_MAINTENANCE === "true";

  /**
   * @Logic_Maintenance:
   * Prevents dashboard access during system updates, ensuring data integrity.
   * Excludes the sign-in and maintenance pages to avoid redirection loops.
   */
  if (
    maintenanceMode &&
    isDashboardRoute &&
    !isSigninPage &&
    !isMaintenancePage
  ) {
    return NextResponse.redirect(new URL("/dashboard/maintenance", req.url));
  }

  // Auto-recovery: Redirect back to dashboard if maintenance is toggled off
  if (!maintenanceMode && isMaintenancePage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  /**
   * @Logic_Authentication:
   * Protects administrative routes by verifying the HttpOnly 'admin-token'.
   * Runs at the Edge to reduce latency before reaching Server Components.
   */
  const token = req.cookies.get("admin-token")?.value;

  if (
    isDashboardRoute &&
    !isSigninPage &&
    !isMaintenancePage &&
    !token
  ) {
    return NextResponse.redirect(new URL("/dashboard/signin", req.url));
  }

  return NextResponse.next();
}

/**
 * Optimized Matcher: 
 * Only executes the middleware on dashboard paths to save Edge compute resources.
 */
export const config = {
  matcher: ["/dashboard/:path*"],
};