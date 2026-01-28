"use client";
import React from "react";

import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import Badge from "../ui/badge/Badge";

// Define the type for the patient data
type Patient = {
  patientId: string;
  name: string;
  age: number;
  code: string;
  treatments: { treatmentId: string }[];
};

type Props = {
  patients: Patient[];
  totalPatients: number; // أو string إذا كانت تأتي كنص، لكن الأفضل number
};

export const EcommerceMetrics : React.FC<Props> = ({ patients , totalPatients}) => {
  const totalTreatments = patients.reduce((total, patient) => total + patient.treatments.length, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-brand-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-md font-bold text-brand-400 dark:text-gray-400">
              عدد المرضى
            </span>
            <h4 className="mt-2 font-bold text-brand-400 text-title-sm dark:text-white/90">
              {totalPatients}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
           
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-brand-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-md font-bold text-brand-400 dark:text-gray-400">
              عدد المعالجات
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalTreatments}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
           
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
