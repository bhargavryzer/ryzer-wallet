"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { useAuthStore } from "@/stores/auth-store";
import { useGuardStore } from "@/stores/guard-store";
import { usePasskeyStore } from "@/stores/passkey-store";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"email" | "guard" | "passkey">("email");
  
  const router = useRouter();
  const { login, loginWithPasskey, isLoading: isAuthLoading, error: authError } = useAuthStore();
  const { qrCode, generateQrCode, isGenerating, error: guardError } = useGuardStore();
  const { isSupported, checkSupport, authenticate, isAuthenticating, error: passkeyError } = usePasskeyStore();

  useEffect(() => {
    if (activeTab === "guard") {
      generateQrCode();
    }
    if (activeTab === "passkey") {
      checkSupport();
    }
  }, [activeTab, generateQrCode, checkSupport]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handlePasskeyLogin = async () => {
    try {
      await authenticate();
      router.push("/dashboard");
    } catch (error) {
      // Error is handled by the store
    }
  };

  const error = authError || guardError || passkeyError;
  const isLoading = isAuthLoading || isGenerating || isAuthenticating;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Welcome to Ryzer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center space-x-4 mb-6">
          <Button
            variant={activeTab === "email" ? "default" : "outline"}
            onClick={() => setActiveTab("email")}
          >
            Email
          </Button>
          <Button
            variant={activeTab === "guard" ? "default" : "outline"}
            onClick={() => setActiveTab("guard")}
          >
            Ryzer Guard
          </Button>
          <Button
            variant={activeTab === "passkey" ? "default" : "outline"}
            onClick={() => setActiveTab("passkey")}
            disabled={!isSupported}
          >
            Passkey
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
            {error}
          </div>
        )}

        {activeTab === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        )}

        {activeTab === "guard" && (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <QRCodeSVG value={qrCode} size={200} />
            </div>
            <p className="text-sm text-muted-foreground">
              Scan this QR code with your Ryzer Guard app
            </p>
            <p className="text-sm font-medium">
              Code: {qrCode}
            </p>
          </div>
        )}

        {activeTab === "passkey" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Use your device's biometric authentication to sign in
            </p>
            <Button
              onClick={handlePasskeyLogin}
              className="w-full"
              disabled={isLoading || !isSupported}
            >
              {isLoading ? "Signing in..." : "Sign in with Passkey"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 