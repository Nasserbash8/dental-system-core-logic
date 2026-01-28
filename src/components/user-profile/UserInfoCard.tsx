"use client";

import { useState } from "react";
import DatePicker from "../form/date-picker";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Edit2Icon, Plus } from "lucide-react";

const Modal = dynamic(() => import('../ui/modal'));

interface Illness {
  illness: string;
}

interface Medicine {
  medicine: string;
}

interface PatientType {
  patientId: string;

  illnesses: Illness[];
  info: string;
  Medicines: Medicine[];
  nextSessionDate: string;
}

type Props = {
  patient: PatientType;
};

export default function UserInfoCard({ patient }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("07:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdateInfoModalOpen, setIsUpdateInfoModalOpen] = useState(false);
  const [illnesses, setIllnesses] = useState(patient.illnesses.map(i => i.illness));
  const [medicines, setMedicines] = useState(patient.Medicines.map(m => m.medicine));
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  
  const handleSave = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      setIsSubmitting(true);

      // Combine date and time into ISO string
      const [hours, minutes] = selectedTime.split(":");
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(Number(hours));
      combinedDate.setMinutes(Number(minutes));
      combinedDate.setSeconds(0);
      combinedDate.setMilliseconds(0);

      const response = await fetch(`/api/patients/${patient.patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nextSessionDate: combinedDate.toISOString(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        alert("فشل التحديث: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء التحديث.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleUpdateIllnessesAndMedicines = async () => {
    try {
      setIsUpdatingInfo(true);
  
      const response = await fetch(`/api/patients/${patient.patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          illnesses: illnesses.filter(i => i.trim() !== "").map(i => ({ illness: i })),
          Medicines: medicines.filter(m => m.trim() !== "").map(m => ({ medicine: m })),
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        setIsUpdateInfoModalOpen(false);
        router.refresh();
      } else {
        alert("فشل التحديث: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء التحديث.");
    } finally {
      setIsUpdatingInfo(false);
    }
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          معلومات عن المريض
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <p className="mb-2 text-md font-bold text-black-500 dark:text-gray-400 mt-5">
              الأمراض
            </p>
            {patient.illnesses.length === 0 ? (
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">لا يوجد</p>
            ) : (
              patient.illnesses.map((illness, index) => (
                <p key={index} className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {illness.illness}
                </p>
              ))
            )}
          </div>

          <div>
            <p className="mb-2 text-md font-bold text-black-500 dark:text-gray-400 mt-5">
              الأدوية
            </p>
            {patient.Medicines.length === 0 ? (
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">لا يوجد</p>
            ) : (
              patient.Medicines.map((med, index) => (
                <p key={index} className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {med.medicine}
                </p>
              ))
            )}

            
          </div>
        
  
          <div>
            <p className="mb-2 text-md font-bold text-black-500 dark:text-gray-400 mt-5">
              معلومات اخرى
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {patient.info || "لا يوجد"}
            </p>
          </div>

        <div>
        <Button className=" text-xs p-2 mt-5 items-center text-white bg-brand-600 rounded hover:bg-gray-700" onClick={() => setIsUpdateInfoModalOpen(true)} >
           
           <Edit2Icon className="w-4 h-4" />
           تعديل
         </Button>
        </div>
        

          <div>
            <p className="mb-2 text-md font-bold text-black-500 dark:text-gray-400 mt-5">
              موعد الجلسة القادمة
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {patient.nextSessionDate
                ? new Date(patient.nextSessionDate).toLocaleString("ar-EG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                : "لم يتم التحديد"}
            </p>


            <button
              onClick={() => setIsModalOpen(true)}
              className="flex text-sm items-center  gap-2 px-4 py-2 mt-5 text-white bg-brand-600 rounded hover:bg-gray-700"
            >
              <Plus className="w-4 h-4" />
              إضافة موعد جديد
            </button>


          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isFullscreen>
          <div className="p-6">
            <h4 className="text-xl font-semibold mb-4">إضافة موعد جديد</h4>

            <div className="mb-4">
              <DatePicker
                id="next-session-date"
                label="تاريخ الجلسة القادمة"
                placeholder="حدد التاريخ"
                value={selectedDate ? [new Date(selectedDate)] : []}
                onChange={(dates: Date[]) => {
                    if (dates.length > 0) {
                      const localDateStr = dates[0].toLocaleDateString('en-CA');
                      setSelectedDate(localDateStr);
                    } else {
                      setSelectedDate("")
                    }
                }}
              />
            </div>

            <div className="mb-4">
              <Label>الوقت</Label>
              <input
                type="time"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTime}
                min="07:00"
                max="23:00"
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              <Button variant="outline" className="bg-brand-900" onClick={() => setIsModalOpen(false)}>
                إلغاء
              </Button>
              <Button
                disabled={!selectedDate || !selectedTime || isSubmitting}
                onClick={handleSave}
              >
                {isSubmitting ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isUpdateInfoModalOpen} onClose={() => setIsUpdateInfoModalOpen(false)} isFullscreen>
  <div className="p-6">
    <h4 className="text-xl font-semibold mb-4">تعديل الأمراض والأدوية</h4>

    <div className="mb-4">
      <Label>الأمراض</Label>
      {illnesses.map((ill, index) => (
        <input
          key={index}
          type="text"
          className="w-full mb-2 border rounded-lg px-3 py-2"
          value={ill}
          onChange={(e) => {
            const updated = [...illnesses];
            updated[index] = e.target.value;
            setIllnesses(updated);
          }}
        />
      ))}
      <Button onClick={() => setIllnesses([...illnesses, ""])} className="mt-2">إضافة مرض</Button>
    </div>

    <div className="mb-4">
      <Label>الأدوية</Label>
      {medicines.map((med, index) => (
        <input
          key={index}
          type="text"
          className="w-full mb-2 border rounded-lg px-3 py-2"
          value={med}
          onChange={(e) => {
            const updated = [...medicines];
            updated[index] = e.target.value;
            setMedicines(updated);
          }}
        />
      ))}
      <Button onClick={() => setMedicines([...medicines, ""])} className="mt-2">إضافة دواء</Button>
    </div>

    <div className="flex justify-end mt-6 space-x-2">
      <Button variant="outline" className="bg-brand-900" onClick={() => setIsUpdateInfoModalOpen(false)}>
        إلغاء
      </Button>
      <Button
        disabled={isUpdatingInfo}
        onClick={handleUpdateIllnessesAndMedicines}
      >
        {isUpdatingInfo ? "جاري الحفظ..." : "حفظ"}
      </Button>
    </div>
  </div>
</Modal>
      </div>
    </div>
  );
}
