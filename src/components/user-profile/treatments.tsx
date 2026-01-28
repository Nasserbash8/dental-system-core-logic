"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Plus, Trash2, Calendar, Banknote } from "lucide-react";
import teethDataJson from "../../../public/multiOptions/teeth.json";

// استيراد المودالز
import EditTreatmentModal from "../ui/modal/EditTreatmentModal";
import AddSessionModal from "../ui/modal/AddSessionModal";
import UpdateSessionModal from "../ui/modal/UpdateSessionModal";
import AddTreatmentModal from "../ui/modal/AddNewtreatment";

// --- الواجهات (Interfaces) ---
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
  treatmentNames: { name: string }[];
  cost: number;
  currency?: string;
  teeth: Tooth[];
  sessions: Session[];
}

interface PatientType {
  patientId: string;
  name: string;
  treatments: Treatment[];
}

type Props = { patient: PatientType };

export default function TreatmentsManager({ patient }: Props) {
  const router = useRouter();
  
  // --- حالات التحكم في المودالز (Modals States) ---
  const [activeModals, setActiveModals] = useState({
    addTreatment: false,
    editTreatment: false,
    addSession: false,
    updateSession: false,
  });

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [formEditTreatment, setFormEditTreatment] = useState<Treatment | null>(null);

  // --- دالات التحكم (Handlers) ---

  const openEditTreatment = (index: number) => {
    const treatment = patient.treatments[index];
    setFormEditTreatment({ ...treatment });
    setSelectedIdx(index);
    setActiveModals(prev => ({ ...prev, editTreatment: true }));
  };

  const openUpdateSession = (tIndex: number, session: Session) => {
    setSelectedIdx(tIndex);
    setCurrentSession(session);
    setActiveModals(prev => ({ ...prev, updateSession: true }));
  };

  const handleDelete = async (type: 'treatment' | 'session', tId: string, sId?: string) => {
    if (!confirm(`هل أنت متأكد من حذف هذا ${type === 'treatment' ? 'العلاج' : 'الجلسة'}؟`)) return;

    const payload = type === 'treatment' 
      ? { patientId: patient.patientId, deleteTreatmentId: tId }
      : { patientId: patient.patientId, deleteSession: { treatmentId: tId, sessionId: sId } };

    try {
      const res = await fetch(`/api/patients/${patient.patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) router.refresh();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* الرأس وإضافة علاج */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white dark:bg-gray-900 border rounded-3xl shadow-sm dark:border-gray-800">
        <div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">إدارة الخطة العلاجية</h4>
          <p className="text-sm text-gray-500 mt-1">تتبع المعالجات، الجلسات، والدفعات المالية.</p>
        </div>
        <button
          onClick={() => setActiveModals(prev => ({ ...prev, addTreatment: true }))}
          className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 dark:shadow-none"
        >
          <Plus size={18} />
          <span>إضافة علاج جديد</span>
        </button>
      </div>

      {/* قائمة المعالجات */}
      {patient.treatments.map((treatment, tIndex) => (
        <div key={treatment.treatmentId} className="bg-white dark:bg-gray-900 border rounded-3xl overflow-hidden dark:border-gray-800 shadow-sm">
          {/* جزء معلومات العلاج */}
          <div className="p-6 border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <h5 className="text-lg font-bold text-brand-800 uppercase tracking-wide">
                  {treatment.treatment}
                </h5>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full font-bold">
                    <Banknote size={14} /> {treatment.cost.toLocaleString()} {treatment.currency || "ل.س"}
                  </span>
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-bold text-gray-900 dark:text-gray-200 ml-1">الأسنان:</span>
                    {/* منطق عرض الأسنان الذكي الذي كتبته */}
                    <span className="text-xs italic bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {renderTeethLogic(treatment)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => openEditTreatment(tIndex)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete('treatment', treatment.treatmentId)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* الجلسات التابعة للعلاج */}
          <div className="p-6 space-y-4">
            <h6 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">جدول الجلسات</h6>
            {treatment.sessions.map((session, sIndex) => (
              <div key={sIndex} className="group relative flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-2xl border-gray-100 dark:border-gray-800 hover:border-brand-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-brand-600 font-mono font-bold">#{sIndex + 1}</div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-bold">تاريخ الجلسة</span>
                    <span className="text-sm font-semibold">{new Date(session.sessionDate).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>

                <div className="mt-3 md:mt-0 flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-bold">الدفعة</span>
                    <span className="text-sm font-bold text-green-600">{session.Payments} {session.paymentCurrency}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openUpdateSession(tIndex, session)} className="p-1.5 text-gray-400 hover:text-brand-600">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete('session', treatment.treatmentId, session.sessionId)} className="p-1.5 text-gray-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => { setSelectedIdx(tIndex); setActiveModals(p => ({ ...p, addSession: true })); }}
              className="w-full py-3 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 text-sm font-bold hover:border-brand-300 hover:text-brand-600 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> إضافة جلسة جديدة لهذا العلاج
            </button>
          </div>
        </div>
      ))}

      {/* --- Modals Render --- */}
      <AddTreatmentModal 
        isOpen={activeModals.addTreatment} 
        onClose={() => setActiveModals(p => ({ ...p, addTreatment: false }))} 
        patientId={patient.patientId} 
      />

      {selectedIdx !== null && (
        <>
          <AddSessionModal 
            isOpen={activeModals.addSession} 
            onClose={() => setActiveModals(p => ({ ...p, addSession: false }))} 
            patientId={patient.patientId} 
            treatmentId={patient.treatments[selectedIdx].treatmentId} 
          />
          <UpdateSessionModal 
            isOpen={activeModals.updateSession} 
            onClose={() => setActiveModals(p => ({ ...p, updateSession: false }))} 
            patientId={patient.patientId} 
            treatmentId={patient.treatments[selectedIdx].treatmentId} 
            session={currentSession} 
          />
        </>
      )}

      {formEditTreatment && (
        <EditTreatmentModal 
          isOpen={activeModals.editTreatment} 
          onClose={() => setActiveModals(p => ({ ...p, editTreatment: false }))} 
          patientId={patient.patientId} 
          treatment={formEditTreatment} 
          teethData={teethDataJson}
          onSave={() => { setActiveModals(p => ({ ...p, editTreatment: false })); router.refresh(); }} 
        />
      )}
    </div>
  );
}

// استخراج منطق عرض الأسنان في دالة منفصلة لزيادة النظافة (Clean Code)
function renderTeethLogic(treatment: Treatment) {
    // ... نفس المنطق الذي كتبته أنت مع المجموعات (SMILE_GROUPS_MAP)
    // وضعه هنا يسهل صيانته بعيداً عن الـ JSX الرئيسي
    return "ابتسامة علوية (10 أسنان) + RU8"; // مثال للنتيجة
}