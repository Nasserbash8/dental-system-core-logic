'use client'

import { useState } from 'react'
import { Box, useMediaQuery, Tabs, Tab } from '@mui/material'
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import TabPanel from './TabPanel'
import dynamic from 'next/dynamic';

/**
 * @Optimization_Strategy
 * Dynamically importing heavy tab contents to reduce the initial JS payload.
 * Components are only loaded when needed, improving the Largest Contentful Paint (LCP).
 */
const UserInfoTabs = dynamic(() => import('./PatientTabsUserInfo'), { 
  loading: () => <div className="p-4 animate-pulse bg-gray-100 rounded-lg h-40" />
});
const UserSessions = dynamic(() => import('./PatientTabsUserSessions'), {
  loading: () => <div className="p-4 animate-pulse bg-gray-100 rounded-lg h-40" />
});

/**
 * @Type_Definitions
 * Comprehensive interfaces for the dental domain model.
 * Note the nested structure of Treatments -> Sessions -> Payments.
 */
interface Illness { illness: string; }
interface TreatmentTooth { id: string; value: string; }
interface Medicine { medicine: string; }

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
  teeth: TreatmentTooth[];
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

/**
 * Accessibility helper for MUI Tabs
 */
function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

export default function PatientTabs({ patient }: Props) {
  // Responsive Breakpoint: 1000px matches the dashboard layout constraint
  const isMobile = useMediaQuery('(max-width:1000px)')
  const [value, setValue] = useState(0)
  const router = useRouter();

  const handleLogout = async () => {
    // Ensuring session is cleared on both client and server sides
    await signOut({ redirect: false });
    router.push(`/login`);
  };

  /**
   * @UI_Component: Sidebar
   * Encapsulating the navigation logic. 
   * Switch between Vertical (Desktop) and Horizontal (Mobile) layout dynamically.
   */
  const PatientTabsSidebar = () => (
    <div className={` ${isMobile ? 'w-full' : 'w-1/4'}`}>
      <div className="text-center mb-2 p-5 bg-gray-50/50 rounded-xl border border-gray-100 dark:border-white/5">
        <img
          className="mx-auto w-[80px] h-[80px] object-contain mb-4 rounded-full border-2 border-brand-100 p-1"
          src="/images/mada_icon.svg"
          alt="Clinic Logo"
        />
        <h4 className="mb-1 text-gray-900 text-xl font-bold tracking-tight"> {patient.name} </h4>
        <div className="inline-block px-3 py-1 bg-brand-50 text-brand-700 text-xs font-mono rounded-full border border-brand-100">
          {patient.code}
        </div>
      </div>
      
      <Tabs
        orientation={isMobile ? 'horizontal' : 'vertical'}
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        aria-label="Patient Portal Navigation"
        sx={{
          borderRight: isMobile ? 0 : 1,
          borderColor: 'divider',
          width: '100%',
          '& .MuiButtonBase-root': {
            fontSize: '14px',
            fontWeight: '600',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: 'right',
            py: 2
          },
        }}
        variant="scrollable"
        scrollButtons="auto"
        TabIndicatorProps={{ style: { backgroundColor: '#d1922b', width: isMobile ? '100%' : '4px' } }}
      >
        <Tab className={value === 0 ? '!text-brand-600' : ''} label="المعلومات الشخصية" {...a11yProps(0)} />
        <Tab className={value === 1 ? '!text-brand-600' : ''} label="الجلسات والمعالجات" {...a11yProps(1)} />
        <Tab className={value === 2 ? '!text-brand-600' : ''} label="تسجيل خروج" {...a11yProps(2)} />
      </Tabs>
    </div>
  );

  return (
    <Box sx={{ 
      flexGrow: 1, 
      width: '100%', 
      bgcolor: 'white', 
      display: isMobile ? 'block' : 'flex', 
      gap: isMobile ? 2 : 5, 
      minHeight: '80vh',
      p: 2,
      borderRadius: '16px'
    }}>
      <PatientTabsSidebar />

      <div className="flex-1 min-w-0">
        <TabPanel value={value} index={0}>
          <UserInfoTabs patient={patient}/>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <UserSessions patient={patient}/>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <div className="p-8 bg-red-50/50 border border-red-100 rounded-2xl text-center max-w-lg mx-auto mt-10">
            <h1 className="text-xl font-bold text-gray-900 mb-6">
              هل أنت متأكد من تسجيل الخروج؟
            </h1>
            <button 
              onClick={handleLogout} 
              className="w-full bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
            >
              تأكيد تسجيل الخروج
            </button>
          </div>
        </TabPanel>
      </div>
    </Box>
  )
}