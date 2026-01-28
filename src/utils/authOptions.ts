import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/utils/dbConnect";
import Patient from "@/models/patients";

/**
 * @Authentication_Architecture
 * Custom Authentication strategy for the Patient Portal.
 * Uses a unique 'Patient Code' access system instead of traditional Email/Password.
 */

// Extending the built-in NextAuth types to ensure full Type-Safety across the app
interface ExtendedUser extends User {
  id: string;
  code: string;
  patientId: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "PatientAccess",
      credentials: {
        code: { label: "Access Code", type: "text" },
      },
      async authorize(credentials) {
        /**
         * @Authorization_Logic:
         * Validates the unique patient code generated during the onboarding process.
         * This ensures a low-friction but secure entry for clinic patients.
         */
        await dbConnect();

        const patient = await Patient.findOne({ code: credentials?.code });

        // If patient code is not found, NextAuth automatically handles the 401 response
        if (!patient) return null;

        const user: ExtendedUser = {
          id: patient.patientId,
          code: patient.code,
          patientId: patient.patientId,
        };

        return user;
      }
    })
  ],
  session: {
    /** * Using Stateless JWT strategy to handle session scalability 
     * without overhead on the primary database.
     */
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Custom UI redirection
    error: "/auth/error",
  },
  callbacks: {
    /**
     * @JWT_Callback:
     * Persisting the unique patientId into the token.
     * This allows subsequent API calls to identify the patient context without extra DB hits.
     */
    async jwt({ token, user }) {
      if (user) {
        token.patientId = (user as ExtendedUser).patientId;
      }
      return token;
    },
    /**
     * @Session_Callback:
     * Exposing the patientId to the Client-side (Frontend).
     * Necessary for fetching patient-specific data in React Server/Client Components.
     */
    async session({ session, token }) {
      if (session.user && token.patientId) {
        session.user.id = token.patientId as string;
      }
      return session;
    }
  }
};