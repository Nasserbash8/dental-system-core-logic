'use client'

import { useState } from 'react'
import { Box, useMediaQuery, Tabs, Tab } from '@mui/material'
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import TabPanel from './TabPanel'
import dynamic from 'next/dynamic';

const UserInfoTabs = dynamic(() => import ('./PatientTabsUserInfo'))
const UserSessions = dynamic(() => import ('./PatientTabsUserSessions'))

interface Illness {
  illness: string;
}
interface treatmentTooth {
  id: string;
  value: string;
}
interface Medicine {
  medicine: string;
}

interface Session {
  sessionId: string;
  sessionDate: Date;
  Payments: string;
  PaymentsDate: Date;
}

interface Treatment {
  treatmentId: string;
  treatment: string;
  treatmentNames: { name: string }[];
  cost: number;
  teeth: treatmentTooth[];
  sessions: Session[];
}

interface PatientType {
  name: string;
  age: number;
  work: string;
  phone: string;
  illnesses: Illness[];
  Medicines: Medicine[];
  nextSessionDate: string;
  treatments: Treatment[];
  code: string;
}

type Props = {
  patient: PatientType;
};


function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

export default function PatientTabs({ patient }: Props) {
  const isMobile = useMediaQuery('(max-width:1000px)')
  const [value, setValue] = useState(0)
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push(`/login`);
  };

 
  const PatientTabsSidebar = () => (
    <div className={` ${isMobile ? 'w-full' : 'w-1/4'}`}>
      <div className="text-center mb-2 p-5">
        <img
          className="mx-auto w-full h-[70px] object-contain mb-4 rounded-full"
          src="/images/mada_icon.svg"
          alt="User"
        />
        <h4 className="mb-2 text-gray-900 text-2xl font-bold"> {patient.name} </h4>
        <h5 className="text-gray-900 text-sm">{patient.code}</h5>
      </div>
      <Tabs
        orientation={isMobile ? 'horizontal' : 'vertical'}
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        aria-label="Patient Tabs"
        sx={{
          borderRight: isMobile ? 0 : 2,
          borderColor: 'divider',
          width: '100%',
          '& .MuiButtonBase-root': {
            fontSize: '15px',
            fontWeight: 'bold',
          },
        }}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        TabIndicatorProps={{ style: { backgroundColor: '#d1922b' } }}
      >
        <Tab className={` ${value === 0 ? '!text-brand-500 ' : ''}`} label="المعلومات الشخصية" {...a11yProps(0)} />
        <Tab className={` ${value === 1 ? '!text-brand-500 font-bold' : ''}`} label="الجلسات والمعالجات" {...a11yProps(1)} />
        <Tab className={` ${value === 2 ? '!text-brand-500 font-bold' : ''}`} label="تسجيل خروج" {...a11yProps(2)} />
      </Tabs>
    </div>
  );




  return (
    <Box sx={{ flexGrow: 1, width: '100%', bgcolor: 'white', display: isMobile ? 'block' : 'flex', gap: 5, height: 'auto' }}>
      {/* Sidebar */}
      <PatientTabsSidebar />

      {/* Content Area */}
      <div className="w-full ">
        <TabPanel value={value} index={0}>
            <UserInfoTabs patient={patient}/>
        </TabPanel>

        <TabPanel value={value} index={1}>
            <UserSessions patient={patient}/>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <div className="p-5 ">
            <span className='mb-5'>
              <h1 className="text-lg md:text-2xl font-semibold text-gray-900 mb-4 leading-tight">
                هل انت متاكد من تسجيل الخروج ؟
              </h1>
            </span>

            <button onClick={handleLogout} className="bg-brand-900 text-white px-6 py-3 rounded-md font-semibold text-sm hover:bg-gray-800 transition">
              تسجيل خروج
            </button>

          </div>
        </TabPanel>
      </div>
    </Box>
  )
}
