'use client'
import { motion } from "framer-motion";
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

const MotionImage = motion(Image);

function WhyMada() {
  return (
    <section className="bg-white pt-16 pb-5 rtl text-right">
      <div className="mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* صورة متحركة */}
        <div className="rounded-xl">
          <MotionImage
            src="/images/about-us-img-3.webp" // استخدم WebP
            alt="Dental Care"
            width={400}
            height={600}
            className="object-cover w-full h-auto rounded-xl"
            animate={{
              y: [0, -20, 0],
              transition: {
                duration: 10,
                repeat: Infinity,
                repeatType: 'reverse',
              },
            }}
          />
        </div>

        {/* النصوص */}
        <div className="mt-5">
          <span className="flex mb-2 gap-2 items-center">
            <p className="text-sm text-brand-500 font-bold uppercase">العناية بالأسنان</p>
            <Image
              src="/images/mada_icon.svg"
              width={30}
              height={30}
              alt="mada"
            />
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            لماذا تختار عيادة مدى السنية ؟
          </h2>

          {/* قائمة مميزات */}
          <ul className="space-y-4 p-4 mb-5">
            <li className="flex gap-4 items-start">
              <CheckCircle className="w-6 h-6 text-brand-600" />
              <p className="text-gray-600 text-sm">
                نخبة من الأطباء ذوي الخبرة العالية في جميع تخصصات طب الأسنان.
              </p>
            </li>
            <li className="flex gap-4 items-start">
              <CheckCircle className="w-6 h-6 text-brand-600" />
              <p className="text-gray-600 text-sm">
                نعتمد على تقنيات متطورة وأجهزة حديثة لضمان رعاية مثالية.
              </p>
            </li>
            <li className="flex gap-4 items-start">
              <CheckCircle className="w-6 h-6 text-brand-600" />
              <p className="text-gray-600 text-sm">
                نهتم بأعلى معايير النظافة والتعقيم لراحة وسلامة مرضانا.
              </p>
            </li>
          </ul>

          {/* صورة ثانية متحركة */}
          <MotionImage
            src="/images/h1-img-1.webp"
            alt="Dental Care"
            width={400}
            height={500}
            className="object-cover w-full h-auto rounded-3xl"
            animate={{
              y: [0, -20, 0],
              transition: {
                duration: 10,
                repeat: Infinity,
                repeatType: 'reverse',
              },
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default WhyMada;
