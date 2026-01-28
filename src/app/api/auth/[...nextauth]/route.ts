import { authOptions } from "@/utils/authOptions";
import NextAuth from "next-auth";

/**
 * @Authentication_Gateway
 * NextAuth Dynamic API Route configuration.
 * * Architectural Note: 
 * We keep the auth configuration in a separate 'authOptions' file to maintain 
 * clean architecture and allow for the reuse of authentication logic 
 * in Server Components and Middleware.
 */

const handler = NextAuth(authOptions);

/**
 * Exporting the handler for both GET and POST requests.
 * NextAuth uses GET for session retrieval and CSRF token fetching,
 * and POST for handling credentials and callback redirections.
 */
export { handler as GET, handler as POST };