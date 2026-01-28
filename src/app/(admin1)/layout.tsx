"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {  useSession } from "next-auth/react";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();  // Get the session

  const isLoginPage = pathname === "/dashboard/signin";  // Path for login page
const isUnderConstruction = pathname === "/dashboard/maintenance";

  // If user is already logged in, redirect them away from login page (if applicable)
  useEffect(() => {
    if (status === "authenticated" && isLoginPage) {
      router.push("/dashboard");  // Redirect to dashboard if logged in
    }
  }, [status, isLoginPage, router]);

  if (isLoginPage || isUnderConstruction ) {
    return <>{children}</>;  // Show the login page as normal
  }

  const mainContentMargin = isMobileOpen
    ? "mr-0"
    : isExpanded || isHovered
    ? "lg:mr-[290px]"
    : "lg:mr-[90px]";

  return (
   
      <div className="min-h-screen xl:flex">
        <AppSidebar />
        <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
          <AppHeader />
          <div className="p-4  max-w-screen-2xl md:p-6">{children}</div>
        </div>
      </div>

  );
}
