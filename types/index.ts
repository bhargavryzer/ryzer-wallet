export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalWallets: number;
  totalAssets: number;
  frozenWallets: number;
  pendingApprovals: number;
  totalTransactions: number;
  totalValue: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  wallets: number;
  status: "active" | "inactive";
  lastActive: string;
}

export interface Approval {
  id: string;
  type: "wallet_approval" | "large_withdrawal" | "security_alert";
  user: string;
  description: string;
  requestedAt: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: "custodial" | "mpc";
  balance: string;
  tokens: number;
  address: string;
} 