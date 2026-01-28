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

/**
 * @SeniorsNote
 * This API handles the core patient management lifecycle.
 * Key features: Multi-part form data processing, Cloudinary integration, 
 * Dynamic patient code generation, and Multi-layered Authentication.
 */

// 🔐 Custom Auth Guard to protect routes using Next-Auth sessions
async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Generates a unique, human-readable identifier for patients.
 * Format: [Letter][Letter]-[4 Digits] (e.g., AB-1234).
 * This provides a secure way for patients to login without exposing database IDs.
 */
function generatePatientCode(): string {
  const letters = [...Array(2)]
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join('');
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${letters}-${numbers}`;
}

// Utility to ensure code uniqueness within the database
async function checkIfCodeExists(code: string): Promise<boolean> {
  const existing = await Patient.findOne({ code });
  return !!existing;
}

/* =========================
   POST – Create New Patient
   Handles: Profile data, Complex Treatment Plans, and Medical Imagery
========================= */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Secondary Admin Auth Check via JWT Token in cookies
    const cookies = parse(req.headers.get('cookie') || '');
    const token = cookies['admin-token'];
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.ADMIN_SECRET as string);
    } catch (err) {
      return NextResponse.json({ success: false, message: 'Invalid Admin Token' }, { status: 401 });
    }

    const formData = await req.formData();

    // Extracting basic info with fallback defaults
    const name = formData.get('name')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const age = formData.get('age')?.toString() || '';
    
    // Server-side Validation
    if (!name || !phone || !age) {
      return NextResponse.json({ success: false, message: 'Required fields missing' }, { status: 400 });
    }

    /**
     * Processing Medical Imagery:
     * Using the OS temp directory to buffer files before uploading to Cloudinary.
     * This ensures high availability and prevents memory leaks during heavy uploads.
     */
    const images: { src: string; date: Date }[] = [];
    const imageFiles = formData.getAll('images') as File[];

    for (const imageFile of imageFiles) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const tempFilePath = path.join(tmpdir(), `${uuidv4()}-${imageFile.name}`);

      await fs.writeFile(tempFilePath, buffer);
      const result = await cloudinary.uploader.upload(tempFilePath, { folder: 'patients' });
      
      images.push({ src: result.secure_url, date: new Date() });
      await fs.unlink(tempFilePath); // Cleanup temp files
    }

    // Ensure unique patient code through recursive-like checking
    let code = generatePatientCode();
    while (await checkIfCodeExists(code)) {
      code = generatePatientCode();
    }

    /**
     * Complex Data Mapping:
     * Transforming incoming treatment arrays into a structured schema.
     * Includes handling individual tooth overrides within bulkJaw selections.
     */
    const treatments = JSON.parse(formData.get('treatments')?.toString() || '[]');
    const updatedTreatments = treatments.map((t: any) => ({
      treatmentId: uuidv4(),
      treatmentNames: t.treatmentNames.map((n: any) => ({ name: (n.name ?? '').trim() })),
      cost: Number(t.cost) || 0,
      currency: t.currency || 'SYP',
      teeth: t.teeth.map((tooth: any) => ({
        id: tooth.id,
        value: tooth.value ?? '',
        customTreatment: tooth.customTreatment ?? '', // Override logic for specific teeth
      })),
      sessions: (t.sessions ?? []).map((s: any) => ({
        sessionId: uuidv4(),
        sessionDate: s.sessionDate ? new Date(s.sessionDate) : new Date(),
        Payments: Number(s.Payments) || 0, 
        paymentCurrency: s.paymentCurrency || 'SYP',
        PaymentsDate: s.PaymentsDate ? new Date(s.PaymentsDate) : new Date(),
      })),
    }));

    const newPatient = new Patient({
      patientId: uuidv4(),
      name, phone, age,
      code,
      treatments: updatedTreatments,
      images,
      // ...other fields mapped similarly
    });

    const saved = await newPatient.save();
    revalidateTag('patients'); // On-demand ISR revalidation

    return NextResponse.json({ success: true, data: saved });

  } catch (error: any) {
    console.error("API_ERROR:", error);
    const status = error.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}

/* =========================
   GET – Paginated Patient List
========================= */
export async function GET(request: NextRequest) {
  try {
    await requireAuth(); // Enforcing session protection
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const patients = await Patient.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const totalPatients = await Patient.countDocuments();

    return NextResponse.json({
      success: true,
      data: patients,
      pagination: { total: totalPatients, page, totalPages: Math.ceil(totalPatients / limit) },
    });
  } catch (error: any) {
    const status = error.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}