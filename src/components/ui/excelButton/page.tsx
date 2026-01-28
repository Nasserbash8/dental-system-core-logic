'use client'; // Mark this as a Client Component

import React from 'react';
import * as XLSX from 'xlsx';

interface Session {
  sessionId: string;
  sessionDate: Date;
  Payments: string;
  PaymentsDate: Date;
}

interface TreatmentName {
  name: string;
}

interface Treatment {
  treatmentId: string;
  treatmentNames: TreatmentName[];
  cost: number;
  teeth: string[];
  sessions: Session[];
}

interface Illness {
  illness: string;
}

interface Medicine {
  medicine: string;
}

interface Patient {
  name?: string;
  code: string;
  age?: string;
  phone?: number;
  work?: string;
  info?: string;
  nextSessionDate?: Date;
  illnesses?: Illness[];
  Medicines?: Medicine[];
  treatments?: Treatment[];
}

interface DownloadExcelButtonProps {
  patient: Patient;
}

const DownloadExcelButton: React.FC<DownloadExcelButtonProps> = ({ patient }) => {

  // Function to handle the download as Excel
  const downloadExcel = () => {
    const excelData: (string | number)[][] = [
      ["معلومات المريض", "البيانات"],
      ["الاسم", patient.name || "—"],
      ["الكود", patient.code],
      ["العمر", patient.age || "—"],
      ["رقم الهاتف", patient.phone || "—"],
      ["العمل", patient.work || "—"],
      ["معلومات اخرى", patient.info || "—"],
      ["تاريخ الجلسة القادمة", patient.nextSessionDate ? new Date(patient.nextSessionDate).toLocaleDateString() : "—"],
    ];
  
    // Illnesses
    if (patient.illnesses?.length) {
      excelData.push(["الامراض", patient.illnesses.map((i) => i.illness).join(", ")]);
    }
  
    // Medicines
    if (patient.Medicines?.length) {
      excelData.push(["الأدوية", patient.Medicines.map((m) => m.medicine).join(", ")]);
    }
  
    // Treatments
    patient.treatments?.forEach((treatment, index) => {
      excelData.push([`العلاج ${index + 1} - الاسماء`, treatment.treatmentNames.map((t) => t.name).join(", ")]);
      excelData.push([`العلاج ${index + 1} - التكلفة`, treatment.cost]);
      excelData.push([`العلاج ${index + 1} - الأسنان`, treatment.teeth.join(", ") || "—"]);
  
      treatment.sessions?.forEach((session, sIdx) => {
        excelData.push([`جلسة ${sIdx + 1} - التاريخ`, new Date(session.sessionDate).toLocaleDateString()]);
        excelData.push([`جلسة ${sIdx + 1} - الدفعة`, session.Payments]);
        excelData.push([`جلسة ${sIdx + 1} - تاريخ الدفعة`, new Date(session.PaymentsDate).toLocaleDateString()]);
      });
    });
  
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patient Data");
  
    XLSX.writeFile(wb, `${patient.name || "مريض"}.xlsx`);
  };

  return (
    <button
      onClick={downloadExcel}
      className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none text-sm"
    >
      تحميل البيانات كـ Excel
    </button>
  );
};

export default DownloadExcelButton;
