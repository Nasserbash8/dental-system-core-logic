'use client'

import Image from 'next/image'
import Link from "next/link"
import { motion } from "framer-motion"

function StayContact() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="flex mb-4 gap-2 items-center">
              <p className="text-md text-brand-500 font-bold uppercase">
                عيادة مدى السنية
              </p>
              <Image
                src='/images/mada_icon.svg'
                width={30}
                height={30}
                alt="mada"
              />
            </span>

            <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
              راقب بياناتك الطبية بسهولة
            </h1>
            <p className="text-gray-600 mb-4">
              يمكنك الآن متابعة بياناتك وتفاصيل رحلتك العلاجية بكل سهولة عبر موقع مدى، فقط باستخدام الكود الخاص بك.
            </p>
            <p className="text-gray-600 mb-4">
              ستتمكن من الوصول إلى مواعيدك، تقاريرك الطبية، وخطط العلاج المخصصة لك في أي وقت ومن أي مكان.
            </p>
          </motion.div>

          {/* Banner box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mt-2"
          >
            <div
              className="text-white px-6 sm:px-10 py-12 rounded-2xl shadow-lg max-w-xl bg-cover bg-center relative"
              style={{ backgroundImage: `url('/images/background-gold.png')` }}
            >
              {/* Overlay content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-lg md:text-xl font-bold">
                  راقب تقدم علاجك وبياناتك الصحية من مكان واحد باستخدام كودك الخاص
                </h2>
                <p className="mt-2">
                  من خلال منصة "مدى"، يمكنك الدخول إلى ملفك الطبي ومعرفة كل جديد في خطة العلاج الخاصة بك،
                  دون الحاجة للاتصال أو الحضور شخصياً.
                </p>
              </motion.div>

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Link href="/login">
                  <div className="mt-4 bg-gray-900 text-white font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 hover:text-gray-900 transition text-center cursor-pointer">
                    تسجيل الدخول
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="rounded-xl overflow-hidden shadow-lg"
        >
          <Image
            src="/images/h2-single-img-2-600x614.webp"
            alt="Dentist"
            width={600}
            height={614}
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default StayContact
