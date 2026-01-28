'use client';
import React, { useState, useEffect } from 'react';
import Modal from '.';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '../button/Button';
import DatePicker from '@/components/form/date-picker';
import { useRouter } from 'next/navigation';

interface Session {
  sessionId: string;
  sessionDate: Date;
  Payments: string;
  PaymentsDate: Date;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  treatmentId: string;
  session: Session | null;
};

export default function UpdateSessionModal({ isOpen, onClose, patientId, treatmentId, session }: Props) {
  const router = useRouter();

  const [formUpdateSession, setFormUpdateSession] = useState<Session>({
    sessionId: '',
    sessionDate: new Date(),
    Payments: '',
    PaymentsDate: new Date(),
  });

  const [updateSessionErrors, setUpdateSessionErrors] = useState<{ [key: string]: string }>({});
  const [isSavingUpdateSession, setIsSavingUpdateSession] = useState(false);

  // عشان تعبي الفورم بالبيانات لما يفتح المودال
  useEffect(() => {
    if (session && isOpen) {
      setFormUpdateSession({
        sessionId: session.sessionId,
        sessionDate: new Date(session.sessionDate),
        Payments: session.Payments,
        PaymentsDate: new Date(session.PaymentsDate),
      });
      setUpdateSessionErrors({});
    }
  }, [session, isOpen]);

  const handleUpdateSessionChange = (field: keyof Session, value: any) => {
    setFormUpdateSession((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formUpdateSession.sessionDate) errors.sessionDate = 'تاريخ الجلسة مطلوب';
    if (!formUpdateSession.Payments) errors.Payments = 'الدفعة مطلوبة';
    if (!formUpdateSession.PaymentsDate) errors.PaymentsDate = 'تاريخ الدفعة مطلوب';
    return errors;
  };

  const handleSaveUpdatedSession = async () => {
    if (isSavingUpdateSession) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setUpdateSessionErrors(errors);
      return;
    }

    setUpdateSessionErrors({});
    setIsSavingUpdateSession(true);

    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentId,
          updateSessionData: formUpdateSession,
        }),
      });

      if (res.ok) {
        setIsSavingUpdateSession(false);
        onClose();
        router.push(`/dashboard/profile/${patientId}`);
      }
    } catch (error) {
      console.error('Error updating session:', error);
      setIsSavingUpdateSession(false);
    }
  };

  return (
    <Modal isFullscreen isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h4 className="text-xl font-semibold mb-4">تعديل بيانات الجلسة</h4>

        <div className="mb-4">
          <DatePicker
            id="update-session-date"
            label="تاريخ الجلسة"
            value={[formUpdateSession.sessionDate]}
            onChange={(d) => handleUpdateSessionChange('sessionDate', d[0])}
          />
          {updateSessionErrors.sessionDate && <p className="text-red-500 text-sm">{updateSessionErrors.sessionDate}</p>}
        </div>

        <div className="mb-4">
          <Label>الدفعة</Label>
          <Input
            value={formUpdateSession.Payments}
            onChange={(e) => handleUpdateSessionChange('Payments', e.target.value)}
          />
          {updateSessionErrors.Payments && <p className="text-red-500 text-sm">{updateSessionErrors.Payments}</p>}
        </div>

        <div className="mb-4">
          <DatePicker
            id="update-payments-date"
            label="تاريخ الدفعة"
            value={[formUpdateSession.PaymentsDate]}
            onChange={(d) => handleUpdateSessionChange('PaymentsDate', d[0])}
          />
          {updateSessionErrors.PaymentsDate && <p className="text-red-500 text-sm">{updateSessionErrors.PaymentsDate}</p>}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="outline">
            إلغاء
          </Button>
          <Button
            onClick={handleSaveUpdatedSession}
            disabled={isSavingUpdateSession}
            className={`${isSavingUpdateSession ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSavingUpdateSession ? 'جاري الحفظ...' : 'حفظ التعديل'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
