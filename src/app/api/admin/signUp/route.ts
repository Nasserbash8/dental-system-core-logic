// pages/api/admin/create.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Admin from "@/models/admins";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    }

    const newAdmin = new Admin({ email, password }); // will trigger password hashing
    await newAdmin.save();

    return NextResponse.json({ success: true, message: "Admin created successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
