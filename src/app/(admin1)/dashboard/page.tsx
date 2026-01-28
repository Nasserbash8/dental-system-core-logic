// app/dashboard/ecommerce/page.tsx

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import nextDynamic from "next/dynamic";

// 1. استورد ملف الاتصال بقاعدة البيانات والموديل مباشرة
import dbConnect from '@/utils/dbConnect';
import Patient from "@/models/patients"; // تأكد من اسم الموديل ومساره

export const dynamic = 'force-dynamic';

const MonthlyTarget = nextDynamic(() => import('@/components/ecommerce/MonthlyTarget'));
const MonthlySalesChart = nextDynamic(() => import('@/components/ecommerce/MonthlySalesChart'));
const StatisticsChart = nextDynamic(() => import('@/components/ecommerce/StatisticsChart'));
const RecentOrders = nextDynamic(() => import('@/components/ecommerce/RecentOrders'));

export default async function Ecommerce() {
  let patients = [];
  let totalPatients = 0;

  try {
    // 2. اتصل بالقاعدة مباشرة بدلاً من الـ Fetch
    await dbConnect();
    
    // 3. اجلب البيانات مباشرة من MongoDB
    const patientsData = await Patient.find({}).sort({ createdAt: -1 }).lean();
    
    // تحويل البيانات لـ JSON بسيط لضمان عدم وجود مشاكل في الـ Object IDs الخاصة بـ MongoDB
    patients = JSON.parse(JSON.stringify(patientsData));
    totalPatients = patients.length;

  } catch (err) {
    console.error('Database Error:', err);
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        {/* البيانات ستصل هنا فوراً وبسرعة البرق */}
        <EcommerceMetrics patients={patients} totalPatients={totalPatients}/>
        <MonthlySalesChart />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>
      <div className="col-span-12">
        <StatisticsChart />
      </div>
      <div className="col-span-12">
        <RecentOrders patients={patients} />
      </div>
    </div>
  );
}