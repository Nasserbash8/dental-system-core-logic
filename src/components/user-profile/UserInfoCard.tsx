"use client";

import { useState } from "react";
import DatePicker from "../form/date-picker";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Edit2Icon, Plus, Trash2 } from "lucide-react";

const Modal = dynamic(() => import('../ui/modal'));

interface Illness {
  illness: string;
}

interface Medicine {
  medicine: string;
}

interface PatientType {
  patientId: string;
  illnesses: Illness[];
  info: string;
  Medicines: Medicine[];
  nextSessionDate: string;
}

type Props = {
  patient: PatientType;
};

export default function UserInfoCard({ patient }: Props) {
  const router = useRouter();
  
  // Appointment states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("07:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Medical info states
  const [isUpdateInfoModalOpen, setIsUpdateInfoModalOpen] = useState(false);
  const [illnesses, setIllnesses] = useState(patient.illnesses.map(i => i.illness));
  const [medicines, setMedicines] = useState(patient.Medicines.map(m => m.medicine));
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

  const handleSaveAppointment = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      setIsSubmitting(true);

      const [hours, minutes] = selectedTime.split(":");
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(Number(hours), Number(minutes), 0, 0);

      const response = await fetch(`/api/patients/${patient.patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nextSessionDate: combinedDate.toISOString(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during update.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMedicalInfo = async () => {
    try {
      setIsUpdatingInfo(true);

      const response = await fetch(`/api/patients/${patient.patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          illnesses: illnesses.filter(i => i.trim() !== "").map(i => ({ illness: i })),
          Medicines: medicines.filter(m => m.trim() !== "").map(m => ({ medicine: m })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsUpdateInfoModalOpen(false);
        router.refresh();
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during update.");
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Patient Information
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <p className="mb-2 text-md font-bold text-black-500 dark:text-gray-400 mt-5">Illnesses</p>
            {patient.illnesses.length === 0 ? (
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">None</p>
            ) : (
              patient.illnesses.map((illness, index) => (
                <p key={index} className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {illness.illness}
                </p>
              ))
            )}
          </div>

          <div>
            <p className="mb-2 text-md font-bold text-black-500 dark:text-gray-400 mt-5">Medicines</p>
            {patient.Medicines.length === 0 ? (
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">None</p>
            ) : (
              patient.Medicines.map((med, index) => (
                <p key={index} className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {med.medicine}
                </p>
              ))
            )}
          </div>

          <div>
            <p className="mb-2 text-md font-bold text-black-500 dark:text-gray-400 mt-5">Additional Info</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {patient.info || "None"}
            </p>
          </div>

          <div>
            <Button 
              className="text-xs p-2 mt-5 items-center text-white bg-brand-600 rounded hover:bg-gray-700" 
              onClick={() => setIsUpdateInfoModalOpen(true)}
            >
              <Edit2Icon className="w-4 h-4" />
              Edit Info
            </Button>
          </div>

          <div className="lg:col-span-4 border-t pt-4 mt-4">
            <p className="mb-2 text-md font-bold text-black-500 dark:text-gray-400">Next Session</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {patient.nextSessionDate
                ? new Date(patient.nextSessionDate).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Not scheduled"}
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex text-sm items-center gap-2 px-4 py-2 mt-5 text-white bg-brand-600 rounded hover:bg-gray-700"
            >
              <Plus className="w-4 h-4" />
              Schedule New Appointment
            </button>
          </div>
        </div>

        {/* Modal: Appointment Scheduling */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isFullscreen>
          <div className="p-6">
            <h4 className="text-xl font-semibold mb-4">Schedule New Appointment</h4>
            <div className="mb-4">
              <DatePicker
                id="next-session-date"
                label="Date"
                placeholder="Select date"
                value={selectedDate ? [new Date(selectedDate)] : []}
                onChange={(dates: Date[]) => {
                  if (dates.length > 0) {
                    setSelectedDate(dates[0].toLocaleDateString('en-CA'));
                  } else {
                    setSelectedDate("");
                  }
                }}
              />
            </div>

            <div className="mb-4">
              <Label>Time</Label>
              <input
                type="time"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button disabled={!selectedDate || isSubmitting} onClick={handleSaveAppointment}>
                {isSubmitting ? "Saving..." : "Save Appointment"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Medical History Edit */}
        <Modal isOpen={isUpdateInfoModalOpen} onClose={() => setIsUpdateInfoModalOpen(false)} isFullscreen>
          <div className="p-6">
            <h4 className="text-xl font-semibold mb-4">Update Medical Records</h4>
            
            <div className="mb-6">
              <Label>Illnesses</Label>
              {illnesses.map((ill, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border rounded-lg px-3 py-2"
                    value={ill}
                    onChange={(e) => {
                      const updated = [...illnesses];
                      updated[index] = e.target.value;
                      setIllnesses(updated);
                    }}
                  />
                  <button onClick={() => setIllnesses(illnesses.filter((_, i) => i !== index))} className="text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <Button variant="outline" onClick={() => setIllnesses([...illnesses, ""])} className="mt-2 text-xs">
                + Add Illness
              </Button>
            </div>

            <div className="mb-6">
              <Label>Medicines</Label>
              {medicines.map((med, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border rounded-lg px-3 py-2"
                    value={med}
                    onChange={(e) => {
                      const updated = [...medicines];
                      updated[index] = e.target.value;
                      setMedicines(updated);
                    }}
                  />
                  <button onClick={() => setMedicines(medicines.filter((_, i) => i !== index))} className="text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <Button variant="outline" onClick={() => setMedicines([...medicines, ""])} className="mt-2 text-xs">
                + Add Medicine
              </Button>
            </div>

            <div className="flex justify-end mt-6 gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => setIsUpdateInfoModalOpen(false)}>Cancel</Button>
              <Button disabled={isUpdatingInfo} onClick={handleUpdateMedicalInfo}>
                {isUpdatingInfo ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}