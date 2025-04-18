"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  status: "active" | "inactive" | "pending";
  type: "mpc" | "hot" | "cold";
}

interface WalletListProps {
  wallets?: Wallet[];
  isLoading?: boolean;
}

export function WalletList({ wallets, isLoading }: WalletListProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {wallets?.map((wallet) => (
        <Card
          key={wallet.id}
          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
            selectedWallet === wallet.id ? "border-primary" : ""
          }`}
          onClick={() => setSelectedWallet(wallet.id)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {wallet.name}
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: wallet.currency,
              }).format(wallet.balance)}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge
                variant={
                  wallet.status === "active"
                    ? "success"
                    : wallet.status === "pending"
                    ? "warning"
                    : "destructive"
                }
              >
                {wallet.status}
              </Badge>
              <Badge variant="outline">{wallet.type}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 