'use client'

import Image from 'next/image'

type DentalCardProps = {
  category: string
  title: string
  imageUrl: string
}

const DentalCard: React.FC<DentalCardProps> = ({ category, title, imageUrl }) => {
  return (
    /* الحل: أضفنا ارتفاعاً افتراضياً h-[350px] للموبايل، و sm:h-[450px] للشاشات الأكبر */
    <div className="relative group rounded-3xl overflow-hidden shadow-lg w-full h-[350px] sm:h-[450px] transition-transform duration-300 hover:-translate-y-2">
      
      {/* Optimized Image */}
      <Image
        src={imageUrl}
        alt={`${title} - ${category}`}
        fill
        priority // أضف هذه إذا كانت هذه الكروت تظهر في أول الصفحة لتحسين الأداء
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-scale duration-500 group-hover:scale-110"
      />

      {/* Hover Overlay - تم جعلها تظهر بشكل دائم خفيف في الموبايل لضمان قراءة النص */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Category (Top Right) */}
      <div className="absolute top-4 right-4 text-white z-10 text-end">
        <span className="text-[10px] sm:text-xs font-bold uppercase bg-brand-500/80 px-3 py-1 rounded-full backdrop-blur-sm">
          {category}
        </span>
      </div>

      {/* Title (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-10 text-white drop-shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold leading-tight">{title}</h2>
        {/* خط ديكوري صغير يظهر عند التحويم */}
        <div className="w-0 group-hover:w-full h-1 bg-brand-500 transition-all duration-300 rounded-full mt-1"></div>
      </div>
    </div>
  )
}

export default DentalCard