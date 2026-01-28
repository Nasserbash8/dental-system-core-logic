import Appointment from '@/models/appointments';
import dbConnect from '@/utils/dbConnect';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

/**
 * @Clinic_Management_Module
 * This API handles the appointment lifecycle. 
 * Key architectural focus: RBAC (Role-Based Access Control) via JWT, 
 * data persistence for scheduling, and cache invalidation.
 */

/**
 * Custom Auth Guard: Verifies the administrative token.
 * Used to prevent unauthorized scheduling changes or access to patient contact lists.
 */
async function verifyAdmin(req: NextRequest) {
  const cookies = parse(req.headers.get('cookie') || '');
  const token = cookies['admin-token'];

  if (!token) throw new Error("UNAUTHORIZED");

  try {
    return jwt.verify(token, process.env.ADMIN_SECRET as string);
  } catch (err) {
    throw new Error("UNAUTHORIZED");
  }
}

/* ============================================================
   GET: Fetch All Appointments
   Sorted by date to optimize the doctor's daily agenda view.
   ============================================================ */
export async function GET(req: NextRequest) {
  try {
    await verifyAdmin(req); 
    await dbConnect();
    
    // Sorting by date ensures the UI receives a pre-ordered agenda, reducing frontend processing.
    const appointments = await Appointment.find().sort({ appointmentDate: 1 });
    return NextResponse.json(appointments);
  } catch (error: any) {
    const isAuthError = error.message === "UNAUTHORIZED";
    return NextResponse.json(
      { success: false, message: isAuthError ? "Access Denied" : "Server Error" }, 
      { status: isAuthError ? 401 : 500 }
    );
  }
}

/* ============================================================
   POST: Create New Appointment
   Logic: Validates scheduling data and triggers Next.js Tag-based revalidation.
   ============================================================ */
export async function POST(req: NextRequest) {
  try {
    await verifyAdmin(req);
    await dbConnect();
    
    const body = await req.json();
    const { name, phone, appointmentDate, notes, status } = body;

    // Strict validation for core scheduling fields
    if (!phone || !appointmentDate) {
      return NextResponse.json({ error: 'Required Fields Missing: Phone/Date' }, { status: 400 });
    }

    const newAppointment = await Appointment.create({
      name,
      phone,
      appointmentDate,
      notes,
      status: status || 'pending', // Default status for new entries
    });

    /**
     * @On_Demand_Revalidation
     * Invalidate the 'appointment' cache tag to ensure the doctor's 
     * dashboard reflects the new booking immediately across all client instances.
     */
    revalidateTag('appointment');
    
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error: any) {
    const isAuthError = error.message === "UNAUTHORIZED";
    return NextResponse.json(
      { success: false, message: isAuthError ? "Access Denied" : "Creation Failed" }, 
      { status: isAuthError ? 401 : 500 }
    );
  }
}