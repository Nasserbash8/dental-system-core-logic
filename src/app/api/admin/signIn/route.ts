// pages/api/admin/login.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import dbConnect from "@/utils/dbConnect";
import Admin from "@/models/admins";
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Parse incoming request body
    const { email, password } = await req.json();
    const isProduction = process.env.NODE_ENV === "production";

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (email, password)" },
        { status: 400 }
      );
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return NextResponse.json({ success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." }, { status: 401 });
    }

    // Compare password
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.ADMIN_SECRET as string,
      { expiresIn: "1d" }
    );

    // Set JWT token in a cookie (HTTP-only, secure, etc.)
   const cookie = serialize("admin-token", token, {
  httpOnly: true,
  secure: isProduction, // false على localhost، true على الإنتاج
  sameSite: isProduction ? "strict" : "lax",
  path: "/",
  maxAge: 60 * 60 * 24,
});
    // Set cookie header
    return NextResponse.json(
      { success: true, message: "Logged in successfully" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
