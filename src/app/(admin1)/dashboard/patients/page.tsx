// app/dashboard/patients/page.tsx
import dbConnect from '@/utils/dbConnect';
import Patient from "@/models/patients";
import nextDynamic from "next/dynamic";

const PageBreadcrumb = nextDynamic(() => import('@/components/common/PageBreadCrumb'));
const BasicTableOne = nextDynamic(() => import('@/components/tables/BasicTableOne'));

export const dynamic = 'force-dynamic';

export default async function Patients() {
  try {
    await dbConnect();

    // جلب كل المرضى بدون قيود (limit/skip)
    const allPatients = await Patient.find({}).sort({ createdAt: -1 }).lean();
    
    // تحويل البيانات لـ JSON بسيط
    const serializedPatients = JSON.parse(JSON.stringify(allPatients));

    return (
      <div>
        <PageBreadcrumb pageTitle="المرضى" />
        <div className="space-y-6">
          {/* نمرر المصفوفة كاملة للجدول */}
          <BasicTableOne tabledata={serializedPatients} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Database Error:", error);
    return <div>خطأ في الاتصال بالقاعدة</div>;
  }
}