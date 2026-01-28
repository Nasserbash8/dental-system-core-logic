import GridShape from "@/components/common/GridShape";
import React from "react";

export default function NotFound() {
  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center px-4">
        <GridShape/>  
      <img
        src="/images/Unhealthy-Tooth.svg"
        alt="Sad Tooth"
        className="w-64 h-64 mb-6"
      />
  <h1   className="  text-gray-900 px-6  text-[90px] font-bold transition">
        404
    </h1>
      <h1 className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-2">الصفحة غير موجودة</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        يبدو أنك تحاول الوصول إلى صفحة غير موجودة في تطبيق العيادة.
      </p>
      
      <a
        href="/"
        className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl transition"
      >
        العودة إلى الصفحة الرئيسية
      </a>
    </div>
  );
}
