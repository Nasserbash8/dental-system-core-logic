'use client'
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TextAnimation from '../textAnimation';

const buttonVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.2 },
  }),
};

function HeroSection() {
  return (
    <section className="relative h-[70vh] sm:h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.webp"
          alt="Dental background"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL="/images/hero-small.webp"
          className="object-cover object-left"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-30 z-10" />

      {/* Content */}
     <div className="relative z-20 flex items-center justify-center lg:justify-start h-full px-4">
  <div className="flex flex-col items-center lg:items-start max-w-3xl w-full text-white rtl">

    {/* H1 - تم تحسين الحجم والهوامش */}
    <h1 className="text-[32px] sm:text-6xl lg:text-5xl font-bold leading-[1.2] text-center lg:text-start mb-4 max-w-[15ch] sm:max-w-none">
      ابتسامتك تبدأ من هنا
    </h1>

    {/* الوصف - تم تحسين تباعد الأسطر والعرض */}
    <div className="text-center lg:text-start mb-8 max-w-[320px] sm:max-w-xl">
      <TextAnimation>
        <p className="text-sm sm:text-lg opacity-90 leading-relaxed font-light">
          مرحبًا بكم في عيادة مدى لطب الأسنان، حيث نمنحك رعاية استثنائية وابتسامة مشرقة.
        </p>
      </TextAnimation>
    </div>

    {/* الأزرار - متناسقة تماماً الآن */}
    <div className="flex flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start items-stretch">
      <motion.div
        custom={1}
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 sm:flex-none"
      >
        <Link
          href="https://wa.me/963959254408?text=أرغب%20في%20حجز%20موعد"
          className="bg-gray-900 text-white w-full h-full flex items-center justify-center px-4 py-3.5 rounded-xl text-[11px] sm:text-sm font-bold hover:bg-white transition hover:text-gray-900 border border-gray-900 shadow-lg"
        >
          احجز موعدك الآن
        </Link>
      </motion.div>

      <motion.div
        custom={1}
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 sm:flex-none"
      >
        <Link
          href="/about-us"
          className="text-white border border-white/80 backdrop-blur-sm w-full h-full flex items-center justify-center px-4 py-3.5 rounded-xl text-[11px] sm:text-sm font-bold hover:bg-white hover:text-brand-900 transition"
        >
          تعرف علينا
        </Link>
      </motion.div>
    </div>

  </div>
</div>
    </section>
  );
}

export default HeroSection;
