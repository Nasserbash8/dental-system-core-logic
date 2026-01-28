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
interface Session {
  sessionId: string;
  sessionDate: Date;
  Payments: string;
  PaymentsDate: Date;
}

interface images {
    _id: string;
    src: string;
    date: Date;
  }


interface Treatment {
  treatmentId: string;
  treatmentNames: { name: string }[];
  cost: number;
  teeth: string[];
  sessions: Session[];
  images : images[]
}

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

// ✅ PATCH: Update patient

export async function PATCH(req: NextRequest, context: any) {
  try {
    await verifyAdmin(req);
    await dbConnect();

    const { patientId } = context.params;

    const contentType = req.headers.get("content-type") || "";

    let bodyData: any = {};
    let formData: FormData | null = null;

    if (contentType.includes("multipart/form-data")) {
      formData = await req.formData();

      // اقرأ الحقول النصية (غير الصور) من formData مع تحويل الأنواع حسب الحاجة
      bodyData.name = formData.get("name")?.toString();
      bodyData.phone = formData.get("phone")?.toString();
      bodyData.age = formData.get("age") ? Number(formData.get("age")) : undefined;
      bodyData.work = formData.get("work")?.toString();

      // الحقول المعقدة ترسل كـ JSON string، فكها هنا إذا موجودة
      bodyData.illnesses = formData.get("illnesses") ? JSON.parse(formData.get("illnesses")!.toString()) : undefined;
      bodyData.Medicines = formData.get("Medicines") ? JSON.parse(formData.get("Medicines")!.toString()) : undefined;
      bodyData.treatments = formData.get("treatments") ? JSON.parse(formData.get("treatments")!.toString()) : undefined;
      bodyData.treatmentId = formData.get("treatmentId")?.toString();
      bodyData.newSessionData = formData.get("newSessionData") ? JSON.parse(formData.get("newSessionData")!.toString()) : undefined;
      bodyData.updateSessionData = formData.get("updateSessionData") ? JSON.parse(formData.get("updateSessionData")!.toString()) : undefined;
      bodyData.nextSessionDate = formData.get("nextSessionDate")?.toString();
      bodyData.newTreatmentData = formData.get("newTreatmentData") ? JSON.parse(formData.get("newTreatmentData")!.toString()) : undefined;
      bodyData.updateTreatmentData = formData.get("updateTreatmentData") ? JSON.parse(formData.get("updateTreatmentData")!.toString()) : undefined;
      bodyData.deleteTreatmentId = formData.get("deleteTreatmentId")?.toString();
      bodyData.deleteSession = formData.get("deleteSession") ? JSON.parse(formData.get("deleteSession")!.toString()) : undefined;
      bodyData.deleteImageIds = formData.get("deleteImageIds") ? JSON.parse(formData.get("deleteImageIds")!.toString()) : undefined;
      // **ملاحظة: newImages نتركها لأنها ملفات، لن تقرأ هنا**

      
    } else {
      // الطلب عادي JSON
      bodyData = await req.json();
    }

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return NextResponse.json({ success: false, message: "المريض غير موجود" }, { status: 404 });
    }

    // ✅ Update basic info
    if (bodyData.name !== undefined) patient.name = bodyData.name;
    if (bodyData.phone !== undefined) patient.phone = bodyData.phone;
    if (bodyData.age !== undefined) patient.age = bodyData.age;
    if (bodyData.work !== undefined) patient.work = bodyData.work;
    if (bodyData.illnesses !== undefined) patient.illnesses = bodyData.illnesses;
    if (bodyData.Medicines !== undefined) patient.Medicines = bodyData.Medicines;

    // ✅ Replace entire treatments array
    if (Array.isArray(bodyData.treatments)) {
      patient.treatments = bodyData.treatments.map((t: any) => ({
        treatmentId: t.treatmentId || uuidv4(),
        treatmentNames: t.treatmentNames?.map((tn: any) => ({ name: tn.name })) || [],
        cost: t.cost,
        teeth: (t.teeth || []).map((tooth: any) => ({
          id: tooth.id,
          value: tooth.value,
          customTreatment: tooth.customTreatment || "",
        })),
        sessions: (t.sessions || []).map((session: any) => ({
          sessionId: session.sessionId || uuidv4(),
          sessionDate: session.sessionDate ? new Date(session.sessionDate) : new Date(),
          Payments: session.Payments,
          PaymentsDate: session.PaymentsDate ? new Date(session.PaymentsDate) : new Date(),
        })),
      }));
    }

    // ✅ Add new session to existing treatment
    if (bodyData.treatmentId && bodyData.newSessionData) {
  const treatment = patient.treatments.find((t: any) => t.treatmentId === bodyData.treatmentId);
  if (!treatment) {
    return NextResponse.json({ success: false, message: "العلاج غير موجود" }, { status: 404 });
  }

  treatment.sessions.push({
    ...bodyData.newSessionData,
    sessionId: uuidv4(),
    paymentCurrency: bodyData.newSessionData.paymentCurrency || "SYP", // 👈 ضمان تخزين عملة الدفعة
    sessionDate: bodyData.newSessionData.sessionDate ? new Date(bodyData.newSessionData.sessionDate) : new Date(),
    PaymentsDate: bodyData.newSessionData.PaymentsDate ? new Date(bodyData.newSessionData.PaymentsDate) : new Date(),
  });
}

    // ✅ Update existing session
    if (bodyData.treatmentId && bodyData.updateSessionData) {
      const treatment = patient.treatments.find((t: any) => t.treatmentId === bodyData.treatmentId);
      if (!treatment) {
        return NextResponse.json({ success: false, message: "العلاج غير موجود" }, { status: 404 });
      }

      const session = treatment.sessions.find((s: any) => s.sessionId === bodyData.updateSessionData.sessionId);
      if (!session) {
        return NextResponse.json({ success: false, message: "الجلسة غير موجودة" }, { status: 404 });
      }

      if (bodyData.updateSessionData.sessionDate !== undefined)
        session.sessionDate = new Date(bodyData.updateSessionData.sessionDate);
      if (bodyData.updateSessionData.Payments !== undefined)
        session.Payments = bodyData.updateSessionData.Payments;
      if (bodyData.updateSessionData.PaymentsDate !== undefined)
        session.PaymentsDate = new Date(bodyData.updateSessionData.PaymentsDate);
    }

    // ✅ Add new treatment
    if (bodyData.newTreatmentData) {
  const formattedTreatment = {
    treatmentId: uuidv4(),
    cost: bodyData.newTreatmentData.cost,
    currency: bodyData.newTreatmentData.currency || "SYP", // 👈 إضافة العملة هنا
    treatmentNames: bodyData.newTreatmentData.treatmentNames.map((tn: any) => ({ name: tn.name })),
    teeth: bodyData.newTreatmentData.teeth.map((tooth: any) => ({
      id: tooth.id,
      value: tooth.value,
      customTreatment: tooth.customTreatment || "",
    })),
    sessions: [],
  };
  patient.treatments.push(formattedTreatment);
}

    // ✅ Update existing treatment
    if (bodyData.treatmentId && bodyData.updateTreatmentData) {
      const treatment = patient.treatments.find((t: any) => t.treatmentId === bodyData.treatmentId);
      if (!treatment) {
        return NextResponse.json({ success: false, message: "العلاج غير موجود" }, { status: 404 });
      }

      if (bodyData.updateTreatmentData.treatmentNames) {
        treatment.treatmentNames = bodyData.updateTreatmentData.treatmentNames.map((tn: any) => ({ name: tn.name }));
      }
      if (bodyData.updateTreatmentData.cost !== undefined) {
        treatment.cost = bodyData.updateTreatmentData.cost;
      }
      if (bodyData.updateTreatmentData.teeth) {
        treatment.teeth = bodyData.updateTreatmentData.teeth.map((tooth: any) => ({
          id: tooth.id,
          value: tooth.value,
          customTreatment: tooth.customTreatment || "",
        }));
      }
    }

       // ✅ DELETE: Remove a specific treatment
    if (bodyData.deleteTreatmentId) {
      // Ensure treatments exists and is an array (defensive programming)
      if (!patient.treatments || !Array.isArray(patient.treatments)) {
        patient.treatments = [];
      }

      const initialLength = patient.treatments.length;
      patient.treatments = patient.treatments.filter(
        (t: any) => t.treatmentId !== bodyData.deleteTreatmentId
      );

      if (patient.treatments.length === initialLength) {
        return NextResponse.json(
          { success: false, message: "العلاج غير موجود" },
          { status: 404 }
        );
      }

      // If this was the last treatment, reset nextSessionDate
      if (patient.treatments.length === 0) {
        patient.nextSessionDate = undefined;
      }
    }


    // ✅ DELETE: Remove a specific session
    if (bodyData.deleteSession?.treatmentId && bodyData.deleteSession?.sessionId) {
      const treatment = patient.treatments.find((t: any) => t.treatmentId === bodyData.deleteSession.treatmentId);
      if (!treatment) {
        return NextResponse.json({ success: false, message: "العلاج غير موجود" }, { status: 404 });
      }

      treatment.sessions = treatment.sessions.filter((s: any) => s.sessionId !== bodyData.deleteSession.sessionId);
    }

    // ✅ Update nextSessionDate
    if (bodyData.nextSessionDate) {
      patient.nextSessionDate = new Date(bodyData.nextSessionDate);
    }

    if (formData && formData.getAll("newImages").length > 0) {
      const imageFiles = formData.getAll("newImages") as File[];
      const newImages: { src: string; date: Date }[] = [];

      for (const imageFile of imageFiles) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const tempFilePath = path.join(tmpdir(), `${uuidv4()}-${imageFile.name}`);
        await fs.writeFile(tempFilePath, buffer);

        const result = await cloudinary.uploader.upload(tempFilePath, {
          folder: "patients",
        });

        newImages.push({
          src: result.secure_url,
          date: new Date(),
        });

        await fs.unlink(tempFilePath);
      }

      patient.images = [...(patient.images || []), ...newImages];
    }

    // ✅ حذف الصور
    if (Array.isArray(bodyData.deleteImageIds)) {
      for (const imageId of bodyData.deleteImageIds) {
        const image = patient.images.find((img: any) => img._id.toString() === imageId);
        if (image) {
          try {
            const publicId = image.src.split("/").slice(-1)[0].split(".")[0];
            await cloudinary.uploader.destroy(`patients/${publicId}`);
          } catch (e) {
            console.warn("فشل حذف الصورة من Cloudinary", e);
          }
        }
      }

      patient.images = patient.images.filter((img: any) => !bodyData.deleteImageIds.includes(img._id.toString()));
    }

    await patient.save();
    revalidateTag("patient");

    return NextResponse.json({ success: true, data: patient });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "حدث خطأ أثناء تحديث بيانات المريض" },
      { status: 500 }
    );
  }
}
// ✅ DELETE: Delete patient
export async function DELETE(req: NextRequest, context: any) {
  try {
    await verifyAdmin(req);
    await dbConnect();

    const { patientId } = context.params;

    const deletedPatient = await Patient.findOneAndDelete({ patientId });

    if (!deletedPatient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Patient deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error deleting patient' },
      { status: 500 }
    );
  }
}
// ✅ GET: Get a specific patient
export async function GET(req: NextRequest, context: any) {
  try {
    await verifyAdmin(req);
    await dbConnect();

    const { patientId } = context.params;

    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: patient });
  } catch (error: any) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error fetching patient." },
      { status: 500 }
    );
  }
}