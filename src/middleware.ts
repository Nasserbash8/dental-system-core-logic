import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isSigninPage = pathname === "/dashboard/signin";
  const isMaintenancePage = pathname === "/dashboard/maintenance";

  const maintenanceMode =
    process.env.NEXT_PUBLIC_DASHBOARD_MAINTENANCE === "true";

  // 🔧 Redirect to maintenance if enabled
  if (
    maintenanceMode &&
    isDashboardRoute &&
    !isSigninPage &&
    !isMaintenancePage
  ) {
    return NextResponse.redirect(
      new URL("/dashboard/maintenance", req.url)
    );
  }

  // 🔧 Redirect back to dashboard if maintenance disabled and currently on maintenance page
  if (!maintenanceMode && isMaintenancePage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🔐 Auth protection
  const token = req.cookies.get("admin-token")?.value;

  if (
    isDashboardRoute &&
    !isSigninPage &&
    !isMaintenancePage &&
    !token
  ) {
    return NextResponse.redirect(
      new URL("/dashboard/signin", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
