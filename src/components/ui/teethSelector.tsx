// components/TeethSelector/TeethSelector.tsx
'use client'

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import teeth from "../../../public/multiOptions/teeth.json";
import { Plus } from "lucide-react";

const MultiSelect = dynamic(() => import("@/components/form/MultiSelect"));

interface Tooth {
    id: string;
    value: string;
}

interface TeethSelectorProps {
    onSelectionChange: (selectedTeeth: Tooth[], customTreatments?: { id: string; value: string; customTreatment: string }[]) => void;
    initialSelected?: Tooth[];
    enableCustomTreatments?: boolean;
    apiEndpoint?: string; // Optional - if you want the component to handle API calls
}

const TeethSelector: React.FC<TeethSelectorProps> = ({
    onSelectionChange,
    initialSelected = [],
    enableCustomTreatments = false,
    apiEndpoint
}) => {
    const toothGroups: Record<string, string[]> = {
        LUA: ["LU1", "LU2", "LU3", "LU4", "LU5", "LU6", "LU7", "LU8"],
        RUA: ["RU1", "RU2", "RU3", "RU4", "RU5", "RU6", "RU7", "RU8"],
        LDA: ["LD1", "LD2", "LD3", "LD4", "LD5", "LD6", "LD7", "LD8"],
        RDA: ["RD1", "RD2", "RD3", "RD4", "RD5", "RD6", "RD7", "RD8"],

        U6:  ["LU1", "LU2", "LU3", "RU1", "RU2", "RU3"],
        U8:  ["LU1", "LU2", "LU3", "LU4", "RU1", "RU2", "RU3", "RU4"],
        U10: ["LU1", "LU2", "LU3", "LU4", "LU5", "RU1", "RU2", "RU3", "RU4", "RU5"],

        
        D6:  ["LD1", "LD2", "LD3", "RD1", "RD2", "RD3"],
        D8:  ["LD1", "LD2", "LD3", "LD4", "RD1", "RD2", "RD3", "RD4"],
        D10: ["LD1", "LD2", "LD3", "LD4", "LD5", "RD1", "RD2", "RD3", "RD4", "RD5"],
    };

    const [selectedTeeth, setSelectedTeeth] = useState<Tooth[]>(initialSelected);
    const [customTreatments, setCustomTreatments] = useState<
        { id: string; value: string; customTreatment: string }[]
    >([]);

    const handleTeethChange = (values: Tooth[]) => {
        const allTeethFromJson = [...teeth];
        const expanded = values.flatMap(({ id }) => toothGroups[id] || [id]);
        const uniqueIds = Array.from(new Set(expanded));

        const finalTeeth = uniqueIds.map(id => {
            const match = allTeethFromJson.find(t => t.id === id);
            return match ? { id: match.id, value: match.value } : { id, value: id };
        });

        setSelectedTeeth(finalTeeth);
        onSelectionChange(finalTeeth, enableCustomTreatments ? customTreatments : undefined);
    };

    const handleAddCustomTreatment = () => {
        const availableTeeth = selectedTeeth.filter(
            tooth => !customTreatments.some(t => t.id === tooth.id)
        );
        if (availableTeeth.length === 0) return;

        const newCustomTreatments = [
            ...customTreatments,
            { ...availableTeeth[0], customTreatment: "" }
        ];

        setCustomTreatments(newCustomTreatments);
        onSelectionChange(selectedTeeth, newCustomTreatments);
    };

    const handleUpdateCustomTreatment = (index: number, field: "id" | "customTreatment", value: string) => {
        const updated = [...customTreatments];

        if (field === "id") {
            const selectedTooth = selectedTeeth.find(tooth => tooth.id === value);
            if (selectedTooth) updated[index] = { ...selectedTooth, customTreatment: updated[index].customTreatment };
        } else {
            updated[index].customTreatment = value;
        }

        setCustomTreatments(updated);
        onSelectionChange(selectedTeeth, updated);
    };

    return (
        <div className="space-y-4">
            <MultiSelect
                label="الأسنان"
                options={teeth.map(t => ({ ...t, selected: false }))}
                defaultSelected={initialSelected.map(t => t.value)}
                onChange={handleTeethChange}
            />

            {enableCustomTreatments && selectedTeeth.length > 1 && (
                <>


                    <button
                        type="button"
                        onClick={handleAddCustomTreatment}
                        className="flex text-sm items-center  gap-2 px-4 py-2 mt-5 text-white bg-brand-600 rounded hover:bg-gray-700"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة علاج خاص لسن
                    </button>


                    <div className="space-y-4 mt-4">
                        {customTreatments.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1">اختر السن</label>
                                    <select
                                        value={item.id}
                                        onChange={(e) => handleUpdateCustomTreatment(index, "id", e.target.value)}
                                        className="w-full border p-2 rounded"
                                    >
                                        {selectedTeeth
                                            .filter(t => !customTreatments.some((ct, i) => ct.id === t.id && i !== index))
                                            .map((tooth) => (
                                                <option key={tooth.id} value={tooth.id}>
                                                    {tooth.value}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-1">العلاج المخصص</label>
                                  <input
  type="text"
  value={item.customTreatment}
  onChange={(e) => {
    const updated = [...customTreatments];
    updated[index].customTreatment = e.target.value; // فقط تحديث state
    setCustomTreatments(updated);
    // يمكن إرسال التحديث لأعلى للتخزين فقط، بدون submit
    onSelectionChange(selectedTeeth, updated); 
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") e.preventDefault(); // منع إرسال الفورم عند Enter
  }}
  className="w-full border p-2 rounded"
  placeholder="مثال: تنظيف عميق"
/>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default TeethSelector;