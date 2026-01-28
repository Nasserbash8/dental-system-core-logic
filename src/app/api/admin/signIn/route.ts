import { NextRequest, NextResponse } from 'next/server';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import dbConnect from "@/utils/dbConnect";
import Admin from "@/models/admins";

/**
 * @Authentication_Module
 * Handles secure administrative authentication and session issuance.
 * Strategy: JWT-based authentication stored in HttpOnly cookies for enhanced security.
 */

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await req.json();
    const isProduction = process.env.NODE_ENV === "production";

    // Standard validation to prevent empty credential processing
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    /**
     * @Security_Note: 
     * Using .select("+password") because the field is hidden by default in the schema 
     * to prevent accidental leaks in GET responses.
     */
    const admin = await Admin.findOne({ email }).select("+password");
    
    // Generic error message to prevent "Username Enumeration" attacks
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." }, 
        { status: 401 }
      );
    }

    /**
     * @Token_Generation:
     * Issuing a signed JWT with a 24-hour expiration.
     * Payload includes minimal non-sensitive user metadata.
     */
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.ADMIN_SECRET as string,
      { expiresIn: "1d" }
    );

    /**
     * @Cookie_Policy:
     * HttpOnly: Prevents JavaScript access (Mitigates XSS).
     * Secure: Ensures transmission over HTTPS only in production.
     * SameSite Strict/Lax: Guards against CSRF attacks.
     */
    const cookie = serialize("admin-token", token, {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 Day
    });

    return NextResponse.json(
      { success: true, message: "Authentication successful" },
      { 
        status: 200, 
        headers: { "Set-Cookie": cookie } 
      }
    );
  } catch (error: any) {
    console.error("LOGIN_ERROR:", error.message);
    return NextResponse.json(
      { success: false, message: "An internal error occurred." }, 
      { status: 500 }
    );
  }
}