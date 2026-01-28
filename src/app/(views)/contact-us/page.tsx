// app/contact/page.tsx
import { Whatsapp } from "@/icons";
import Container from "@/layout/viewsLayout/Container";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

export default function ContactPage() {
  return (
    <Container>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-900 mb-4">
            تواصل معنا
          </h1>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            يسعدنا تواصلك معنا. اختر أي وسيلة تواصل أدناه وسنكون سعداء بخدمتك.
          </p>

          {/* Contact Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 mb-12">
            {/* Email */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-100 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Mail size={24} />
              </div>
              <div className="text-center md:text-right flex-1">
                <h3 className="text-md md:text-lg font-semibold text-gray-800">
                  البريد الإلكتروني
                </h3>
                <p className="text-xs md:text-md text-gray-600 mt-1 break-all">
                  <a href="mailto:info@madadental.com" className="hover:underline">
                    info@madadental.com
                  </a>
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-100 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Phone size={24} />
              </div>
              <div className="text-center md:text-right flex-1">
                <h3 className="text-md md:text-lg font-semibold text-gray-800">
                  رقم الهاتف
                </h3>
                <p className="text-xs md:text-md text-gray-600 mt-1">
                  <a href="tel:+963959821307" className="hover:underline">
                    +963 959 821 307
                  </a>
                </p>
                <p className="text-xs md:text-md text-gray-600 mt-1">
                  <a href="tel:+963959254408" className="hover:underline">
                    +963 959 254 408
                  </a>
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-100 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <MapPin size={24} />
              </div>
              <div className="text-center md:text-right flex-1">
                <h3 className="text-md md:text-lg font-semibold text-gray-800">
                  العنوان
                </h3>
                <p className="text-xs md:text-md text-gray-600 mt-1">
                  (سيف الدولة _مفرق الدوحة _جانب مول الدوحة _طابق اول)
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="border-t pt-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              تابعنا على مواقع التواصل
            </h3>
            <div className="flex justify-center gap-6">
              <a
                href="https://www.facebook.com/share/1CuT7hHRMk/"
                aria-label="تابعنا على فيسبوك"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <Facebook size={28} />
              </a>
              <a
                href="https://wa.me/963959254408?text=أرغب%20في%20حجز%20موعد"
                aria-label="تواصل معنا عبر واتساب"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <Whatsapp className="w-7 h-7 text-green-600" fill="#01a63e" />
              </a>
              <a
                href="https://www.instagram.com/mada_dental_clinic?igsh=dTdmbGFhd2phZ3V4"
                aria-label="تابعنا على انستغرام"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-700 transition"
              >
                <Instagram size={28} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
