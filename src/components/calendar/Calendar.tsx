'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// FullCalendar plugins for scheduling functionality
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import arLocale from "@fullcalendar/core/locales/ar";

/**
 * @Engineering_Decision:
 * Using dynamic imports with { ssr: false } for FullCalendar and heavy UI components.
 * This prevents 'Window is not defined' errors during SSR and optimizes initial bundle size.
 */
const Modal = dynamic(() => import('../ui/modal'));
const FullCalendar = dynamic(() => import("@fullcalendar/react"), { ssr: false });
const DatePicker = dynamic(() => import("../form/date-picker"));
const Label = dynamic(() => import("../form/Label"));

type Patient = {
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
  patients: Patient[];
};

const Calendar: React.FC<Props> = ({ Appointment, patients }) => {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventPhone, setEventPhone] = useState("");
  const [eventNotes, setEventNotes] = useState("");
  const [eventDate, setEventDate] = useState<Date[]>([]); 
  const [eventTime, setEventTime] = useState("");

  /**
   * @Data_Normalization:
   * Merging two different data streams (External Appointments & Internal Patient Records)
   * into a unified FullCalendar event format.
   */
  useEffect(() => {
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
      .filter((p) => p.nextSessionDate)
      .map((patient) => ({
        id: `pt-${patient.patientId}`,
        title: `👤 ${patient.name}`,
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

  /**
   * @UI_Logic:
   * Dynamic color coding based on appointment status or record type.
   * This enhances visual recognition for the clinic staff.
   */
  const getEventColor = (status: string, type: string) => {
    if (type === "patient") return "border-r-4 border-green-600 bg-gray-50"; 
    switch (status) {
      case "pending": return "border-r-4 border-orange-500 bg-gray-50";
      case "confirmed": return "bg-green-500 text-white";
      case "canceled": return "bg-red-500 text-white";
      default: return "bg-brand-500 text-white";
    }
  };

  const handleAddEvent = async () => {
    if (!eventTitle || !eventDate.length || !eventTime) return;

    // Temporal Logic: Merging Date and Time strings into a single Date object
    const appointmentDate = new Date(eventDate[0]);
    const [hours, minutes] = eventTime.split(":");
    appointmentDate.setHours(Number(hours), Number(minutes), 0, 0);

    const newAppointment = {
      name: eventTitle,
      phone: eventPhone,
      appointmentDate: appointmentDate.toISOString(),
      notes: eventNotes,
      status: "pending",
    };

    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      });

      if (response.ok) {
        const saved = await response.json();
        setEvents((prev) => [...prev, {
          title: saved.name,
          start: new Date(saved.appointmentDate),
          end: new Date(new Date(saved.appointmentDate).getTime() + 30 * 60 * 1000),
          extendedProps: { ...saved },
        }]);
        closeModal();
      }
    } catch (err) {
      console.error("SCHEDULING_ERROR:", err);
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
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03] p-4">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        locale={arLocale}
        direction="rtl"
        headerToolbar={{
          left: "prev,next addEventButton",
          center: "title",
          right: "timeGridDay,timeGridWeek",
        }}
        events={events}
        slotMinTime="07:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        /**
         * @Custom_Rendering:
         * Using eventContent to inject custom Tailwind classes and business logic
         * into the FullCalendar grid.
         */
        eventContent={(eventInfo) => {
          const { status, type, patientId } = eventInfo.event.extendedProps;
          const colorClass = getEventColor(status, type);

          return (
            <div
              onClick={() => type === "patient" && router.push(`/dashboard/profile/${patientId}`)}
              className={`h-full w-full cursor-pointer p-1 overflow-hidden transition-all hover:brightness-95 ${colorClass}`}
            >
              <div className="font-bold text-[10px] sm:text-xs opacity-70">{eventInfo.timeText}</div>
              <div className="truncate font-semibold text-xs">{eventInfo.event.title}</div>
              {type === "appointment" && status === "pending" && (
                <span className="text-[10px] bg-orange-100 text-orange-700 px-1 rounded">جديد</span>
              )}
            </div>
          );
        }}
        customButtons={{
          addEventButton: {
            text: "حجز موعد +",
            click: openModal,
          },
        }}
      />

      <Modal isOpen={isOpen} isFullscreen onClose={closeModal}>
        <div className="p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-6">📅 جدولة موعد جديد</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="اسم المريض"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="text"
              placeholder="رقم الهاتف"
              value={eventPhone}
              onChange={(e) => setEventPhone(e.target.value)}
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DatePicker
              value={eventDate}
              onChange={(dates) => setEventDate(dates)}
              label="تاريخ اليوم"
              placeholder="اختر التاريخ"
            />
            <div className="flex flex-col">
              <Label>وقت الموعد</Label>
              <input
                type="time"
                className="border rounded-lg p-2 focus:ring-2 focus:ring-brand-500"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </div>
          </div>

          <textarea
            placeholder="ملاحظات طبية إضافية..."
            value={eventNotes}
            onChange={(e) => setEventNotes(e.target.value)}
            className="w-full border rounded-lg p-2.5 mt-4 h-32 outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={closeModal} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">إلغاء</button>
            <button onClick={handleAddEvent} className="px-5 py-2 bg-brand-900 text-white rounded-lg hover:bg-brand-800 transition">تأكيد الحجز</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;