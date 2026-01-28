"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PlugInIcon,
  UserCircleIcon,
} from "../icons/index";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[]; 
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "الرئيسية",
    path: "/dashboard",
  },
  {
    icon: <UserCircleIcon />,
    name: "المرضى",
    path: "/dashboard/patients",
    subItems: [
      { name: "جميع المرضى", path: "/dashboard/patients" },
      { name: "اضافة  مريض", path: "/dashboard/patients/addPatients" }],
  },
  {
    icon: <CalenderIcon />,
    name: "المواعيد",
    path: "/dashboard/calendar",
  },

 
  
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

    const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      // Call the logout API
      const res = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        // If logout is successful, redirect to login page
         window.location.href = "/dashboard/signin";
      } else {
        // Handle errors
        console.error(data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }; 
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => {
      if (prev && prev.index === index) {
        return null;
      }
      return { type: "main", index };
    });
  };

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              <span
                className={`${
                  openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`mr-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`main-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 mr-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 mr-auto">
                        {subItem.new && (
                          <span
                            className={`mr-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`mr-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-auto bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-l border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px] left-0" // For visible sidebar, position it to the right
            : isHovered
            ? "w-[290px] left-0" // If hovered, position at the right
            : "w-[90px] left-auto" // For collapsed view, move it to the left, no translation
        }
        ${isMobileOpen ? "translate-x-0" : "translate-x-full"} // Make it slide from the right
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-end"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className=" mx-auto "
                src="/images/Mada.png"
                alt="Logo"
                width={150}
                height={40}
              />
             
            </>
          ) : (
            <Image
              src="/images/mada_icon.svg"
              alt="Logo"
              width={50}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col justify-between h-full overflow-y-auto duration-300 ease-linear no-scrollbar">
  {/* Top Navigation Items */}
  <nav className="mb-6">
    <div className="flex flex-col gap-4">
      <div>
        <h2
          className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
            !isExpanded && !isHovered ? "lg:justify-center" : "justify-end"
          }`}
        >
          {isExpanded || isHovered || isMobileOpen ? "" : <HorizontaLDots />}
        </h2>
        {renderMenuItems(navItems)}
      </div>
    </div>
  </nav>

  {/* Logout Item at the Bottom */}
  <div className="mb-8 px-2">
    <button
        onClick={handleLogout} disabled={loading}
      className="menu-item group w-full text-left menu-item-inactive"
    >
      <span className="menu-item-icon-inactive">
        <PlugInIcon />
      </span>
      {(isExpanded || isHovered || isMobileOpen) && (
        <span className="menu-item-text block lg:inline">تسجيل الخروج</span>
      )}
    </button>
  </div>
</div>
    </aside>
  );
};

export default AppSidebar;
