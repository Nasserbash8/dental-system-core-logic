'use client'
import Container from "@/layout/viewsLayout/Container";
import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/button/PrimaryButton";

function AboutUs() {
  return (
    <Container>
      <section className="w-full px-4 ">
        {/* Mobile Image */}
        <div className="block lg:hidden mb-6">
          <img
            src="/images/bg_4.jpg.webp"
            alt="Dentist"
            className="w-full h-[300px] rounded-3xl object-cover"
          />
        </div>

        {/* Desktop background + content */}
        <div
          className="hidden lg:flex bg-cover bg-right rounded-3xl px-10 py-20 items-center justify-start"
          style={{ backgroundImage: "url('/images/bg_4.jpg.webp')" }}
        >
          <Fade direction="up" triggerOnce>
            <div className="bg-white rounded-2xl p-10 shadow-md w-full max-w-xl">
              <Fade delay={400} cascade damping={0.2} triggerOnce>
                <span className="flex mb-4 gap-2 items-center">
                  <p className="text-md text-brand-500 font-bold uppercase">
                    عيادة مدى السنية
                  </p>
                  <Image
                    src="/images/mada_icon.svg"
                    width={30}
                    height={30}
                    alt="mada"
                  />
                </span>
                <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
                  الطبيب طبيبين و الخبرة <br />
                  <span className="text-brand-900">خبرتين</span>
                </h1>
                <p className="text-gray-600 mb-6 text-base">
                  نحن نؤمن بأن التعاون بين الأطباء يصنع الفارق، وأن كل مريض
                  يستحق خطة علاج مبنية على معرفة جماعية وخبرة مزدوجة.
                </p>
              </Fade>

              <PrimaryButton href="https://wa.me/963959254408?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AD%D8%AC%D8%B2%20%D9%85%D9%88%D8%B9%D8%AF">
                احجز موعدك الآن
              </PrimaryButton>
            </div>
          </Fade>
        </div>

        {/* Mobile Content Box */}
        <div className="lg:hidden mb-5">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-md w-full">
            <Fade delay={400} cascade damping={0.2} triggerOnce>
              <span className="flex mb-4 gap-2 items-center">
                <p className="text-sm text-brand-500 font-bold uppercase mb-2">
                  عيادة مدى السنية
                </p>
                <Image
                  src="/images/mada_icon.svg"
                  width={30}
                  height={30}
                  alt="mada"
                />
              </span>
              <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 leading-tight">
                الطبيب طبيبين و الخبرة{" "}
                <span className="text-brand-900"> خبرتين </span>
              </h1>
              <p className="text-gray-600 mb-6 text-base">
                نحن نؤمن بأن التعاون بين الأطباء يصنع الفارق، وأن كل مريض يستحق
                خطة علاج مبنية على معرفة جماعية وخبرة مزدوجة.
              </p>
            </Fade>

            <PrimaryButton href="https://wa.me/963959254408?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AD%D8%AC%D8%B2%20%D9%85%D9%88%D8%B9%D8%AF">
              احجز موعدك الآن
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Left Side - Text Content */}
          <div className="bg-gray-50 rounded-[2rem] p-10 flex flex-col justify-between">
            <Fade cascade damping={0.2} triggerOnce>
              <span className="flex mb-4 gap-2 items-center">
                <p className="text-md text-brand-500 font-bold uppercase">
                  عيادة مدى السنية
                </p>
                <Image
                  src="/images/mada_icon.svg"
                  width={30}
                  height={30}
                  alt="mada"
                />
              </span>
              <h2 className="text-4xl font-semibold text-gray-900 mb-6">
                هل تبحث عن عيادة اسنان مريحة ؟
              </h2>

              <p className="text-gray-600 mb-6">
                تُعد عيادتنا واحدة من العيادات الرائدة في مجال طب الأسنان، حيث
                نحرص على تقديم أعلى مستويات الرعاية الصحية باستخدام أحدث
                التقنيات والأجهزة الطبية المتطورة.
              </p>

              <p className="text-gray-600 mb-6">
                نؤمن بأن الابتسامة الجميلة تبدأ من العناية الشاملة، ولهذا نوفر
                لك تجربة علاجية مريحة وآمنة، بإشراف نخبة من أطباء الأسنان
                المتخصصين وذوي الخبرة الطويلة في هذا المجال.
              </p>
            </Fade>

            <PrimaryButton href="https://wa.me/963959254408?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AD%D8%AC%D8%B2%20%D9%85%D9%88%D8%B9%D8%AF">
              احجز موعدك الآن
            </PrimaryButton>
          </div>

          {/* Right Side - Image */}
          <Fade direction="up" duration={300} triggerOnce>
            <div className="relative h-full">
              <img
                src="/images/clinc.jpeg"
                alt="Dental Office"
                className="rounded-[2rem] w-full h-full object-cover object-left"
              />
            </div>
          </Fade>
        </div>
      </section>

      {/* Section 3 - Services */}
      <section className="py-10 bg-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <Fade cascade damping={0.2} triggerOnce>
            <span className="flex mb-4 gap-2 items-center justify-center">
              <p className="text-md text-brand-500 font-bold uppercase">
                خدماتنا
              </p>
              <Image
                src="/images/mada_icon.svg"
                width={30}
                height={30}
                alt="mada"
              />
            </span>
            <h2 className="text-4xl sm:text-5xl text-gray-900 font-bold mb-12">
              استكشف خدماتنا
            </h2>
          </Fade>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {[
              {
                icon: "/images/tooth-xray-spot.svg",
                title: "نظافة الأسنان",
                desc: "جلسات تنظيف احترافية للحفاظ على صحة فمك وأسنانك.",
              },
              {
                icon: "/images/tooth-xray-1.svg",
                title: "تركيب التيجان والقشور والجسور",
                desc: "جلسات تنظيف احترافية للحفاظ على صحة فمك وأسنانك.",
              },
              {
                icon: "/images/vineer-1.svg",
                title: "فحوصات الأسنان",
                desc: "جلسات تنظيف احترافية للحفاظ على صحة فمك وأسنانك.",
              },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                className="flex flex-col bg-gradint-color items-center rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="w-20 h-20 mb-4 rounded-full bg-gray-50 flex items-center justify-center text-brand-900">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={60}
                    height={60}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <span className="text-brand-900 text-lg">→</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Container>
  );
}

export default AboutUs;
