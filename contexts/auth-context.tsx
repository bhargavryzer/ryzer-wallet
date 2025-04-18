"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { type AuthProvider, EmailLoginFormData, RyzerGuardLoginData } from "@/types/auth";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUIStore } from "@/stores/useUIStore";
import { useWalletStore } from "@/stores/useWalletStore";
import { useSecurityStore } from "@/stores/useSecurityStore";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' ;
}

interface AuthContextType {
  user: User | null;
  userRole: 'admin' | null;
  isLoading: boolean;
  login: (provider: AuthProvider, data?: any) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const { isLoading, error, login, setLoading, setError } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const { sidebarState, setSidebarState, toggleSidebar } = useUIStore();
  const { 
    selectedWallet, 
    selectedTransactions, 
    setSelectedWallet, 
    setSelectedTransactions,
    wallets,
    transactions,
    filters,
    setFilter
  } = useWalletStore();
  const {
    settings: { emergencyFreeze },
    selectedPolicies,
    toggleEmergencyFreeze,
    setSelectedPolicies,
    policies,
    setFilter: securitySetFilter
  } = useSecurityStore();

  const isAuthenticated = status === "authenticated";
  const user = session?.user as User | null;

  // Handle login with different providers
  const handleLogin = async (provider: AuthProvider, data?: any): Promise<boolean> => {
    setLoading(true);
    try {
      let result;

      switch (provider) {
        case "email-login":
          const { email, password } = data as EmailLoginFormData;
          result = await signIn("email-login", {
            email,
            password,
            redirect: false,
          });
          break;

        case "ryzer-guard":
          const { code } = data as RyzerGuardLoginData;
          result = await signIn("ryzer-guard", {
            code,
            redirect: false,
          });
          break;

        case "passkey":
          // In a real implementation, this would handle WebAuthn
          result = await signIn("passkey", {
            redirect: false,
          });
          break;

        case "web3":
          const { address } = data;
          result = await signIn("web3", {
            address,
            redirect: false,
          });
          break;

        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: result.error,
          duration: 3000,
        });
        return false;
      }

      toast({
        title: "Login successful",
        description: "Welcome back! Redirecting to dashboard...",
        duration: 3000,
      });
      
      router.push("/dashboard");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "An unexpected error occurred. Please try again.",
        duration: 3000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An unexpected error occurred. Please try again.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole: user?.role || null,
        isLoading,
        login: handleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}