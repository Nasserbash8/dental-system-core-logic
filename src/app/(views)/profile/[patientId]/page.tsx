import Container from '@/layout/viewsLayout/Container';
import dynamic from 'next/dynamic';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from '@/utils/authOptions';

import dbConnect from '@/utils/dbConnect';
import Patient from "@/models/patients"; 

const PatientTabs = dynamic(() => import("@/components/user-profile/PatientTabs"));

interface params {
  patientId: string;
}

export default async function MyAccount({ params }: any) {
  const session = await getServerSession(authOptions);
  const resolvedParams = await params;
  const { patientId } = resolvedParams;

  // 1. التحقق من الجلسة
  if (!session) {
    redirect("/login");
  }

  // 2. التحقق من الصلاحية (بفرض أن المعرف في الجلسة هو patientId أو id)
  if (session.user.id !== patientId) {
    redirect(`/profile/${session.user.id}`);
  }

  // 3. الاتصال المباشر بالقاعدة بدلاً من fetch
  let patient = null;
  try {
    await dbConnect();
    
    // البحث باستخدام الحقل المخصص patientId كما فعلنا سابقاً
    const patientData = await Patient.findOne({ patientId: patientId }).lean();

    if (!patientData) {
      console.error('Patient not found in database');
      redirect('/signOut');
    }

    // تحويل البيانات لـ JSON بسيط
    patient = JSON.parse(JSON.stringify(patientData));
    
  } catch (error) {
    console.error('Database connection error:', error);
    redirect('/signOut');
  }

  return (
    <Container>
      <PatientTabs patient={patient} />
    </Container>
  );
}