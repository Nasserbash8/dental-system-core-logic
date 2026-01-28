'use client'

import { Handshake, CalendarDays, CircleDollarSign } from 'lucide-react'
import { Tooth, ToothClean, ToothShape } from '@/icons'

interface treatmentTooth {
    id: string;
    value: string;
    customTreatment?: string; // أضفتها هنا لتعمل مع الـ Schema
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

// مصفوفات مجموعات الابتسامة للتحقق
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
        <div className="sm-p-5 space-y-2">
            <h4 className="text-gray-900 text-2xl font-bold mb-10">
                الجلسات و المعالجات
            </h4>

            {patient.treatments.map((treatment, tIndex) => (
                <div key={tIndex} className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">

                    <div className="sm:flex items-center justify-between w-full gap-6 mb-10">
                        <div className="flex items-center gap-3 text-gray-900 mb-5 text-sm md:text-md font-semibold">
                            <ToothClean fill='#d3ab49' stroke='#d3ab49' strokeWidth={10} className="sm:w-6 sm:h-6 w-5 h-5 text-brand-800 hover:text-brand-600 transition font-semibold" />
                            <span>العلاج :</span>
                            <span className="text-[#666666] font-normal"> {treatment.treatmentNames.map((tn) => tn.name).join(" - ")}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-900 text-sm md:text-md font-semibold">
                            <CircleDollarSign className="sm:w-6 sm:h-6 w-5 h-5 text-brand-800 hover:text-brand-600 transition" />
                            <span>التكلفة :</span>
                            <span className="text-[#666666] font-normal">
                                {treatment.cost} {treatment.currency || "ل.س"}
                            </span>
                        </div>
                    </div>

                    <div className="w-full gap-6 xl:flex-row mb-10">
                        <div className="flex items-center gap-3 text-gray-900 mb-5 text-sm md:text-md font-semibold">
                            <Tooth fill='#d3ab49' stroke='#d3ab49' strokeWidth={10} className="sm:w-6 sm:h-6 w-5 h-5 text-brand-800 hover:text-brand-600 transition font-semibold" />
                            <span>الأسنان المعالجة :</span>
                        </div>

                        <div className="py-4 text-center space-y-8">
                            {/* الأسنان العلوية */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {['LU', 'RU'].map((quadrant) => {
                                    const isLeft = quadrant === 'LU';
                                    const teethInQuadrant = teeth
                                        .filter((tooth) => tooth.quadrant === quadrant)
                                        .sort((a, b) => isLeft ? b.number - a.number : a.number - b.number);

                                    return (
                                        <div key={quadrant} className="flex gap-1 flex-wrap items-center justify-center">
                                            {teethInQuadrant.map((tooth) => {
                                                const treatmentToothIds = treatment.teeth.map(t => t.id);
                                                const toothData = treatment.teeth.find(t => t.id === tooth.id);
                                                
                                                const allInQuadrantSelected = treatmentToothIds.includes(`${quadrant}A`);
                                                const isSmileSelected = ['U6', 'U8', 'U10'].some(gid => treatmentToothIds.includes(gid) && SMILE_GROUPS[gid].includes(tooth.id));
                                                const isSelected = allInQuadrantSelected || isSmileSelected || treatmentToothIds.includes(tooth.id);
                                                
                                                // فحص وجود علاج مخصص
                                                const hasCustom = !!toothData?.customTreatment;

                                                return (
                                                    <div key={tooth.id} className="flex flex-col items-center space-y-1 relative group">
                                                        <span className="text-[10px] text-gray-600">{tooth.id}</span>
                                                        <div className="relative">
                                                            <ToothShape
                                                                fill="#d3ab49"
                                                                stroke="#d3ab49"
                                                                className={`w-5 h-7 md:w-8 md:h-10 sm:w-7 sm:h-9 cursor-pointer ${
                                                                    isSelected ? '' : 'fill-gray-100'
                                                                } ${hasCustom ? 'animate-pulse drop-shadow-[0_0_5px_rgba(211,171,73,0.8)]' : ''}`}
                                                            />
                                                            {hasCustom && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />}
                                                        </div>
                                                      
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* الأسنان السفلية */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {['LD', 'RD'].map((quadrant) => {
                                    const isLeft = quadrant === 'LD';
                                    const teethInQuadrant = teeth
                                        .filter((tooth) => tooth.quadrant === quadrant)
                                        .sort((a, b) => isLeft ? b.number - a.number : a.number - b.number);

                                    return (
                                        <div key={quadrant} className="flex gap-1 flex-wrap items-center justify-center">
                                            {teethInQuadrant.map((tooth) => {
                                                const treatmentToothIds = treatment.teeth.map(t => t.id);
                                                const toothData = treatment.teeth.find(t => t.id === tooth.id);

                                                const allInQuadrantSelected = treatmentToothIds.includes(`${quadrant}A`);
                                                const isSmileSelected = ['D6', 'D8', 'D10'].some(gid => treatmentToothIds.includes(gid) && SMILE_GROUPS[gid].includes(tooth.id));
                                                const isSelected = allInQuadrantSelected || isSmileSelected || treatmentToothIds.includes(tooth.id);

                                                const hasCustom = !!toothData?.customTreatment;

                                                return (
                                                    <div key={tooth.id} className="flex flex-col items-center space-y-1 relative group">
                                                        <span className="text-[10px] text-gray-600">{tooth.id}</span>
                                                        <div className="relative">
                                                            <ToothShape
                                                                fill="#d3ab49"
                                                                stroke="#d3ab49"
                                                                className={`w-5 h-7 md:w-8 md:h-10 sm:w-7 sm:h-9 cursor-pointer ${
                                                                    isSelected ? '' : 'fill-gray-100'
                                                                } ${hasCustom ? 'animate-pulse drop-shadow-[0_0_5px_rgba(211,171,73,0.8)]' : ''}`}
                                                            />
                                                            {hasCustom && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />}
                                                        </div>
                                                        {hasCustom && <span className="text-[8px] font-bold text-brand-800 truncate max-w-[40px]">{toothData.customTreatment}</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <h4 className="text-gray-900 text-lg font-bold mb-10">الجلسات :</h4>

                    {treatment.sessions.map((session, sIndex) => (
                        <div key={session.sessionId || sIndex} className='mb-16'>
                            <div className="flex items-center gap-3 text-gray-900 text-sm md:text-md font-semibold mb-5">
                                <Handshake className="sm:w-6 sm:h-6 w-5 h-5 text-brand-800 hover:text-brand-600 transition" />
                                <span>الجلسة :</span>
                                <span className="text-[#666666] font-normal">{sIndex + 1}</span>
                            </div>

                            <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full max-w-3xl mx-auto">
                                <div className="flex items-center gap-3 text-gray-900 text-sm md:text-md font-semibold">
                                    <CalendarDays className="sm:w-6 sm:h-6 w-5 h-5 text-brand-800 hover:text-brand-600 transition" />
                                    <span>تاريخ الجلسة :</span>
                                    <span className="text-[#666666] font-normal">{new Date(session.sessionDate).toLocaleDateString()}</span>
                                </div>

                                <div className="flex items-center gap-3 text-gray-900 text-sm md:text-md font-semibold">
                                    <CircleDollarSign className="sm:w-6 sm:h-6 w-5 h-5 text-brand-800 hover:text-brand-600 transition" />
                                    <span>الدفعة :</span>
                                    <span className="text-[#666666] font-normal">
                                        {session.Payments} {session.paymentCurrency || "ل.س"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-gray-900 text-sm md:text-md font-semibold">
                                    <CalendarDays className="sm:w-6 sm:h-6 w-5 h-5 text-brand-800 hover:text-brand-600 transition" />
                                    <span>تاريخ الدفعة :</span>
                                    <span className="text-[#666666] font-normal">{new Date(session.PaymentsDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default UserSessions;