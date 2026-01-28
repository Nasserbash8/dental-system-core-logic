'use client'
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";

const DentalCard = dynamic(() => import('@/components/ui/cards/dentalCard'));

// Array للخدمات
const services = [
  { category: "رعاية خاصة", title: "جراحة الفم", imageUrl: "/images/service-1.webp" },
  { category: "رعاية خاصة", title: "زراعة الأسنان", imageUrl: "/images/service-2.webp" },
  { category: "رعاية خاصة", title: "تعزيز التبييض", imageUrl: "/images/service-3.webp" },
  { category: "رعاية خاصة", title: "طب أسنان الأطفال", imageUrl: "/images/service-4.webp" },
  { category: "رعاية خاصة", title: "العناية باللثة", imageUrl: "/images/service-5.webp" },
  { category: "رعاية خاصة", title: "طب الأسنان الطارئ", imageUrl: "/images/service-7.webp" },
];

function OurServices() {
  return (
    <section className="py-10 bg-white text-center">
      <div className="max-w-7xl mx-auto px-4">

        {/* العنوان الفرعي */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex mb-4 gap-2 items-center justify-center"
        >
          <p className="text-md text-brand-500 font-bold uppercase">خدماتنا</p>
          <Image
            src='/images/mada_icon.svg'
            width={30}
            height={30}
            alt="mada icon"
          />
        </motion.div>

        {/* العنوان الرئيسي */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl text-gray-900 font-bold mb-12"
        >
          استكشف خدماتنا
        </motion.h2>

        {/* قائمة الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <DentalCard {...service} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default OurServices;
