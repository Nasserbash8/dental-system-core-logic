"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Modal from "../ui/modal";
import { Edit2Icon, Phone, Hash } from "lucide-react";

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
        router.refresh(); // Triggers server-side data re-validation
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during update");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            {/* Avatar Section */}
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src="/images/user-avatar.png"
                alt="Patient Avatar"
              />
            </div>

            {/* Main Info */}
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
                  {patient.age} years old
                </p>
              </div>
            </div>

            {/* Contact & Code Info */}
            <div className="flex flex-col gap-2 order-2 xl:order-3 xl:ml-auto">
              <p className="text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
                <Phone size={14} className="text-brand-500" />
                Phone: {patient.phone}
              </p>
              <p className="text-sm flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
                <Hash size={14} className="text-brand-500" />
                Patient Code: {patient.code}
              </p>
            </div>
          </div>

          <Button 
            className="text-xs flex items-center gap-2 text-white bg-brand-600 rounded hover:bg-brand-700 transition" 
            onClick={() => setIsModalOpen(true)}
          >
            <Edit2Icon className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isFullscreen>
        <div className="p-6 max-w-2xl mx-auto">
          <h4 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Patient Details</h4>

          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div>
              <Label>Occupation</Label>
              <Input
                placeholder="Enter work/occupation"
                value={formData.work}
                onChange={(e) => handleChange("work", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age</Label>
                <Input
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => handleChange("age", parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 gap-3 border-t pt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}