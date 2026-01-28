import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Admin from "@/models/admins";

/**
 * @Security_Module
 * Dedicated endpoint for Admin User provisioning.
 * Architectural Note: This route should ideally be protected by an IP whitelist 
 * or a Master-Key in production to prevent unauthorized administrative escalation.
 */

export async function POST(req: NextRequest) {
  try {
    // Establishing database connection (Singleton pattern via dbConnect)
    await dbConnect();
    
    const { email, password } = await req.json();

    // Fundamental validation for mandatory credentials
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Credential requirements not met (Email/Password)." }, 
        { status: 400 }
      );
    }

    /**
     * @Security_Implementation
     * Creating a new Admin document. 
     * Note: Hashing is handled at the Schema level (Mongoose pre-save hook) 
     * to ensure "Security by Design" and prevent plain-text leaks.
     */
    const newAdmin = new Admin({ email, password }); 
    await newAdmin.save();

    return NextResponse.json({ 
      success: true, 
      message: "Administrative profile initialized successfully." 
    });

  } catch (error: any) {
    // Strategic Error Handling: Avoiding detailed stack traces in responses for security
    console.error("ADMIN_CREATION_FAILURE:", error);
    return NextResponse.json(
      { success: false, message: "An internal error occurred during provisioning." }, 
      { status: 500 }
    );
  }
}