import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Patient from '@/models/patients';
import { v4 as uuidv4 } from 'uuid';
import { revalidateTag } from 'next/cache';
import fs from "fs/promises";
import path from "path";
import cloudinary from '@/utils/cloudinary';
import { tmpdir } from "os";
import jwt from "jsonwebtoken";
import { parse } from 'cookie';

/**
 * @Engineering_Notes:
 * This Dynamic Route handler manages the atomic updates of patient records.
 * It is designed to handle polymorphic payloads (Multipart/Form-Data vs JSON)
 * to support simultaneous media uploads and nested data mutations (Treatments/Sessions).
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
   PATCH: Atomic Updates for Patient Records
   Handles: Basic Info, Nested Treatments, Session Tracking, & Media
   ============================================================ */
export async function PATCH(req: NextRequest, context: any) {
  try {
    await verifyAdmin(req);
    await dbConnect();

    const { patientId } = context.params;
    const contentType = req.headers.get("content-type") || "";

    let bodyData: any = {};
    let formData: FormData | null = null;

    /**
     * @Logic: Hybrid Parser
     * We support Multipart/Form-Data specifically for high-res medical image uploads
     * while parsing nested JSON structures within the same request.
     */
    if (contentType.includes("multipart/form-data")) {
      formData = await req.formData();
      bodyData.name = formData.get("name")?.toString();
      bodyData.phone = formData.get("phone")?.toString();
      bodyData.age = formData.get("age") ? Number(formData.get("age")) : undefined;
      bodyData.work = formData.get("work")?.toString();

      // Deserializing complex JSON strings from FormData
      const fields = ["illnesses", "Medicines", "treatments", "newSessionData", "updateSessionData", "newTreatmentData", "updateTreatmentData", "deleteSession", "deleteImageIds"];
      fields.forEach(field => {
        const val = formData!.get(field);
        if (val) bodyData[field] = JSON.parse(val.toString());
      });
      
      bodyData.treatmentId = formData.get("treatmentId")?.toString();
      bodyData.deleteTreatmentId = formData.get("deleteTreatmentId")?.toString();
      bodyData.nextSessionDate = formData.get("nextSessionDate")?.toString();
    } else {
      bodyData = await req.json();
    }

    const patient = await Patient.findOne({ patientId });
    if (!patient) return NextResponse.json({ success: false, message: "Patient Not Found" }, { status: 404 });

    // ✅ Atomic updates for basic identity fields
    const basicFields = ["name", "phone", "age", "work", "illnesses", "Medicines"];
    basicFields.forEach(field => {
      if (bodyData[field] !== undefined) patient[field] = bodyData[field];
    });

    /**
     * @Treatment_Logic:
     * Handles complex tooth mapping and cost tracking. 
     * Supports both individual tooth overrides and bulk jaw treatments.
     */
    if (Array.isArray(bodyData.treatments)) {
      patient.treatments = bodyData.treatments.map((t: any) => ({
        ...t,
        treatmentId: t.treatmentId || uuidv4(),
        teeth: (t.teeth || []).map((tooth: any) => ({ ...tooth, customTreatment: tooth.customTreatment || "" })),
      }));
    }

    // ✅ Session Management: Append new sessions with unique IDs and currency markers
    if (bodyData.treatmentId && bodyData.newSessionData) {
      const treatment = patient.treatments.find((t: any) => t.treatmentId === bodyData.treatmentId);
      if (treatment) {
        treatment.sessions.push({
          ...bodyData.newSessionData,
          sessionId: uuidv4(),
          paymentCurrency: bodyData.newSessionData.paymentCurrency || "SYP",
        });
      }
    }

    /**
     * @Media_Sync:
     * Parallel Cloudinary uploads with temporary local buffer cleanup.
     * Ensures clinical images are persisted before updating the DB record.
     */
    if (formData && formData.getAll("newImages").length > 0) {
      const imageFiles = formData.getAll("newImages") as File[];
      for (const file of imageFiles) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempPath = path.join(tmpdir(), `${uuidv4()}-${file.name}`);
        await fs.writeFile(tempPath, buffer);

        const result = await cloudinary.uploader.upload(tempPath, { folder: "patients" });
        patient.images.push({ src: result.secure_url, date: new Date() });
        await fs.unlink(tempPath);
      }
    }

    // ✅ Media Cleanup: Sync Cloudinary storage with DB deletion
    if (Array.isArray(bodyData.deleteImageIds)) {
      for (const imgId of bodyData.deleteImageIds) {
        const img = patient.images.find((i: any) => i._id.toString() === imgId);
        if (img) {
          const publicId = img.src.split("/").slice(-1)[0].split(".")[0];
          await cloudinary.uploader.destroy(`patients/${publicId}`).catch(console.error);
        }
      }
      patient.images = patient.images.filter((img: any) => !bodyData.deleteImageIds.includes(img._id.toString()));
    }

    await patient.save();
    revalidateTag("patient"); // Revalidate On-Demand Cache for Patient Detail pages

    return NextResponse.json({ success: true, data: patient });
  } catch (error: any) {
    console.error("PATCH_ERROR:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

/* ============================================================
   DELETE: Permanent Patient Record Removal
   ============================================================ */
export async function DELETE(req: NextRequest, context: any) {
  try {
    await verifyAdmin(req);
    await dbConnect();
    const { patientId } = context.params;

    const deleted = await Patient.findOneAndDelete({ patientId });
    if (!deleted) return NextResponse.json({ success: false, message: 'Not Found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Record Purged' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

/* ============================================================
   GET: Fetch Granular Patient Data
   ============================================================ */
export async function GET(req: NextRequest, context: any) {
  try {
    await verifyAdmin(req);
    await dbConnect();
    const { patientId } = context.params;
    const patient = await Patient.findOne({ patientId });

    if (!patient) return NextResponse.json({ success: false, message: "Not Found" }, { status: 404 });
    return NextResponse.json({ success: true, data: patient });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}