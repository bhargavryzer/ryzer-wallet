import { DefaultSession } from "next-auth";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

// Auth provider types
export type AuthProvider = "email-login" | "ryzer-guard" | "passkey" | "web3";

// Login form data types
export interface EmailLoginFormData {
  email: string;
  password: string;
}

export interface RyzerGuardLoginData {
  code: string;
}

export interface Web3LoginData {
  address: string;
}

// Registration form data
export interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Auth state
export interface AuthState {
  isLoading: boolean;
  error: string | null;
}