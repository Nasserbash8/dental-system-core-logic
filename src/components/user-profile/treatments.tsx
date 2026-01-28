  "use client";

  import React, { useState } from "react";
  import teeth from "../../../public/multiOptions/teeth.json";
  import { useRouter } from "next/navigation";
  import { Edit, Plus , Delete } from "lucide-react";
import EditTreatmentModal from "../ui/modal/EditTreatmentModal";
import AddSessionModal from "../ui/modal/AddSessionModal";
import UpdateSessionModal from "../ui/modal/UpdateSessionModal";
import AddTreatmentModal from "../ui/modal/AddNewtreatment";
  interface Session {
    sessionId: string;
    sessionDate: Date;
    Payments: string;
    paymentCurrency?: string;
    PaymentsDate: Date;
  }
  interface Tooth {
    id: string;
    value: string;
    customTreatment?: string;
  }
  interface Treatment {
    treatmentId: string;
    treatment: string;
    treatmentNames: { name: string }[];  // Added field for treatment names
    cost: number;
    currency?: string;
    teeth: Tooth[];
    sessions: Session[];
  }

  interface PatientType {
    patientId: string;
    name: string;
    age: number;
    phone: string;
    work: string;
    info: string;
    treatments: Treatment[];
  }

  type Props = {
    patient: PatientType;
  };

  export default function Treatments({ patient }: Props) {
      const router = useRouter();
    const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [selectedTreatmentIndex, setSelectedTreatmentIndex] = useState<number | null>(null);
  const [isUpdateSessionModalOpen, setIsUpdateSessionModalOpen] = useState(false);
  const [updateTreatmentIndex, setUpdateTreatmentIndex] = useState<number | null>(null);
  const [isEditTreatmentModalOpen, setIsEditTreatmentModalOpen] = useState(false);
  const [editTreatmentIndex, setEditTreatmentIndex] = useState<number | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [formEditTreatment, setFormEditTreatment] = useState<Treatment>({
    treatmentId: "",
    treatment: "",
    treatmentNames: [],
    cost: 0,
    teeth: [],
    sessions: [],
  });

const openUpdateSessionModal = (tIndex: number, session: Session) => {
  setUpdateTreatmentIndex(tIndex);
  setSelectedTreatmentIndex(tIndex); // ✅ أضف هذا السطر
  setCurrentSession(session);
  setIsUpdateSessionModalOpen(true);
};

 

  const openEditTreatmentModal = (index: number) => {
  const treatment = patient.treatments[index];

  // أولاً عبّئ البيانات
  setFormEditTreatment({
    treatmentId: treatment.treatmentId,
    treatment: treatment.treatment,
    treatmentNames: treatment.treatmentNames,
    cost: treatment.cost,
    teeth: treatment.teeth.map(t => ({
      id: t.id,
      value: t.value,
      customTreatment: t.customTreatment || "",
    })),
    sessions: treatment.sessions,
  });

  // ثم افتح المودال بعد تأخير بسيط لضمان أن القيم وصلت
  setTimeout(() => {
    setIsEditTreatmentModalOpen(true);
    setEditTreatmentIndex(index);
  }, 50);
};

const handleDeleteTreatment = async (treatmentId: string) => {
  try {
    const res = await fetch(`/api/patients/${patient.patientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: patient.patientId, deleteTreatmentId: treatmentId }),
    });

    if (res.ok) {
      // ✅ أعد ضبط المؤشرات قبل التحديث
      setSelectedTreatmentIndex(null);
      setEditTreatmentIndex(null);
      setUpdateTreatmentIndex(null);
      setIsUpdateSessionModalOpen(false);
      setIsEditTreatmentModalOpen(false);
      setCurrentSession(null);

      router.refresh();
    } else {
      console.error("فشل حذف العلاج");
    }
  } catch (err) {
    console.error("خطأ أثناء حذف العلاج", err);
  }
};


const handleDeleteSession = async (treatmentId: string, sessionId: string) => {
  try {
    const res = await fetch(`/api/patients/${patient.patientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: patient.patientId,
        deleteSession: { treatmentId, sessionId },
      }),
    });

    if (res.ok) {
      setCurrentSession(null);
      setUpdateTreatmentIndex(null);
      setIsUpdateSessionModalOpen(false);

      router.refresh();
    } else {
      console.error("فشل حذف الجلسة");
    }
  } catch (err) {
    console.error("خطأ أثناء حذف الجلسة", err);
  }
};


    return (
      <>
        <div className="p-5 border rounded-2xl dark:border-gray-800">
          <div className=" flex flex-col md:flex-row lg:justify-between lg:gap-6 gap-4 justify-between p-5">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">العلاج والجلسات</h4>
            <div className="">
              <button
                              onClick={() => setIsTreatmentModalOpen(true)}
                                className="flex text-sm items-center  gap-2 px-4 py-2 mt-5 text-white bg-brand-600 rounded hover:bg-gray-700"
                              > 
                                <Plus className="w-4 h-4"/>
                              إضافة علاج جديد
                                </button>

            </div>
          </div>

          {patient.treatments.map((treatment, tIndex) => (
            
            <div key={treatment.treatmentId} className="mb-6 p-4 border rounded-xl dark:border-gray-700">
              <div className="font-semibold text-gray-700 dark:text-white/90">{treatment.treatment}</div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="">
                  <p className="mb-2 text-lg text-black-500 font-bold dark:text-gray-400 mt-5">التكلفة: </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
    {treatment.cost} {treatment.currency || "ل.س"} {/* 👈 سيعرض العملة المخزنة أو ل.س كافتراضي */}
  </p>
                </div>

             <div className="">
  <p className="mb-2 text-lg text-black-500 font-bold dark:text-gray-400 mt-5">الأسنان: </p>
  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
    {(() => {
      const treatmentTeeth = treatment.teeth;
      const treatmentToothIds = treatmentTeeth.map(t => t.id);
      
      // تعريف مجموعات الابتسامة للمطابقة
      const SMILE_GROUPS_MAP: Record<string, { label: string, ids: string[] }> = {
        'U10': { label: 'ابتسامة علوية (10 أسنان)', ids: ["LU1", "LU2", "LU3", "LU4", "LU5", "RU1", "RU2", "RU3", "RU4", "RU5"] },
        'U8':  { label: 'ابتسامة علوية (8 أسنان)',  ids: ["LU1", "LU2", "LU3", "LU4", "RU1", "RU2", "RU3", "RU4"] },
        'U6':  { label: 'ابتسامة علوية (6 أسنان)',  ids: ["LU1", "LU2", "LU3", "RU1", "RU2", "RU3"] },
        'D10': { label: 'ابتسامة سفلية (10 أسنان)', ids: ["LD1", "LD2", "LD3", "LD4", "LD5", "RD1", "RD2", "RD3", "RD4", "RD5"] },
        'D8':  { label: 'ابتسامة سفلية (8 أسنان)',  ids: ["LD1", "LD2", "LD3", "LD4", "RD1", "RD2", "RD3", "RD4"] },
        'D6':  { label: 'ابتسامة سفلية (6 أسنان)',  ids: ["LD1", "LD2", "LD3", "RD1", "RD2", "RD3"] },
      };

      // تعريف الأرباع الكاملة للمطابقة
      const QUADRANTS_MAP: Record<string, { label: string, prefix: string }> = {
        'RUA': { label: 'علوي يمين كامل', prefix: 'RU' },
        'LUA': { label: 'علوي يسار كامل', prefix: 'LU' },
        'RDA': { label: 'سفلي يمين كامل', prefix: 'RD' },
        'LDA': { label: 'سفلي يسار كامل', prefix: 'LD' },
      };

      const displayElements: React.ReactNode[] = [];
      const coveredToothIds = new Set<string>();

      // 1. فحص الابتسامات أولاً (الأولوية للمجموعات الأكبر)
      Object.entries(SMILE_GROUPS_MAP).forEach(([key, group]) => {
        const isMatch = group.ids.every(id => treatmentToothIds.includes(id));
        if (isMatch) {
          // نتحقق أننا لم نغطِ هذه الأسنان بابتسامة أكبر (مثلاً U10 تغطي U8)
          const alreadyCovered = group.ids.every(id => coveredToothIds.has(id));
          if (!alreadyCovered) {
            displayElements.push(<span key={key} className="font-bold text-brand-700">{group.label}</span>);
            group.ids.forEach(id => coveredToothIds.add(id));
          }
        }
      });

      // 2. فحص الأرباع الكاملة (8 أسنان لكل ربع)
      Object.entries(QUADRANTS_MAP).forEach(([key, quad]) => {
        const quadTeeth = treatmentToothIds.filter(id => id.startsWith(quad.prefix));
        if (quadTeeth.length === 8) {
          displayElements.push(<span key={key} className="font-bold text-brand-700">{quad.label}</span>);
          quadTeeth.forEach(id => coveredToothIds.add(id));
        }
      });

      // 3. إضافة الأسنان المتبقية أو التي تحتوي على علاج مخصص (حتى لو كانت ضمن مجموعة)
      treatmentTeeth.forEach((tooth) => {
        const hasCustom = tooth.customTreatment && tooth.customTreatment.trim() !== "";
        
        // نظهر السن إذا لم يكن مغطى بابتسامة/ربع كامل، أو إذا كان لديه علاج مخصص
        if (!coveredToothIds.has(tooth.id) || hasCustom) {
          displayElements.push(
            <span key={tooth.id}>
              {coveredToothIds.has(tooth.id) ? `تعديل على ${tooth.value}` : tooth.value}
              {hasCustom && (
                <span className="text-brand-900 font-bold"> ({tooth.customTreatment})</span>
              )}
            </span>
          );
        }
      });

      // دمج العناصر وعرضها مع فواصل
      return displayElements.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {index < displayElements.length - 1 && " , "}
        </React.Fragment>
      ));
    })()}
  </p>
            </div>

                <div className="">
                  <p className="mb-2 text-lg text-black-500 font-bold dark:text-gray-400 mt-5">أسماء العلاج: </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90"> {treatment.treatmentNames.map((tn, index) => tn.name).join(" - ")}</p>
                </div>
              </div>

    <div className="md:flex gap-2">
          
       <button
                                onClick={() => openEditTreatmentModal(tIndex)}
                                className="flex text-sm items-center  gap-2 px-4 py-2 mt-5 text-white bg-brand-600 rounded hover:bg-gray-700"
                              > 
                                <Edit className="w-4 h-4"/>
                                تعديل العلاج
        </button>
         <button
                               onClick={() => handleDeleteTreatment(treatment.treatmentId)}
                                className="flex text-sm items-center  gap-2 px-4 py-2 mt-5 text-white bg-red-600 rounded hover:bg-gray-700"
                              > 
                                <Delete className="w-4 h-4"/>
                                حذف العلاج
        </button>
          </div>  
              {treatment.sessions.map((session, sIndex) => (
                <div key={sIndex} className=" pl-4 border-l border-brand-700 my-16">
                  <div className="md:flex justify-between items-center">
  <div className="font-semibold text-lg text-brand-700 dark:text-white/90">{sIndex + 1} - <strong>الجلسة</strong></div>

                  <div className="md:flex gap-2">
  <button
                                onClick={() => openUpdateSessionModal(tIndex, session)}
                                className="flex text-sm items-center  gap-2 px-4 py-2 mt-5 text-white bg-brand-600 rounded hover:bg-gray-700"
                              > 
                                <Edit className="w-4 h-4"/>
                                تعديل الجلسة
                                </button>

                                         <button
                                onClick={() => handleDeleteSession(treatment.treatmentId, session.sessionId)}
                                className="flex text-sm items-center  gap-2 px-4 py-2 mt-5 text-white bg-red-600 rounded hover:bg-gray-700"
                              > 
                                <Delete className="w-4 h-4"/>
                                حذف الجلسة
        </button>
                  </div>
                          
                  </div>
                
                            
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="">
                      <p className="mb-2 text-lg text-black-500 font-bold dark:text-gray-400 mt-5">تاريخ الجلسة: </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{new Date(session.sessionDate).toLocaleDateString()}</p>
                    </div>

                    <div className="">
                      <p className="mb-2 text-lg text-black-500 font-bold dark:text-gray-400 mt-5">الدفعة : </p>
                     <p className="text-sm font-medium text-gray-800 dark:text-white/90">
    {session.Payments} {session.paymentCurrency || "ل.س"} {/* 👈 سيعرض عملة الدفعة المحددة في الجلسة */}
  </p>
                    </div>

                    <div className="">
                      <p className="mb-2 text-lg text-black-500 font-bold dark:text-gray-400 mt-5">تاريخ الدفعة: </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{new Date(session.PaymentsDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}

            

              <button
                                onClick={() => {
                  setSelectedTreatmentIndex(tIndex);
                  setIsSessionModalOpen(true);
                }}
                                className="flex text-sm items-center  gap-2 px-4 py-2 mt-5 text-white bg-brand-600 rounded hover:bg-gray-700"
                              > 
                                <Plus className="w-4 h-4"/>
                            إضافة جلسة
                                </button>

            </div>
          ))}
        </div>

        {/* Add new Treatment Modal */}
      
        {isTreatmentModalOpen && (
  <AddTreatmentModal
  isOpen={isTreatmentModalOpen}
  onClose={() => setIsTreatmentModalOpen(false)}
  patientId={patient.patientId}
/>
)}

        {/* Add new Session Modal */}
        {selectedTreatmentIndex !== null && (
         <AddSessionModal
          isOpen={isSessionModalOpen}
          onClose={() => setIsSessionModalOpen(false)}
          patientId={patient.patientId}
          treatmentId={patient.treatments[selectedTreatmentIndex].treatmentId}
        />)}
      {/* update Session Modal */}
       {selectedTreatmentIndex !== null && patient.treatments[selectedTreatmentIndex] && (
  <UpdateSessionModal
    isOpen={isUpdateSessionModalOpen}
    onClose={() => setIsUpdateSessionModalOpen(false)}
    patientId={patient.patientId}
    treatmentId={patient.treatments[selectedTreatmentIndex].treatmentId}
    session={currentSession}
  />
)}


           {/* update Treatment Modal */}
          <EditTreatmentModal
        isOpen={isEditTreatmentModalOpen}
        onClose={() => setIsEditTreatmentModalOpen(false)}
        patientId={patient.patientId}
        treatment={formEditTreatment}
        onSave={() => {
          setIsEditTreatmentModalOpen(false);
          router.refresh(); // or re-fetch patient data
        }}
        teethData={teeth}
      />

            </>
    );
  }