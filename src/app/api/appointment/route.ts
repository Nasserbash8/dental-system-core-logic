import Appointment from '@/models/appointments';
import dbConnect from '@/utils/dbConnect';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

// دالة التحقق من التوكن
async function verifyAdmin(req: NextRequest) {
  const cookies = parse(req.headers.get('cookie') || '');
  const token = cookies['admin-token'];

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    return jwt.verify(token, process.env.ADMIN_SECRET as string);
  } catch (err) {
    throw new Error("UNAUTHORIZED");
  }
}

// GET all appointments - جلب جميع المواعيد (محمي)
export async function GET(req: NextRequest) {
  try {
    await verifyAdmin(req); // حماية الجلب
    await dbConnect();
    
    const appointments = await Appointment.find().sort({ appointmentDate: 1 });
    return NextResponse.json(appointments);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "غير مسموح لك بالوصول" }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// POST a new appointment - إضافة موعد جديد (محمي)
export async function POST(req: NextRequest) {
  try {
    await verifyAdmin(req); // حماية الإضافة
    await dbConnect();
    
    const body = await req.json();
    const { name, phone, appointmentDate, notes, status } = body;

    if (!phone || !appointmentDate) {
      return NextResponse.json({ error: 'Phone and appointmentDate are required' }, { status: 400 });
    }

    const newAppointment = await Appointment.create({
      name,
      phone,
      appointmentDate,
      notes,
      status: status || 'pending',
    });

    revalidateTag('appointment');
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, message: "غير مسموح لك بالوصول" }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}