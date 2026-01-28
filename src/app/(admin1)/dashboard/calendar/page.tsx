import nextDynamic from "next/dynamic";
// 1. استيراد الاتصال والموديلات مباشرة
import dbConnect from '@/utils/dbConnect';
import Patient from "@/models/patients"; 
import Appointment from "@/models/appointments"; // تأكد من اسم الموديل عندك

const CalendarWrapper = nextDynamic(() => import("@/components/calendar/calenderWrapper"));

export const dynamic = 'force-dynamic';

async function calendar() {
  let appointments = [];
  let patients = [];

  try {
    // 2. اتصال مباشر
    await dbConnect();

    // 3. جلب المواعيد والمرضى بالتوازي لزيادة السرعة
    const [appointmentsData, patientsData] = await Promise.all([
      Appointment.find({}).lean(),
      Patient.find({}).select('patientId name code').lean() // جلب الحقول الضرورية فقط لتحسين الأداء
    ]);

    appointments = JSON.parse(JSON.stringify(appointmentsData));
    patients = JSON.parse(JSON.stringify(patientsData));

  } catch (error) {
    console.error("Error fetching data directly:", error);
  }

  return (
    <div>
      <CalendarWrapper Appointment={appointments} patients={patients} />
    </div>
  );
}

export default calendar;