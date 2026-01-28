import Container from "@/layout/viewsLayout/Container";
import { ShieldCheck, Smile, Clock4, Users } from 'lucide-react';
import Loading from "../loading";
import HeroSection from "@/components/ui/home/HeroSection";
import dynamic from "next/dynamic";

const WhyMada = dynamic(() => import("@/components/ui/home/WhyMada"), {
  ssr: true,
  loading: () => <Loading />,
});

const Doctors = dynamic(() => import("@/components/ui/home/Doctors"), {
  ssr: true,
  loading: () => <Loading />,
});

const OurServices = dynamic(() => import("@/components/ui/home/OurServices"), {
  ssr: true,
  loading: () => <Loading />,
});

const StayContact = dynamic(() => import("@/components/ui/home/StayContact"), {
  ssr: true,
  loading: () => <Loading />,
});
const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-brand-900" />,
    title: 'خبرة موثوقة',
    description: 'فريق طبي بخبرة طويلة يقدم رعاية دقيقة وآمنة لجميع المرضى.',
  },
  {
    icon: <Smile className="w-8 h-8 text-brand-900" />,
    title: 'تقنيات حديثة',
    description: 'نستخدم أحدث الأجهزة والتقنيات لضمان أفضل النتائج.',
  },
  {
    icon: <Clock4 className="w-8 h-8 text-brand-900" />,
    title: 'مواعيد مرنة',
    description: 'نقدم أوقات عمل مرنة تناسب جدولك اليومي.',
  },
  {
    icon: <Users className="w-8 h-8 text-brand-900" />,
    title: 'رعاية مخصصة',
    description: 'نستمع لاحتياجاتك ونقدم خطة علاجية تناسبك تمامًا.',
  },
];

const services = [
  {
    title: 'طب الأسنان العائلي',
    description: 'نقدم رعاية شاملة لكافة أفراد العائلة باستخدام أحدث التقنيات.',
    icon: '/images/dentist-teeth-svgrepo-com.svg',
  },
  {
    title: 'زراعة الأسنان',
    description: 'حلول دائمة ومريحة لتعويض الأسنان المفقودة.',
    icon: '/images/dentist-teeth-svgrepo-com.svg',
  },
  {
    title: 'نظافة الأسنان',
    description: 'جلسات تنظيف احترافية للحفاظ على صحة فمك وأسنانك.',
    icon: '/images/dentist-teeth-svgrepo-com.svg',
  },
];

export default function Home() {
  return (
    <>
      <HeroSection/>
        <Container>

          
          <WhyMada/>

           <Doctors/>

         <OurServices/>

                       <StayContact/>

               
               
          
         </Container>
    </>

  )
}

