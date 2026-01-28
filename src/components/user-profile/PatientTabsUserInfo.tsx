'use client'

import { Phone, HeartPulse, IdCard, Calendar1, Pill, Briefcase } from 'lucide-react'

/**
 * @Data_Structuring
 * Domain-specific interfaces for the Medical Dashboard.
 */
interface Illness { illness: string; }
interface Medicine { medicine: string; }
interface Treatment {
  treatmentId: string;
  treatment: string;
  treatmentNames: { name: string }[];
  cost: number;
}

interface PatientType {
  name: string;
  age: number;
  work: string;
  phone: string;
  illnesses: Illness[];
  Medicines: Medicine[];
  nextSessionDate: string;
  treatments: Treatment[];
  code: string;
}

type Props = {
  patient: PatientType;
};

export default function UserInfoTabs({ patient }: Props) {
  /**
   * @Helper_Function
   * Centralizing date formatting to ensure a consistent Arabic locale (ar-EG) 
   * across the administrative dashboard.
   */
  const formatArabicDate = (dateString: string) => {
    if (!dateString) return "لم يتم التحديد بعد";
    return new Date(dateString).toLocaleString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 border border-gray-200 rounded-3xl bg-white shadow-sm dark:border-gray-800 dark:bg-transparent">
        
        {/* Header Section: Profile Branding */}
        <div className="flex flex-col items-center text-center gap-6 mb-12">
          <div className="relative group">
            <div className="w-24 h-24 overflow-hidden border-4 border-brand-50 rounded-full dark:border-gray-800 shadow-md">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src="/images/user-avatar.png"
                alt={`${patient.name} profile`}
              />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="space-y-2">
            <h4 className="text-gray-900 text-2xl md:text-3xl font-extrabold tracking-tight">
              {patient.name}
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                <Briefcase className="w-4 h-4 text-brand-600" /> {patient.work}
              </span>
              <span className="hidden sm:block h-1 w-1 bg-gray-300 rounded-full"></span>
              <span className="text-sm font-medium">{patient.age} سنة</span>
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto border-t border-gray-50 pt-8">
          
          {/* Patient Code */}
          <InfoItem 
            icon={<IdCard />} 
            label="كود المريض" 
            value={patient.code} 
            highlight 
          />

          {/* Phone Number */}
          <InfoItem 
            icon={<Phone />} 
            label="رقم الهاتف" 
            value={patient.phone} 
          />

          {/* Medicines List */}
          <InfoList 
            icon={<Pill />} 
            label="الأدوية الحالية" 
            items={patient.Medicines.map(m => m.medicine)} 
          />

          {/* Illnesses List */}
          <InfoList 
            icon={<HeartPulse />} 
            label="التاريخ المرضي" 
            items={patient.illnesses.map(i => i.illness)} 
          />

          {/* Next Appointment */}
          <div className="md:col-span-2">
            <InfoItem 
              icon={<Calendar1 />} 
              label="موعد الجلسة القادمة" 
              value={formatArabicDate(patient.nextSessionDate)} 
              isDate
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * @Reusable_UI_Pattern
 * Atomic components to maintain DRY principle and clean JSX.
 */
const InfoItem = ({ icon, label, value, highlight = false, isDate = false }: any) => (
  <div className="flex items-start gap-4">
    <div className="p-2.5 bg-brand-50 rounded-xl text-brand-700">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className={`text-sm md:text-base font-semibold ${highlight ? 'text-brand-800' : 'text-gray-700'} ${isDate ? 'text-brand-700' : ''}`}>
        {value}
      </span>
    </div>
  </div>
);

const InfoList = ({ icon, label, items }: any) => (
  <div className="flex items-start gap-4">
    <div className="p-2.5 bg-brand-50 rounded-xl text-brand-700">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex flex-wrap gap-2 mt-1">
        {items.length > 0 ? items.map((item: string, i: number) => (
          <span key={i} className="text-sm font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
            {item}
          </span>
        )) : <span className="text-sm text-gray-400 italic">لا يوجد سجل</span>}
      </div>
    </div>
  </div>
);