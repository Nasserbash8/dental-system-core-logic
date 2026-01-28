// types/next-auth.d.ts

import { User as NextAuthUser } from "next-auth";

// Extend the NextAuth User type to include custom properties
declare module "next-auth" {
  interface User {
    id: string;        // Add the `id` property to User
    patientId: string; // Add the `patientId` property to User
    code: string;      // Add `code` if necessary
  }

  interface Session {
    user: User;
  }
}
