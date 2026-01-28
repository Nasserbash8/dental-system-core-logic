'use client';

import Link from "next/link";
import { motion, AnimatePresence, cubicBezier, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";

type MenuProps = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (value: boolean) => void;
};

export default function Menu({ mobileNavOpen, setMobileNavOpen }: MenuProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const links = [
    { name: "الرئيسية", path: "/" },
    { name: "عن مدى", path: "/about-us" },
    { name: "تواصل معنا", path: "/contact-us" },
  ];

  const easing = cubicBezier(0.74, 0, 0.19, 1.02);

  // 1. غطاء القائمة ينزلق من الأعلى إلى الأسفل
  const menuBackgroundVariant: Variants = {
    opened: {
      y: 0,
      transition: {
        duration: 0.8,
        ease: easing,
      },
    },
    closed: {
      y: "-100%",
      transition: {
        delay: 0.5, // تأخير الإغلاق حتى تختفي الروابط أولاً
        duration: 0.6,
        ease: easing,
      },
    },
  };

  // 2. الحاوية التي تنظم ظهور العناصر خلف بعضها
  const ulVariant: Variants = {
    opened: {
      transition: {
        delayChildren: 0.4, // انتظر قليلاً حتى تنزلق الخلفية
        staggerChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  // 3. ظهور العناصر الفردية (تظهر من الأسفل للأعلى بعد انزلاق الخلفية)
  const liVariant: Variants = {
    opened: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <AnimatePresence>
      {mobileNavOpen && (
        <motion.nav
          initial="closed"
          animate="opened"
          exit="closed"
          variants={menuBackgroundVariant}
          className="fixed inset-0 z-[9999] bg-[#000000c9] text-white flex flex-col"
        >
          {/* رأس القائمة مع زر الإغلاق */}
          <div className="flex justify-end p-6">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => setMobileNavOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-8 h-8" />
            </motion.button>
          </div>

          {/* قائمة الروابط */}
          <div className="flex flex-col items-center justify-center flex-grow">
            <motion.ul
              variants={ulVariant}
              className="flex flex-col gap-8 text-center"
            >
              {links.map((navItem) => (
                <motion.li
                  key={navItem.path}
                  variants={liVariant}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-2xl font-bold ${
                    pathname === navItem.path ? "text-brand-500" : "text-white"
                  }`}
                >
                  <Link
                    href={navItem.path}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {navItem.name}
                  </Link>
                </motion.li>
              ))}

              <motion.li variants={liVariant}>
                {status === "authenticated" ? (
                  <Link
                    href={`/profile/${session?.user?.id}`}
                    onClick={() => setMobileNavOpen(false)}
                    className="text-2xl font-bold text-white"
                  >
                    حسابي
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileNavOpen(false)}
                    className="text-2xl font-bold text-white"
                  >
                    تسجيل دخول
                  </Link>
                )}
              </motion.li>
            </motion.ul>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}