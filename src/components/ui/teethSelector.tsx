'use client'

import React, { useState } from "react";
import dynamic from "next/dynamic";
import teeth from "../../../public/multiOptions/teeth.json";
import { Plus } from "lucide-react";

/**
 * @Dental_ERP_Logic
 * This component handles the complex selection of teeth and mapped treatments.
 * Feature: Macro-selections (Groups) like "LUA" (Lower Upper Anterior) are expanded 
 * into individual tooth IDs for database consistency.
 */

const MultiSelect = dynamic(() => import("@/components/form/MultiSelect"));

interface Tooth {
    id: string;
    value: string;
}

interface TeethSelectorProps {
    onSelectionChange: (selectedTeeth: Tooth[], customTreatments?: { id: string; value: string; customTreatment: string }[]) => void;
    initialSelected?: Tooth[];
    enableCustomTreatments?: boolean;
}

const TeethSelector: React.FC<TeethSelectorProps> = ({
    onSelectionChange,
    initialSelected = [],
    enableCustomTreatments = false,
}) => {
    /**
     * @Macro_Groups
     * Mapping anatomical groups to individual tooth identifiers.
     * This optimizes the UI by allowing doctors to select groups of teeth with one click.
     */
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

    /**
     * Logic to expand selected groups into individual tooth entities.
     * Ensures no duplicates and maintains reference integrity.
     */
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
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <MultiSelect
                label="اختيار الأسنان (يدوي أو مجموعات)"
                options={teeth.map(t => ({ ...t, selected: false }))}
                defaultSelected={initialSelected.map(t => t.value)}
                onChange={handleTeethChange}
            />

            {enableCustomTreatments && selectedTeeth.length > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={handleAddCustomTreatment}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة تفاصيل علاج مخصصة لسن معين
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {customTreatments.map((item, index) => (
                            <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">السن المستهدف</label>
                                    <select
                                        value={item.id}
                                        onChange={(e) => handleUpdateCustomTreatment(index, "id", e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-300 py-1 focus:border-brand-500 outline-none transition-colors"
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

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">وصف العلاج</label>
                                    <input
                                        type="text"
                                        value={item.customTreatment}
                                        onChange={(e) => handleUpdateCustomTreatment(index, "customTreatment", e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                                        className="w-full bg-transparent border-b border-gray-300 py-1 focus:border-brand-500 outline-none transition-colors"
                                        placeholder="مثال: حشوة تجميلية، سحب عصب..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeethSelector;