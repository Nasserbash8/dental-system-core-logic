// EditTreatmentModal.tsx
'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Modal from '.';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '../button/Button';

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
  teeth: Tooth[];
  sessions: any[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  treatment: Treatment;
  onSave: () => void;
  teethData: Tooth[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const toothGroups: Record<string, string[]> = {
  LUA: ['LU1', 'LU2', 'LU3', 'LU4', 'LU5', 'LU6', 'LU7', 'LU8'],
  RUA: ['RU1', 'RU2', 'RU3', 'RU4', 'RU5', 'RU6', 'RU7', 'RU8'],
  LDA: ['LD1', 'LD2', 'LD3', 'LD4', 'LD5', 'LD6', 'LD7', 'LD8'],
  RDA: ['RD1', 'RD2', 'RD3', 'RD4', 'RD5', 'RD6', 'RD7', 'RD8'],
};

export default function EditTreatmentModal({ isOpen, onClose, patientId, treatment, onSave, teethData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Treatment>(treatment);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(treatment);
  }, [treatment]);

  const handleNamesChange = (value: string) => {
    const namesArray = value.split('-').map((name) => ({ name: name.trim() }));
    setForm((prev) => ({ ...prev, treatmentNames: namesArray }));
  };

  const handleTeethChange = (selectedIds: string[]) => {
    const expandedIds = selectedIds.flatMap((id) => toothGroups[id] || [id]);
    const uniqueIds = Array.from(new Set(expandedIds));

    const oldMap = new Map(form.teeth.map((t) => [t.id, t]));

    const newTeeth = uniqueIds.map((id) => {
      if (oldMap.has(id)) return oldMap.get(id)!;
      const match = teethData.find((t) => t.id === id);
      return {
        id,
        value: match?.value || id,
        customTreatment: '',
      };
    });

    setForm((prev) => ({ ...prev, teeth: newTeeth }));
  };

  const handleCustomTreatmentChange = (index: number, value: string) => {
    setForm((prev) => {
      const updated = [...prev.teeth];
      updated[index] = { ...updated[index], customTreatment: value };
      return { ...prev, teeth: updated };
    });
  };

  const handleToothRemove = (index: number) => {
    setForm((prev) => ({ ...prev, teeth: prev.teeth.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const validation: { [key: string]: string } = {};
    if (!form.treatmentNames.length) validation.treatmentNames = 'اسم العلاج مطلوب';
    if (!form.cost) validation.cost = 'التكلفة مطلوبة';
    if (!form.teeth.length) validation.teeth = 'يرجى تحديد الأسنان';

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentId: form.treatmentId,
          updateTreatmentData: form,
        }),
      });

      if (res.ok) {
        onClose();
        onSave();
        router.refresh();
      }
    } catch (err) {
      console.error('Error saving edit:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isFullscreen isOpen={isOpen} onClose={onClose}>
      <div className="p-4 max-h-[80vh] overflow-y-auto">
        <h4 className="text-xl font-semibold mb-4">تعديل العلاج</h4>

        <div className="mb-4">
          <Label>أسماء العلاج</Label>
          <Input
            type="text"
            value={form.treatmentNames.map((tn) => tn.name).join(' - ')}
            onChange={(e) => handleNamesChange(e.target.value)}
          />
          {errors.treatmentNames && <p className="text-red-500 text-sm">{errors.treatmentNames}</p>}
        </div>

        <div className="mb-4">
          <Label>التكلفة</Label>
          <Input
            type="number"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
          />
          {errors.cost && <p className="text-red-500 text-sm">{errors.cost}</p>}
        </div>

        <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel id="teeth-select-label">الأسنان</InputLabel>
            <Select
              labelId="teeth-select-label"
              multiple
              value={form.teeth.map((t) => t.id)}
              onChange={(e) => handleTeethChange(e.target.value as string[])}
              input={<OutlinedInput label="الأسنان" />}
              renderValue={(selected) => {
                return (selected as string[])
                  .map((id) => teethData.find((t) => t.id === id)?.value || id)
                  .join(', ');
              }}
              MenuProps={MenuProps}
            >
              {teethData.map((tooth) => (
                <MenuItem key={tooth.id} value={tooth.id}>
                  <Checkbox checked={form.teeth.some((t) => t.id === tooth.id)} />
                  <ListItemText primary={tooth.value} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.teeth && <p className="text-red-500 text-sm">{errors.teeth}</p>}
        </div>

      {form.teeth.length > 1 && (
  <>
    <Label>العلاج المخصص لكل سن</Label>
    {form.teeth.map((tooth, index) => (
      <div key={tooth.id} className="flex items-center gap-4 mb-2">
        <span className="w-24">{tooth.value}</span>
        <Input
          type="text"
          placeholder="مثال: تنظيف عميق"
          value={tooth.customTreatment || ''}
          onChange={(e) => handleCustomTreatmentChange(index, e.target.value)}
        />
        <button
          type="button"
          className="text-red-500 hover:text-red-700"
          onClick={() => handleToothRemove(index)}
        >
          حذف
        </button>
      </div>
    ))}
  </>
)}

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="outline">
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
