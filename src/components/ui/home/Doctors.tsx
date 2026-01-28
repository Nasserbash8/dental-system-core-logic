'use client'
import dynamic from 'next/dynamic';
import Image from "next/image";
import { motion } from 'framer-motion';

const TeamCard = dynamic(() => import('@/components/ui/cards/teamCard'));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.2,
    },
  }),
};

function Doctors() {
  return (
    <div className="bg-[url('/images/background.png')] px-6 py-10 text-center">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <span className="flex mb-4 gap-2 items-center justify-center">
          <p className="text-md text-brand-500 font-bold uppercase">أطبائنا</p>
          <Image
            src="/images/mada_icon.svg"
            width={30}
            height={30}
            alt="mada"
          />
        </span>
        <h2 className="text-4xl sm:text-5xl text-gray-900 font-bold mb-3">
          استكشف أطبائنا
        </h2>
        <h5 className="text-lg text-gray-600 mb-4">
          يتمتع أطبائنا بخبرة مهنية عالية على مدى سنوات عديدة
        </h5>
      </motion.div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2 sm:px-10 mx-auto max-w-4xl">
        {[ 
          {
            name: "د.فخرية ابراهيم بش",
            title: "بورد سوري في جراحة اللثة وزرع الاسنان",
            imageUrl: "/images/fakria.webp",
            phone: "https://wa.me/963959254408?text=أرغب%20في%20حجز%20موعد",
            facebook: "https://www.facebook.com/fakhria.bash",
          },
          {
            name: "د.محمد شاهين ياسر العبو",
            title: "دكتور في طب الاسنان وجراحتها",
            imageUrl: "/images/shahin.webp",
            phone: "https://wa.me/963959821307?text=أرغب%20في%20حجز%20موعد",
            facebook: "https://www.facebook.com/drshahin.alabow",
          },
        ].map((doctor, i) => (
          <motion.div
            key={doctor.name}
            custom={i + 1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full"
          >
            <TeamCard {...doctor} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Doctors;
