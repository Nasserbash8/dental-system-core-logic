'use client'
import { useState  , useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram ,Home, Phone, Info  } from 'lucide-react';
import Menu from "./MobileMenu";
import { Menu as MenuIcon } from "lucide-react"; // or any hamburger icon
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Whatsapp } from "@/icons";
function MainHeader() {
    const pathname = usePathname();
   const { data: session, status } = useSession();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const navLinks = [
        { name: 'الرئيسية', href: '/', icon: <Home className="w-4 h-4 mx-3" /> },
        { name: 'عن مدى', href: '/about-us', icon: <Info className="w-4 h-4 mx-3" /> },
        { name: 'تواصل معنا', href: '/contact-us', icon: <Phone className="w-4 h-4 mx-3" /> },
      ];
    return (
        <header className="w-full border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-[6rem] w-[70%]">
              <Link href="/" className="text-xl font-bold text-gray-800">
                <img
                  className="mx-auto w-[130px] h-[70px] object-contain"
                  src="/images/Mada.png"
                  alt="Logo"
                  
                />  
              </Link>
  
              <nav className="flex space-x-6 font-bold text-gray-800 transition rtl:space-x-reverse">
                {navLinks.map(({ name, href }) => (
                  <Link
                    key={href}
                    href={href}
                    aria-current={pathname === href ? 'page' : undefined}
                    className={`relative group flex items-center mx-3 gap-6 transition hover:text-brand-900 ${
                      pathname === href ? 'text-brand-900' : ''
                    }`}
                  >
                    {name}
                    <span
                      className={`absolute -bottom-1 right-0 w-full h-0.5 bg-brand-900 transition-transform duration-300 scale-x-0 origin-right group-hover:scale-x-100 ${
                        pathname === href ? 'scale-x-100 origin-left' : ''
                      }`}
                    />
                  </Link>
                ))}
              </nav>
            </div>
  
            <div className="flex items-center space-x-3 text-gray-600">
              {
                    status === "authenticated" ? (
                      <Link
                href={`/profile/${session.user.id}`}
                className="bg-brand-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
              >
               حسابي
              </Link>
                    ) : (
                      <Link
                href="/login"
                className="bg-brand-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
              >
                تسجيل دخول
              </Link>
                    )

              }
            
              <a  href="https://www.facebook.com/share/1CuT7hHRMk/" target="_blank" aria-label="Facebook">
                <Facebook className="w-5 h-5 text-gray-800 hover:text-brand-600 transition" />
              </a>
              <a href="https://wa.me/963959254408?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AD%D8%AC%D8%B2%20%D9%85%D9%88%D8%B9%D8%AF" target="_blank" aria-label="Twitter">
                
                  <Whatsapp className="w-5 h-7 text-green-600 fill-gray-800 hover:fill-brand-900 transition"    />
              </a>
              <a   href="https://www.instagram.com/mada_dental_clinic?igsh=dTdmbGFhd2phZ3V4" target="_blank" aria-label="Instagram">
                <Instagram className="w-5 h-5 text-gray-800 hover:text-brand-500 transition" />
              </a>
            </div>
          </div>
  
          {/* Mobile Header */}

          <div className="relative flex items-center justify-between md:hidden h-12">
            {/* Left - Login Button */}
                      {
                    status === "authenticated" ? (
                      <Link
                href={`/profile/${session.user.id}`}
                className="bg-brand-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
              >
               حسابي
              </Link>
                    ) : (
                      <Link
                href="/login"
                className="bg-brand-900 text-white px-2 py-2 rounded-lg text-xs hover:bg-gray-800 transition"
              >
                تسجيل دخول
              </Link>
                    )

              }

    <div className="ml-10">
    <Link href="/" className="text-xl   font-bold text-gray-800 bg-red-500">
                <img
                  className="mx-auto w-[120px] h-[70px] "
                  src="/images/Mada.png"
                  alt="Logo"
                  
                />  
              
            </Link>
        </div>  
            {/* Center - Logo */}
           
  
            {/* Right - Menu Icon */}
            <button onClick={() => setMobileNavOpen(true)}>
              <MenuIcon className="w-6 h-6 text-gray-800 " />
            </button>
          </div>
        </div>
  
        {/* Mobile Menu Component */}
        <div className="md:hidden">
          <Menu mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />
        </div>
      </header>
    );
  }

export default MainHeader;