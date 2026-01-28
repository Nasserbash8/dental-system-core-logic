'use client'

import React from 'react';
import { Handshake, CalendarDays, CircleDollarSign } from 'lucide-react'
import { Tooth, ToothClean, ToothShape } from '@/icons'

/**
 * @Dental_Business_Logic
 * This component visualizes the historical treatment data.
 * It maps backend IDs to a visual tooth chart, highlighting treated teeth
 * and indicating custom localized treatments (e.g., individual root canals within a bridge).
 */

interface treatmentTooth {
    id: string;
    value: string;
    customTreatment?: string;
}

interface Session {
    sessionId: string;
    sessionDate: Date;
    Payments: string;
    paymentCurrency?: string;
    PaymentsDate: Date;
}

interface Treatment {
    treatmentId: string;
    treatment: string;
    treatmentNames: { name: string }[];
    cost: number;
    currency?: string;
    teeth: treatmentTooth[];
    sessions: Session[];
}

interface PatientType {
    treatments: Treatment[];
}

type Props = {
    patient: PatientType;
};

type Quadrant = 'RU' | 'LU' | 'RD' | 'LD';

interface ToothInfo {
    id: string; 
    quadrant: Quadrant;
    number: number;
}

const SMILE_GROUPS: Record<string, string[]> = {
    U6:  ["LU1", "LU2", "LU3", "RU1", "RU2", "RU3"],
    U8:  ["LU1", "LU2", "LU3", "LU4", "RU1", "RU2", "RU3", "RU4"],
    U10: ["LU1", "LU2", "LU3", "LU4", "LU5", "RU1", "RU2", "RU3", "RU4", "RU5"],
    D6:  ["LD1", "LD2", "LD3", "RD1", "RD2", "RD3"],
    D8:  ["LD1", "LD2", "LD3", "LD4", "RD1", "RD2", "RD3", "RD4"],
    D10: ["LD1", "LD2", "LD3", "LD4", "LD5", "RD1", "RD2", "RD3", "RD4", "RD5"],
};

function UserSessions({ patient }: Props) {
    const quadrants: Quadrant[] = ['RU', 'LU', 'RD', 'LD'];
    const teeth: ToothInfo[] = quadrants.flatMap((quadrant) =>
        Array.from({ length: 8 }, (_, i) => ({
            id: `${quadrant}${i + 1}`,
            quadrant,
            number: i + 1,
        }))
    );

    return (
        <div className="space-y-8 p-2 md:p-4">
            <h4 className="text-gray-900 text-2xl font-bold border-r-4 border-brand-500 pr-4">
                السجل الطبي والمعالجات
            </h4>

            {patient.treatments.map((treatment, tIndex) => (
                <div key={tIndex} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                    
                    {/* Treatment Header: Summary Info */}
                    <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-100 rounded-lg text-brand-700">
                                <ToothClean size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">نوع المعالجة</p>
                                <p className="text-gray-900 font-bold">{treatment.treatmentNames.map(tn => tn.name).join(" - ")}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-700">
                                <CircleDollarSign size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">إجمالي التكلفة</p>
                                <p className="text-gray-900 font-bold">{treatment.cost.toLocaleString()} {treatment.currency || "ل.س"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Visual Tooth Chart Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-brand-800 font-bold text-sm">
                                <Tooth size={18} />
                                <span>خريطة الأسنان المعالجة:</span>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-6 border border-dashed border-gray-200 dark:border-gray-700">
                                
                                <div className="space-y-8">
                                    {/* Upper Jaw (LU - RU) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {['LU', 'RU'].map((quadrant) => (
                                            <div key={quadrant} className="flex gap-1.5 flex-wrap justify-center">
                                                {teeth
                                                    .filter(t => t.quadrant === quadrant)
                                                    .sort((a, b) => quadrant === 'LU' ? b.number - a.number : a.number - b.number)
                                                    .map((tooth) => {
                                                        const treatmentToothIds = treatment.teeth.map(t => t.id);
                                                        const toothData = treatment.teeth.find(t => t.id === tooth.id);
                                                        const isSelected = treatmentToothIds.includes(tooth.id) || 
                                                            ['U6', 'U8', 'U10'].some(gid => treatmentToothIds.includes(gid) && SMILE_GROUPS[gid].includes(tooth.id));
                                                        const hasCustom = !!toothData?.customTreatment;

                                                        return (
                                                            <ToothIcon key={tooth.id} id={tooth.id} isSelected={isSelected} hasCustom={hasCustom} customText={toothData?.customTreatment} />
                                                        );
                                                    })}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Lower Jaw (LD - RD) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-8">
                                        {['LD', 'RD'].map((quadrant) => (
                                            <div key={quadrant} className="flex gap-1.5 flex-wrap justify-center">
                                                {teeth
                                                    .filter(t => t.quadrant === quadrant)
                                                    .sort((a, b) => quadrant === 'LD' ? b.number - a.number : a.number - b.number)
                                                    .map((tooth) => {
                                                        const treatmentToothIds = treatment.teeth.map(t => t.id);
                                                        const toothData = treatment.teeth.find(t => t.id === tooth.id);
                                                        const isSelected = treatmentToothIds.includes(tooth.id) || 
                                                            ['D6', 'D8', 'D10'].some(gid => treatmentToothIds.includes(gid) && SMILE_GROUPS[gid].includes(tooth.id));
                                                        const hasCustom = !!toothData?.customTreatment;

                                                        return (
                                                            <ToothIcon key={tooth.id} id={tooth.id} isSelected={isSelected} hasCustom={hasCustom} customText={toothData?.customTreatment} />
                                                        );
                                                    })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sessions Timeline */}
                        <div className="space-y-4">
                            <h5 className="flex items-center gap-2 text-gray-900 font-bold">
                                <Handshake className="text-brand-600" size={20} />
                                تفاصيل الجلسات والمدفوعات
                            </h5>
                            
                            <div className="grid gap-4">
                                {treatment.sessions.map((session, sIndex) => (
                                    <div key={sIndex} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 flex flex-wrap gap-6 items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">
                                                {sIndex + 1}
                                            </span>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">تاريخ الجلسة</p>
                                                <p className="text-sm font-semibold">{new Date(session.sessionDate).toLocaleDateString('ar-EG')}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="text-left md:text-right">
                                                <p className="text-xs text-gray-400 font-bold uppercase">الدفعة المسددة</p>
                                                <p className="text-brand-700 font-bold">{session.Payments} {session.paymentCurrency || "ل.س"}</p>
                                            </div>
                                        </div>

                                        <div className="hidden md:block">
                                            <p className="text-xs text-gray-400 font-bold uppercase">تاريخ الدفع</p>
                                            <p className="text-sm font-medium italic">{new Date(session.PaymentsDate).toLocaleDateString('ar-EG')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

/**
 * @Sub_Component
 * Renders an individual tooth with conditional styling based on treatment status.
 */
const ToothIcon = ({ id, isSelected, hasCustom, customText }: any) => (
    <div className="flex flex-col items-center gap-1 group relative">
        <span className="text-[9px] font-mono text-gray-400">{id}</span>