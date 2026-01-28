import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

/**
 * @Authentication_Module
 * Handles secure session termination.
 * Strategy: Server-side cookie invalidation by forcing expiration.
 */

export async function POST(req: NextRequest) {
  try {
    /**
     * @Security_Best_Practice:
     * To properly logout, we overwrite the 'admin-token' with an empty string
     * and set the expiration to the Unix Epoch (1970), ensuring the browser 
     * immediately purges the cookie from its storage.
     */
    const cookie = serialize("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Maintains CSRF protection even during logout
      path: "/",
      expires: new Date(0), // Set expiration to the past
    });

    // Logging the event on the server-side for audit trails if necessary
    return NextResponse.json(
      { success: true, message: "Administrative session terminated successfully" },
      { 
        status: 200, 
        headers: { "Set-Cookie": cookie } 
      }
    );
  } catch (error) {
    /**
     * @Error_Handling:
     * Fail-safe logging to monitor potential issues with session destruction.
     */
    console.error("LOGOUT_SYSTEM_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal failure during session termination" },
      { status: 500 }
    );
  }
}