"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Filter,
  LayoutGrid,
  List,
  Search,
  Shield,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CreateWalletDialog } from "@/components/dialogs/create-wallet-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Interfaces
interface Wallet {
  id: string;
  name: string;
  type: string;
  balance: string;
  tokens: number;
  userId: string;
  userName: string;
  userEmail: string;
  status: "active" | "frozen" | "pending";
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface WalletInfoCardProps {
  name: string;
  type: string;
  balance: string;
  tokens: number;
  id: string;
  userName?: string;
  userEmail?: string;
  status?: "active" | "frozen" | "pending";
  createdAt?: string;
  onApprove?: () => void;
  onFreeze?: () => void;
}

// Sample data
const wallets: Wallet[] = [
  {
    id: "c1273b26-4915-45d9-a856-bf765e5c82c9",
    name: "Default Wallet",
    type: "Asset Wallet",
    balance: "$0",
    tokens: 0,
    userId: "user-1",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    status: "active",
    createdAt: "2025-03-10",
  },
  {
    id: "d2384c37-5026-46ea-b967-cg876f6d93d0",
    name: "Investment Wallet",
    type: "Custodial Wallet",
    balance: "$10,500.00",
    tokens: 3,
    userId: "user-2",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    status: "active",
    createdAt: "2025-03-15",
  },
  {
    id: "e3495d48-6137-47fb-c078-dh987g7e04e1",
    name: "Main Wallet",
    type: "Asset Wallet",
    balance: "$25,000.00",
    tokens: 5,
    userId: "user-3",
    userName: "Michael Brown",
    userEmail: "m.brown@example.com",
    status: "frozen",
    createdAt: "2025-04-01",
  },
  {
    id: "f4506e59-7248-480c-d189-ei098h8f15f2",
    name: "Pending Wallet",
    type: "Custodial Wallet",
    balance: "$0",
    tokens: 0,
    userId: "user-4",
    userName: "Emily Davis",
    userEmail: "emily.d@example.com",
    status: "pending",
    createdAt: "2025-04-15",
  },
];

const users: User[] = [
  { id: "all", name: "All Users", email: "" },
  { id: "user-1", name: "John Smith", email: "john.smith@example.com" },
  { id: "user-2", name: "Sarah Johnson", email: "sarah.j@example.com" },
  { id: "user-3", name: "Michael Brown", email: "m.brown@example.com" },
  { id: "user-4", name: "Emily Davis", email: "emily.d@example.com" },
];

// Enhanced WalletInfoCard component
function WalletInfoCard({
  name,
  type,
  balance,
  tokens,
  id,
  userName,
  userEmail,
  status,
  createdAt,
  onApprove,
  onFreeze,
}: WalletInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <CardDescription className="text-sm">{type}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {userName && userEmail && (
            <p className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">User:</span>{" "}
              <Link
                href={`/admin/users/${id}`}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {userName}
              </Link>{" "}
              <span className="text-gray-500 dark:text-gray-400">({userEmail})</span>
            </p>
          )}
          <p className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Balance:</span>{" "}
            <span className="font-mono">{balance}</span>
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Tokens:</span>{" "}
            {tokens}
          </p>
          {status && (
            <p className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>{" "}
              <Badge
                variant={
                  status === "active"
                    ? "default"
                    : status === "frozen"
                    ? "destructive"
                    : "secondary"
                }
                className="ml-2"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </p>
          )}
          {createdAt && (
            <p className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>{" "}
              {createdAt}
            </p>
          )}
          <p className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">ID:</span>{" "}
            <span className="font-mono text-xs">{id}</span>
          </p>
        </CardContent>
        <CardFooter className="flex gap-2 bg-gray-50 dark:bg-gray-800">
          {status === "pending" && onApprove ? (
            <>
              <Button
                size="sm"
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onApprove}
                className="hover:bg-red-700"
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
            </>
          ) : (
            onFreeze && (
              <Button
                size="sm"
                variant="outline"
                onClick={onFreeze}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Shield className="mr-2 h-4 w-4" />{" "}
                {status === "active" ? "Freeze" : "Unfreeze"}
              </Button>
            )
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function AdminCustodialWalletsPage() {
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [walletToApprove, setWalletToApprove] = useState<Wallet | null>(null);

  // Filter wallets
  const filteredWallets = wallets.filter(
    (wallet) =>
      (searchQuery === "" ||
        wallet.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedUser === "all" || wallet.userId === selectedUser)
  );

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Selection handlers
  const handleSelectAllWallets = (checked: boolean) => {
    if (checked) {
      setSelectedWallets(filteredWallets.map((wallet) => wallet.id));
    } else {
      setSelectedWallets([]);
    }
  };

  const handleSelectWallet = (walletId: string, checked: boolean) => {
    if (checked) {
      setSelectedWallets([...selectedWallets, walletId]);
    } else {
      setSelectedWallets(selectedWallets.filter((id) => id !== walletId));
    }
  };

  // Bulk actions
  const handleBulkFreeze = () => {
    console.log("Freezing wallets:", selectedWallets);
    setSelectedWallets([]);
  };

  const handleBulkUnfreeze = () => {
    console.log("Unfreezing wallets:", selectedWallets);
    setSelectedWallets([]);
  };

  // Approval actions
  const handleOpenApprovalDialog = (wallet: Wallet) => {
    setWalletToApprove(wallet);
    setShowApprovalDialog(true);
  };

  const handleApproveWallet = () => {
    if (walletToApprove) {
      console.log("Approving wallet:", walletToApprove.id);
    }
    setShowApprovalDialog(false);
    setWalletToApprove(null);
  };

  const handleRejectWallet = () => {
    if (walletToApprove) {
      console.log("Rejecting wallet:", walletToApprove.id);
    }
    setShowApprovalDialog(false);
    setWalletToApprove(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Admin: Custodial Wallets
              </h1>
              <Badge className="bg-blue-600 text-white">Admin</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage all custodial wallets with enhanced security and control
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              <span className="font-semibold">Wallets:</span> {wallets.length}
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              <span className="font-semibold">Users:</span>{" "}
              {new Set(wallets.map((w) => w.userId)).size}
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              <span className="font-semibold">Tokens:</span>{" "}
              {wallets.reduce((sum, w) => sum + w.tokens, 0)}
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              <span className="font-semibold">Total Value:</span>{" "}
              {hideBalance
                ? "••••••"
                : `$${wallets
                    .reduce(
                      (sum, w) =>
                        sum + parseFloat(w.balance.replace(/[^0-9.-]+/g, "")),
                      0
                    )
                    .toLocaleString()}`}
            </span>
          </div>
        </motion.div>

        {/* Wallet Info Card */}
        <Card className="border-none shadow-xl bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold">
                  Custodial Wallets Overview
                </CardTitle>
                <CardDescription className="text-sm text-gray-100">
                  Securely manage custodial wallets with bank-grade protection and
                  seamless user experience.
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 text-white hover:bg-indigo-600"
                    >
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      How to Manage Wallets?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Wallet management guide</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Filters and Controls */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by wallet name"
                    className="h-11 pl-10 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-[200px] h-11 rounded-lg border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setHideBalance(!hideBalance)}
                        aria-label={hideBalance ? "Show balance" : "Hide balance"}
                      >
                        {hideBalance ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {hideBalance ? "Show balance" : "Hide balance"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="icon"
                          className={`h-11 w-11 rounded-none border-0 ${
                            viewMode === "grid"
                              ? "bg-indigo-500 text-white"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                          onClick={() => setViewMode("grid")}
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Grid view</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="icon"
                          className={`h-11 w-11 rounded-none border-0 ${
                            viewMode === "list"
                              ? "bg-indigo-500 text-white"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                          onClick={() => setViewMode("list")}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>List view</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button
                  className="h-11 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  onClick={() => setShowCreateWallet(true)}
                >
                  Create Wallet
                </Button>
              </div>
            </motion.div>

            {/* Bulk Actions */}
            <AnimatePresence>
              {selectedWallets.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg"
                >
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">
                      {selectedWallets.length}
                    </span>{" "}
                    wallet(s) selected
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleBulkFreeze}
                      variant="outline"
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Freeze Selected
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleBulkUnfreeze}
                      variant="outline"
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Unfreeze Selected
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wallet List/Grid */}
            <AnimatePresence>
              {filteredWallets.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No wallets found matching your search.
                </motion.div>
              ) : viewMode === "list" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="py-4 pl-6 w-12">
                          <Checkbox
                            checked={
                              selectedWallets.length === filteredWallets.length &&
                              filteredWallets.length > 0
                            }
                            onCheckedChange={handleSelectAllWallets}
                            aria-label="Select all wallets"
                          />
                        </th>
                        <th className="py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Wallet
                        </th>
                        <th className="py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                          User
                        </th>
                        <th className="py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Wallet ID
                        </th>
                        <th className="py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Value
                        </th>
                        <th className="py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Status
                        </th>
                        <th className="py-4 pr-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWallets.map((wallet) => (
                        <motion.tr
                          key={wallet.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="py-4 pl-6">
                            <Checkbox
                              checked={selectedWallets.includes(wallet.id)}
                              onCheckedChange={(checked) =>
                                handleSelectWallet(wallet.id, !!checked)
                              }
                              aria-label={`Select wallet ${wallet.name}`}
                            />
                          </td>
                          <td className="py-4">
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {wallet.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {wallet.tokens} Tokens
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="space-y-1">
                              <Link
                                href={`/admin/users/${wallet.userId}`}
                                className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {wallet.userName}
                              </Link>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {wallet.userEmail}
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                WaaS
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                {wallet.id}
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                      onClick={() => copyToClipboard(wallet.id)}
                                    >
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V18M8 5C8 6.10457 8.89543 7 10 7H12C13.1046 7 14 6.10457 14 5M8 5C8 3.89543 8.89543 3 10 3H12C13.1046 3 14 3.89543 14 5M14 5H16C17.1046 5 18 5.89543 18 7V10M20 14H10M10 14L13 11M10 14L13 17"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Copy wallet ID</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="space-y-1">
                              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {wallet.type}
                              </div>
                              <div className="text-sm font-mono text-gray-900 dark:text-gray-100">
                                {hideBalance ? "••••••" : wallet.balance}
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge
                              variant={
                                wallet.status === "active"
                                  ? "default"
                                  : wallet.status === "frozen"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {wallet.status.charAt(0).toUpperCase() +
                                wallet.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 pr-6">
                            <div className="flex items-center gap-2">
                              {wallet.status === "pending" ? (
                                <>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                          onClick={() =>
                                            handleOpenApprovalDialog(wallet)
                                          }
                                        >
                                          <Check className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Approve wallet
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                          onClick={() =>
                                            handleOpenApprovalDialog(wallet)
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Reject wallet
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </>
                              ) : (
                                <>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                          <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M12 16V12"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M12 8H12.01"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                          <span className="sr-only">Info</span>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>View details</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                          onClick={() =>
                                            wallet.status === "active"
                                              ? console.log(
                                                  "Freeze wallet:",
                                                  wallet.id
                                                )
                                              : console.log(
                                                  "Unfreeze wallet:",
                                                  wallet.id
                                                )
                                          }
                                        >
                                          <Shield className="h-4 w-4" />
                                          <span className="sr-only">
                                            {wallet.status === "active"
                                              ? "Freeze"
                                              : "Unfreeze"}
                                          </span>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {wallet.status === "active"
                                          ? "Freeze wallet"
                                          : "Unfreeze wallet"}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Link href={`/admin/wallets/${wallet.id}`}>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                          >
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 20V13"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                              <path
                                                d="M18.5 2.5C18.7626 2.23735 19.1131 2.08901 19.4775 2.08901C19.8419 2.08901 20.1924 2.23735 20.455 2.5C20.7176 2.76264 20.866 3.11315 20.866 3.47755C20.866 3.84196 20.7176 4.19247 20.455 4.45511L12 13.0001L9 14.0001L10 11.0001L18.5 2.5Z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                            <span className="sr-only">Edit</span>
                                          </Button>
                                        </Link>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit wallet</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {filteredWallets.map((wallet) => (
                    <WalletInfoCard
                      key={wallet.id}
                      name={wallet.name}
                      type={wallet.type}
                      balance={hideBalance ? "••••••" : wallet.balance}
                      tokens={wallet.tokens}
                      id={wallet.id}
                      userName={wallet.userName}
                      userEmail={wallet.userEmail}
                      status={wallet.status}
                      createdAt={wallet.createdAt}
                      onApprove={() => handleOpenApprovalDialog(wallet)}
                      onFreeze={() =>
                        wallet.status === "active"
                          ? console.log("Freeze wallet:", wallet.id)
                          : console.log("Unfreeze wallet:", wallet.id)
                      }
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 text-sm text-gray-500 dark:text-gray-400"
            >
              Showing {filteredWallets.length} of {wallets.length} wallets
            </motion.div>
          </CardContent>
        </Card>

        {/* Create Wallet Dialog */}
        <CreateWalletDialog
          open={showCreateWallet}
          onOpenChange={setShowCreateWallet}
        />

        {/* Approval Dialog */}
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent className="sm:max-w-[425px] rounded-lg bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Approve Wallet Creation
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                Review and approve or reject the creation of a new custodial
                wallet.
              </DialogDescription>
            </DialogHeader>
            {walletToApprove && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-4 py-4"
              >
                <div className="grid gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Wallet Name:
                  </span>{" "}
                  {walletToApprove.name}
                </div>
                <div className="grid gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    User:
                  </span>{" "}
                  {walletToApprove.userName} ({walletToApprove.userEmail})
                </div>
                <div className="grid gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Type:
                  </span>{" "}
                  {walletToApprove.type}
                </div>
                <div className="grid gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Created At:
                  </span>{" "}
                  {walletToApprove.createdAt}
                </div>
              </motion.div>
            )}
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowApprovalDialog(false)}
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectWallet}
                className="hover:bg-red-700"
              >
                Reject
              </Button>
              <Button
                onClick={handleApproveWallet}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}