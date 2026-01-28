import dynamic from "next/dynamic";
// 1. استيراد الموديل واتصال القاعدة
import dbConnect from '@/utils/dbConnect';
import Patient from "@/models/patients"; 

const PageBreadcrumb = dynamic(()=> import('@/components/common/PageBreadCrumb'))
const DownloadExcelButton = dynamic(()=> import('@/components/ui/excelButton/page'))
const Treatments = dynamic(()=> import('@/components/user-profile/treatments'))
const UserInfoCard = dynamic(()=> import('@/components/user-profile/UserInfoCard'))
const UserMetaCard = dynamic(()=> import('@/components/user-profile/UserMetaCard'))
const UserImages = dynamic(()=> import('@/components/user-profile/UserImages'))

interface Params {
  patientId: string;
}

export default async function Profile({ params }: { params: Promise<Params> }) {
  const { patientId } = await params;

  // 2. الاتصال المباشر بالقاعدة بدلاً من fetch
  await dbConnect();
  
  // 3. جلب المريض مباشرة باستخدام الـ ID
  const patientData = await Patient.findOne({ patientId: patientId }).lean();

  if (!patientData) {
    return <div>لم يتم العثور على المريض</div>;
  }

  // تحويل البيانات لـ JSON بسيط لضمان التوافق مع مكونات السيرفر
  const patient = JSON.parse(JSON.stringify(patientData));

  return (
    <div>
      <PageBreadcrumb pageTitle="البروفايل" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mt-6 flex justify-end">
          <DownloadExcelButton patient={patient} />
        </div>
        <div className="space-y-6">
          <UserMetaCard patient={patient} />
          <UserInfoCard patient={patient} />
          <UserImages patient={patient}/>
          <Treatments patient={patient} />
        </div>
      </div>
    </div>
  );
}