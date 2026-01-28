
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Modal from "../ui/modal";
import { Edit2Icon } from "lucide-react";
interface PatientType {
  patientId: string;
  name: string;
  age: number;
  phone: string;
  work: string;
  info: string;
  code: string;
}

type Props = {
  patient: PatientType;
};

export default function UserMetaCard({ patient }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: patient.name,
    age: patient.age,
    phone: patient.phone,
    work: patient.work,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/patients/${patient.patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          phone: formData.phone,
          work: formData.work,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        router.refresh(); // لإعادة تحميل البيانات
      } else {
        alert("فشل التحديث: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src="/images/user-avatar.png"
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {patient.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                 {patient.work}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                 {patient.age} سنة
                </p>
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
            <p className="text-md text-dark-500 dark:text-gray-400 text-bold">
            رقم الهاتف : {patient.phone}  
                </p>
            

            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
            <p className="text-md text-dark-500 dark:text-gray-400 text-bold">
             الكود : {patient.code}  
                </p>
            

            </div>
          </div>
          <Button className=" text-xs items-center text-white bg-brand-600 rounded hover:bg-gray-700" onClick={() => setIsModalOpen(true)} >
           
            <Edit2Icon className="w-4 h-4" />
            تعديل
          </Button>
            
         
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isFullscreen>
<div className="p-6">
  <h4 className="text-xl font-semibold mb-4">تعديل بيانات المريض</h4>

  <div className="mb-4">
    <Label>الاسم</Label>
    <Input
      value={formData.name}
      onChange={(e) => handleChange("name", e.target.value)}
    />
  </div>

  <div className="mb-4">
    <Label>المهنة</Label>
    <Input
      value={formData.work}
      onChange={(e) => handleChange("work", e.target.value)}
    />
  </div>

  <div className="mb-4">
    <Label>العمر</Label>
    <Input
      type="number"
      value={formData.age}
      onChange={(e) => handleChange("age", parseInt(e.target.value))}
    />
  </div>

  <div className="mb-4">
    <Label>رقم الهاتف</Label>
    <Input
      type="tel"
      value={formData.phone}
      onChange={(e) => handleChange("phone", e.target.value)}
    />
  </div>

  <div className="flex justify-end mt-4">
    <Button variant="outline" className="bg-brand-900" onClick={() => setIsModalOpen(false)}>
      إلغاء
    </Button>
    <Button onClick={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
    </Button>
  </div>
</div>
      </Modal> 
    </>
  );
}


{/* */}
