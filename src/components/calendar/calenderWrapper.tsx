'use client';  

import dynamic from 'next/dynamic';

const Calendar = dynamic(() => import('@/components/calendar/Calendar'), { ssr: false });


const CalendarWrapper = ({ Appointment, patients }: { Appointment: any[]; patients: any[] }) => {
  return (
    <div>
      <Calendar Appointment={Appointment} patients={patients} />
    </div>
  );
};

export default CalendarWrapper;
