'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. إذا كانت الصفحة محملة مسبقاً (Refresh)
    if (document.readyState === 'complete') {
      setLoading(false);
    } else {
      // 2. انتظر حتى يتم تحميل كل الصور والموارد
      const handleLoad = () => {
        // نضع تأخير بسيط (اختياري) لضمان نعومة الحركة
        setTimeout(() => setLoading(false), 500);
      };

      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="relative w-20 h-20">
        {/* حلقة الدوران */}
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-gray-200 border-t-[#d3ab49]" />
        {/* اللوجو في المنتصف */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image 
            height={80} 
            width={80} 
            src='/images/mada_icon.svg' 
            alt="Logo" 
            className="w-12 h-12" 
            priority // ضروري جداً لكي يظهر اللوجو نفسه فوراً
          />
        </div>
      </div>
    </div>
  );
}