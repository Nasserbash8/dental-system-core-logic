// components/Footer.tsx
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { Whatsapp } from "@/icons";
export default function Footer() {
  return (
 <footer className="bg-gray-900 text-white px-6 py-10">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center text-center sm:text-start">
    {/* Logo and Description */}
    <div>
        <Image
                            src="/images/mada_icon_light.svg"
                            alt="Dental background"
                            width={120}
                            height={100}
                            priority
                            className="mx-auto sm:mx-0 mb-2"
                          />
      <p className="text-sm text-gray-400">
        ابتسامتك هي أولويتنا. نقدم رعاية أسنان احترافية بكل لطف ودقة.
      </p>
    </div>

    {/* Navigation Links */}
    <div>
      <h3 className="text-lg font-semibold mb-4">خدمات</h3>
      <ul className="space-y-2 text-sm text-gray-300">
        <li><a href="#" className="hover:text-white">تنظيف الأسنان</a></li>
        <li><a href="#" className="hover:text-white">طب الأسنان التجميلي</a></li>
        <li><a href="#" className="hover:text-white">الزرعات</a></li>
        <li><a href="#" className="hover:text-white">رعاية الأطفال</a></li>
      </ul>
    </div>

    {/* Useful Links */}
    <div>
      <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
      <ul className="space-y-2 text-sm text-gray-300">
         <li><Link href="/" className="hover:text-white">الرئيسية</Link></li>
        <li><Link href="/about-us" className="hover:text-white">عن مدى</Link></li>
        <li><Link href="/login" className="hover:text-white">تسجيل دخول</Link></li>
        <li><Link href="/contact-us" className="hover:text-white">تواصل معنا</Link></li>
      </ul>
    </div>

    {/* Social Media */}
    <div>
      <h3 className="text-lg font-semibold mb-4">تابعنا</h3>
      <div className="flex justify-center sm:justify-start space-x-4 text-brand-900">
        <a href="https://www.facebook.com/share/1CuT7hHRMk/" className="hover:text-gray-400 transition"><Facebook /></a>
        <a  href="https://www.instagram.com/mada_dental_clinic?igsh=dTdmbGFhd2phZ3V4" className="hover:text-gray-400 transition"><Instagram /></a>
        <a  href="https://wa.me/963959254408?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AD%D8%AC%D8%B2%20%D9%85%D9%88%D8%B9%D8%AF" className="hover:text-gray-400"> <Whatsapp className="w-6 h-6  fill-brand-800 hover:fill-gray-400 transition"    /></a>
       
      </div>
    </div>
  </div>

  {/* Bottom Note */}
  <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
    &copy; {new Date().getFullYear()} مدى السنية . جميع الحقوق محفوظة
  </div>
</footer>
  );
}
