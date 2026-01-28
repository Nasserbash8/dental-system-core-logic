import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../../utils/dbConnect';
import Patient from '../../../models/patients';
import { revalidateTag } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import cloudinary from '@/utils/cloudinary';
import { tmpdir } from 'os';
import jwt from "jsonwebtoken";
import { parse } from 'cookie';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';


interface Treatment {
  treatment: string[];
  cost: number;
  teeth: string[];
  sessions: {
    sessionId: string;
    sessionDate: Date;
    Payments: string;
    PaymentsDate: Date;
  }[];
}

interface Medicine {
  medicine: string;
}

// 🔐 simple auth guard (non-breaking)
async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

function generatePatientCode(): string {
  const letters = [...Array(2)]
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join('');
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}-${numbers}`;
}

async function checkIfCodeExists(code: string): Promise<boolean> {
  const existing = await Patient.findOne({ code });
  return !!existing;
}

/* =========================
   POST – create patient
========================= */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const cookies = parse(req.headers.get('cookie') || '');
const token = cookies['admin-token'];
if (!token) {
  return NextResponse.json(
    { success: false, message: 'Unauthorized: Missing token' },
    { status: 401 }
  );
}

try {
  jwt.verify(token, process.env.ADMIN_SECRET as string);
} catch (err) {
  return NextResponse.json(
    { success: false, message: 'Unauthorized: Invalid token' },
    { status: 401 }
  );
}
    const formData = await req.formData();

    const name = formData.get('name')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const age = formData.get('age')?.toString() || '';
    const work = formData.get('work')?.toString() || '';
    const info = formData.get('info')?.toString() || '';
    const nextSessionDate = formData.get('nextSessionDate')?.toString() || '';

    const illnesses = JSON.parse(formData.get('illnesses')?.toString() || '[]');
    const Medicines = JSON.parse(formData.get('Medicines')?.toString() || '[]');
    const treatments = JSON.parse(formData.get('treatments')?.toString() || '[]');

    if (!name || !phone || !age) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (name, phone, age)' },
        { status: 400 }
      );
    }

    if (!Array.isArray(treatments) || treatments.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one treatment is required.' },
        { status: 400 }
      );
    }

    for (const treatment of treatments) {
      if (!treatment.treatmentNames?.length || !treatment.treatmentNames[0].name?.trim()) {
        return NextResponse.json(
          { success: false, message: 'Each treatment must include at least one valid name.' },
          { status: 400 }
        );
      }
      if (!treatment.cost || isNaN(treatment.cost)) {
        return NextResponse.json(
          { success: false, message: 'Each treatment must include a valid cost.' },
          { status: 400 }
        );
      }
      if (!Array.isArray(treatment.teeth) || treatment.teeth.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Each treatment must include at least one tooth.' },
          { status: 400 }
        );
      }
    }

    const images: { src: string; date: Date }[] = [];
    const imageFiles = formData.getAll('images') as File[];

    for (const imageFile of imageFiles) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const tempFilePath = path.join(tmpdir(), `${uuidv4()}-${imageFile.name}`);

      await fs.writeFile(tempFilePath, buffer);

      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'patients',
      });

      images.push({ src: result.secure_url, date: new Date() });
      await fs.unlink(tempFilePath);
    }

    let code = generatePatientCode();
    while (await checkIfCodeExists(code)) {
      code = generatePatientCode();
    }

    const patientId = uuidv4();

   const updatedTreatments = treatments.map((t: any) => ({
  treatmentId: uuidv4(),
  treatmentNames: t.treatmentNames.map((n: any) => ({ name: (n.name ?? '').trim() })),
  
  // تحديث التكلفة والعملة
  cost: Number(t.cost) || 0,
  currency: t.currency || 'SYP', // القيمة الافتراضية SYP إذا لم ترسل من الفرونت
  
  teeth: t.teeth.map((tooth: any) => ({
    id: tooth.id,
    value: tooth.value ?? '',
    customTreatment: tooth.customTreatment ?? '',
  })),

  // تحديث الجلسات والدفعات مع عملاتها
  sessions: (t.sessions ?? []).map((s: any) => ({
    sessionId: uuidv4(),
    sessionDate: s.sessionDate ? new Date(s.sessionDate) : new Date(),
    
    // الدفعة وعملة الدفعة
    Payments: Number(s.Payments) || 0, 
    paymentCurrency: s.paymentCurrency || 'SYP', // القيمة الافتراضية SYP
    
    PaymentsDate: s.PaymentsDate ? new Date(s.PaymentsDate) : new Date(),
  })),
}));

    const updatedMedicines = Medicines.map((m: any) => ({
      medicine: (m.medicine ?? '').trim(),
    }));

    const finalNextSessionDate = nextSessionDate ? new Date(nextSessionDate) : undefined;

    const newPatient = new Patient({
      patientId,
      name,
      phone,
      age,
      work,
      info,
      code,
      treatments: updatedTreatments,
      Medicines: updatedMedicines,
      illnesses,
      images,
      nextSessionDate: finalNextSessionDate,
    });

    const saved = await newPatient.save();
    revalidateTag('patients');

    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   GET – list patients
========================= */
export async function GET(request: NextRequest) {
  try {
    await requireAuth(); // 🔒 added
    await dbConnect();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const patients = await Patient.find().skip(skip).limit(limit);
    const totalPatients = await Patient.countDocuments();
    const totalPages = Math.ceil(totalPatients / limit);

    return NextResponse.json({
      success: true,
      data: patients,
      total: totalPatients,
      page,
      totalPages,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Something went wrong while fetching patients.',
      },
      { status: 500 }
    );
  }
}
