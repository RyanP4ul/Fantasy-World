import { Profile } from 'next-auth';
// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface JWT {
    token: {
      user: User;
    };
  }

  interface Profile {
    id: string | null;
    username: string | null;
    email: string | null;
    avatar: string | null;
  }

  interface User {
      id: string;
      Name?: string | null;
      Email?: string | null;
      Access?: number | null;
      Avatar?: string | null;
  }
}