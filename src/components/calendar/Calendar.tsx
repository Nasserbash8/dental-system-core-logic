'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import arLocale from "@fullcalendar/core/locales/ar";


const Modal = dynamic(() => import('../ui/modal'));
const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});
const DatePicker = dynamic(() => import("../form/date-picker"));
const Label = dynamic(() => import("../form/Label"));

type patients = {
  patientId: string;
  name: string;
  nextSessionDate: Date;
  code: string;
};
type Appointment = {
  name: string;
  phone: string;
  appointmentDate: Date;
  notes: string;
  status: string;
};

type Props = {
  Appointment: Appointment[];
  patients : patients[]
};

const Calendar: React.FC<Props> = ({ Appointment , patients }) => {
    const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventPhone, setEventPhone] = useState("");
  const [eventNotes, setEventNotes] = useState("");
  const [eventDate, setEventDate] = useState<Date[]>([]); // Store selected date from DatePicker
  const [eventTime, setEventTime] = useState(""); // Store selected time

  useEffect(() => {
    console.log(patients)
        const appointmentEvents = Appointment.map((appointment) => ({
      id: `appt-${appointment.name}-${appointment.appointmentDate}`,
      title: appointment.name,
      start: new Date(appointment.appointmentDate),
      end: new Date(new Date(appointment.appointmentDate).getTime() + 30 * 60 * 1000),
      extendedProps: {
        type: "appointment",
        status: appointment.status,
        phone: appointment.phone,
        notes: appointment.notes,
      },
    }));
  
    const patientEvents = patients
      .filter((p) => p.nextSessionDate) // optionally filter if date is required
      .map((patient) => ({
        id: `pt-${patient.patientId}`,
        title: `👤 ${patient.name}`,
        code: `👤 ${patient.code}`,
        start: new Date(patient.nextSessionDate),
        end: new Date(new Date(patient.nextSessionDate).getTime() + 30 * 60 * 1000),
        extendedProps: {
          type: "patient",
          status: "active",
          code: patient.code,
          name: patient.name,
          patientId: patient.patientId,
        },
      }));
  
    setEvents([...appointmentEvents, ...patientEvents]);
  }, [Appointment, patients]);

  const getEventColor = (status: string, type: string) => {
  if (type === "patient") return "border-r-5  border-green-600 bg-[#f9fafb]  "; // all patients are green
  switch (status) {
    case "pending":
      return "border-r-5 border-brand-900 bg-[#f9fafb]" ;
    case "confirmed":
      return "bg-green-500 bg-white";
    case "canceled":
      return "bg-red-500 bg-white";
    default:
      return "bg-blue-400 bg-white";
  }
};

  const handleAddEvent = async () => {
    if (!eventTitle || !eventDate.length || !eventTime) return;
  
    // Combine date and time
    const appointmentDate = new Date(eventDate[0]);
    const [hours, minutes] = eventTime.split(":");
    appointmentDate.setHours(Number(hours), Number(minutes), 0, 0);
  
    const newAppointment = {
      name: eventTitle,
      phone: eventPhone,
      appointmentDate: appointmentDate.toString(), // or use toISOString()
      notes: eventNotes,
      status: "pending",
    };
  
    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAppointment),
      });
  
      console.log("Sent appointment:", newAppointment);
  
      if (response.ok) {
        const saved = await response.json();
  
        setEvents((prev) => [
          ...prev,
          {
            title: saved.name,
            start: new Date(saved.appointmentDate),
            end: new Date(new Date(saved.appointmentDate).getTime() + 30 * 60 * 1000),
            extendedProps: {
              status: saved.status,
              phone: saved.phone,
              notes: saved.notes,
            },
          },
        ]);
        alert("تم اضافة موعد جديد");
        closeModal();
      } else {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        alert("حدث خطأ أثناء إضافة الموعد. يرجى المحاولة لاحقًا.");
      }
    } catch (err) {
      console.error("Error adding appointment:", err);
      alert("حدث خطأ أثناء إرسال البيانات إلى الخادم.");
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setEventTitle("");
    setEventPhone("");
    setEventNotes("");
    setEventDate([]);
    setEventTime("");
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        locale={arLocale}
        direction="rtl"
        headerToolbar={{
          left: "prev,next addEventButton",
          center: "title",
          right: "",
        }}
        events={events}
        slotMinTime="07:00:00" // Start from 7 AM
        slotMaxTime="24:00:00" // End at 11 PM
        allDaySlot={false}
        eventContent={(eventInfo) => {
          const { status, type, patientId, code } = eventInfo.event.extendedProps;
          const color = getEventColor(status, type);
        
          const handleClick = () => {
            if (type === "patient" && patientId) {
              router.push(`/dashboard/profile/${patientId}`);
            }
          };
        
          return (
            <div
              onClick={handleClick}
              className={`cursor-pointer p-1 flex flex-col rounded-sm  text-gray-900 text-sm ${color}`}
            >
              <div>{eventInfo.timeText}</div>
              <div>{eventInfo.event.title}</div>
              {type === "appointment" && status === "pending" && (
                <div className="text-xs">مريض جديد</div>
              )}
            </div>
          );
        }}
        customButtons={{
          addEventButton: {
            text: "أضف موعد +",
            click: openModal,
          },
        }}
      />

      <Modal isOpen={isOpen} isFullscreen onClose={closeModal}>
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div className=" bg-white p-10 rounded ">
            <h3 className="text-lg font-semibold text-brand-900 mb-2">إضافة موعد جديد</h3>

            <div className="mb-4">
            <input
              type="text"
              placeholder="الاسم"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            </div>
          
            
            <div className="mb-4">
            <input
              type="text"
              placeholder="رقم الهاتف"
              value={eventPhone}
              onChange={(e) => setEventPhone(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            </div>
           

 <div className="mb-4">
              <DatePicker
              id="appointment-date"
              value={eventDate}
              onChange={(dates) => setEventDate(dates)}
              label="تاريخ الموعد"
              placeholder="حدد التاريخ"
            />
</div> 

<div className="mb-4">
<Label>الوقت </Label>
            <input
              
              type="time"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={eventTime}
              min="07:00"
               max="23:00"
              onChange={(e) => setEventTime(e.target.value)}
            />
</div>


            <textarea
              placeholder="ملاحظات"
              value={eventNotes}
              onChange={(e) => setEventNotes(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <div className="flex gap-4">
              <button
                onClick={handleAddEvent}
                className="bg-brand-900 text-white px-4 py-2 rounded"
              >
                إضافة
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
