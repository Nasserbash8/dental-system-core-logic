import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  try {
    // Clear the admin-token cookie by setting its expiration date in the past
    const cookie = serialize("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  // Ensure secure cookies in production
      sameSite: "strict",
      path: "/",
      expires: new Date(0),  // Set the expiration to the past to delete it
    });

    // Return a response with the "Set-Cookie" header to clear the cookie
    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Error during logout" },
      { status: 500 }
    );
  }
}
