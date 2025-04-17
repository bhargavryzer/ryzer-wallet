"use client";

import { useState, Dispatch, SetStateAction } from "react";
import {
  ChevronDown,
  Info,
  X,
  Plus,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  Edit,
  Key,
  Users,
  Shield,
  Filter,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Checkbox } from "@/components/ui/checkbox";

// Interfaces
interface Vault {
  id: string;
  name: string;
  type: string;
  status: "active" | "pending" | "frozen";
  created: string;
  mainGroupCreated: boolean;
  userId: string;
  userName: string;
  userEmail: string;
  threshold: string;
}

interface Project {
  id: string;
  name: string;
  status: "active" | "pending" | "frozen";
  created: string;
  userId: string;
  userName: string;
  userEmail: string;
  threshold: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface VaultInfoCardProps {
  name: string;
  type: string;
  status: "active" | "pending" | "frozen";
  created: string;
  mainGroupCreated: boolean;
  id: string;
  userName?: string;
  userEmail?: string;
  threshold?: string;
  onApprove?: () => void;
  onFreeze?: () => void;
}

// Sample data
const vaults: Vault[] = [
  {
    id: "vault-1",
    name: "Enterprise Vault",
    type: "Organization-Controlled",
    status: "active",
    created: "2025-03-10",
    mainGroupCreated: true,
    userId: "user-1",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    threshold: "2/2",
  },
  {
    id: "vault-2",
    name: "Pending Vault",
    type: "Organization-Controlled",
    status: "pending",
    created: "2025-04-15",
    mainGroupCreated: false,
    userId: "user-2",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@example.com",
    threshold: "2/3",
  },
  {
    id: "vault-3",
    name: "Frozen Vault",
    type: "Organization-Controlled",
    status: "frozen",
    created: "2025-04-01",
    mainGroupCreated: true,
    userId: "user-3",
    userName: "Michael Brown",
    userEmail: "m.brown@example.com",
    threshold: "2/2",
  },
];

const projects: Project[] = [
  {
    id: "project-1",
    name: "User Project",
    status: "active",
    created: "2025-03-12",
    userId: "user-4",
    userName: "Emily Davis",
    userEmail: "emily.d@example.com",
    threshold: "2/3",
  },
];

const users: User[] = [
  { id: "all", name: "All Users", email: "" },
  { id: "user-1", name: "John Smith", email: "john.smith@example.com" },
  { id: "user-2", name: "Sarah Johnson", email: "sarah.j@example.com" },
  { id: "user-3", name: "Michael Brown", email: "m.brown@example.com" },
  { id: "user-4", name: "Emily Davis", email: "emily.d@example.com" },
];

// Enhanced VaultInfoCard component
const VaultInfoCard: React.FC<VaultInfoCardProps> = ({
  name,
  type,
  status,
  created,
  mainGroupCreated,
  id,
  userName,
  userEmail,
  threshold,
  onApprove,
  onFreeze,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            {type}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {userName && userEmail && (
            <p className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">User:</span>{" "}
              <Link
                href={`/admin/users/${id}`}
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {userName}
              </Link>{" "}
              <span className="text-gray-500 dark:text-gray-400">({userEmail})</span>
            </p>
          )}
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
          <p className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span> {created}
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Main Group:</span>{" "}
            {mainGroupCreated ? "Created" : "Not Created"}
          </p>
          {threshold && (
            <p className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">Threshold:</span>{" "}
              {threshold}
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
                <Shield className="mr-2 h-4 w-4" /> {status === "active" ? "Freeze" : "Unfreeze"}
              </Button>
            )
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default function AdminMPCWalletsPage() {
  const [showCreateVault, setShowCreateVault] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateMainGroup, setShowCreateMainGroup] = useState(false);
  const [showVaultInfo, setShowVaultInfo] = useState(true);
  const [showProjectInfo, setShowProjectInfo] = useState(true);
  const [showMainGroupInfo, setShowMainGroupInfo] = useState(true);
  const [showSecurityVerification, setShowSecurityVerification] = useState(false);
  const [showMainGroupRequired, setShowMainGroupRequired] = useState(false);
  const [showKeyShareVerification, setShowKeyShareVerification] = useState(false);
  const [showHelpTopics, setShowHelpTopics] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [threshold, setThreshold] = useState("2/2");
  const [activeTab, setActiveTab] = useState<"organization" | "user">("organization");
  const [keyShareTab, setKeyShareTab] = useState<"main" | "signing" | "recovery">("main");
  const [activeVault, setActiveVault] = useState<Vault | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [itemToApprove, setItemToApprove] = useState<Vault | Project | null>(null);

  // Filter vaults and projects
  const filteredVaults = vaults.filter(
    (vault) =>
      (searchQuery === "" ||
        vault.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vault.userName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedUser === "all" || vault.userId === selectedUser)
  );

  const filteredProjects = projects.filter(
    (project) =>
      (searchQuery === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.userName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedUser === "all" || project.userId === selectedUser)
  );

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Selection handlers
  const handleSelectAllItems = (checked: boolean) => {
    if (checked) {
      const allIds =
        activeTab === "organization"
          ? filteredVaults.map((vault) => vault.id)
          : filteredProjects.map((project) => project.id);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  // Bulk actions
  const handleBulkFreeze = () => {
    console.log("Freezing items:", selectedItems);
    setSelectedItems([]);
  };

  const handleBulkUnfreeze = () => {
    console.log("Unfreezing items:", selectedItems);
    setSelectedItems([]);
  };

  // Approval actions
  const handleOpenApprovalDialog = (item: Vault | Project) => {
    setItemToApprove(item);
    setShowApprovalDialog(true);
  };

  const handleApproveItem = () => {
    if (itemToApprove) {
      console.log("Approving item:", itemToApprove.id);
    }
    setShowApprovalDialog(false);
    setItemToApprove(null);
  };

  const handleRejectItem = () => {
    if (itemToApprove) {
      console.log("Rejecting item:", itemToApprove.id);
    }
    setShowApprovalDialog(false);
    setItemToApprove(null);
  };

  const handleVaultCreated = () => {
    const newVault: Vault = {
      id: `vault-${Date.now()}`,
      name: projectName || "New Vault",
      type: "Organization-Controlled",
      status: "pending",
      created: new Date().toISOString().split("T")[0],
      mainGroupCreated: false,
      userId: "user-1",
      userName: "John Smith",
      userEmail: "john.smith@example.com",
      threshold,
    };
    setActiveVault(newVault);
    setShowCreateVault(false);
    setProjectName("");
  };

  const handleMainGroupCreated = () => {
    setShowCreateMainGroup(false);
    if (activeVault) {
      setActiveVault({ ...activeVault, mainGroupCreated: true });
    }
  };

  const handleProjectCreated = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: projectName || "New Project",
      status: "pending",
      created: new Date().toISOString().split("T")[0],
      userId: "user-1",
      userName: "John Smith",
      userEmail: "john.smith@example.com",
      threshold,
    };
    setShowCreateProject(false);
    setProjectName("");
  };

  const handleKeyShareTabChange = (value: string) => {
    if (["main", "signing", "recovery"].includes(value)) {
      setKeyShareTab(value as "main" | "signing" | "recovery");
    }
  };

  const handleActiveTabChange = (value: string) => {
    if (["organization", "user"].includes(value)) {
      setActiveTab(value as "organization" | "user");
    }
  };

  const renderVaultDetails = () => {
    if (!activeVault) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-3">
              <Key className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {activeVault.name}
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="text-sm border-gray-300 dark:border-gray-600">
                  {activeVault.type}
                </Badge>
                <Badge
                  className={
                    activeVault.status === "active"
                      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300"
                      : activeVault.status === "frozen"
                      ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300"
                  }
                >
                  {activeVault.status.charAt(0).toUpperCase() + activeVault.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                User:{" "}
                <Link
                  href={`/admin/users/${activeVault.userId}`}
                  className="text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {activeVault.userName}
                </Link>{" "}
                ({activeVault.userEmail})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-11 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Vault
            </Button>
            <Button className="h-11 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Wallet
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-xl bg-white dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Extended Public Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!activeVault.mainGroupCreated ? (
              <Alert variant="default" className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <AlertTitle className="text-yellow-800 dark:text-yellow-200">
                  Main Group Required
                </AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                  Please create a Main Group to generate extended public keys.
                  <Button
                    variant="link"
                    className="p-0 text-indigo-600 dark:text-indigo-400 h-auto mt-2"
                    onClick={() => setShowCreateMainGroup(true)}
                  >
                    Create Now
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-700 p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Extended Public Key (xpub)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      xpub6CUGRUo...HTDM
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            onClick={() => copyToClipboard("xpub6CUGRUo...HTDM")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View on explorer</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Key Share Management
              </CardTitle>
              <Button
                variant="outline"
                className="h-11 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowKeyShareVerification(true)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Key Share Verification
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={keyShareTab} onValueChange={handleKeyShareTabChange} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <TabsTrigger
                  value="main"
                  className="text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Main Group
                </TabsTrigger>
                <TabsTrigger
                  value="signing"
                  className="text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Signing Groups
                </TabsTrigger>
                <TabsTrigger
                  value="recovery"
                  className="text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Recovery Groups
                </TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="mt-6">
                {!activeVault?.mainGroupCreated ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <Image
                      src="/digital-wallet-batch.png"
                      alt="Main Group"
                      width={80}
                      height={80}
                      className="mb-6"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Please create a Main Group first
                    </h3>
                    <Button
                      className="mb-8 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-transform"
                      onClick={() => setShowCreateMainGroup(true)}
                    >
                      Create Main Group
                    </Button>

                    {showMainGroupInfo && (
                      <div className="w-full max-w-2xl rounded-lg bg-gray-50 dark:bg-gray-700 p-5">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="flex items-center text-base font-semibold text-gray-900 dark:text-gray-100">
                            <Info className="mr-2 h-4 w-4" />
                            What is a Main Group?
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMainGroupInfo(false)}
                          >
                            Collapse <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                          The Main Group is used to sign transactions and to create Signing Groups and Recovery Groups.
                        </p>
                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                          It operates on a 2-of-2 scheme, where Cobo and the organization each hold one key share.
                        </p>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-sm text-indigo-600 dark:text-indigo-400"
                        >
                          Learn More
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    <Alert
                      variant="default"
                      className="border-green-300 bg-green-50 dark:bg-green-900"
                    >
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <AlertTitle className="text-green-800 dark:text-green-200">
                        Main Group Created
                      </AlertTitle>
                      <AlertDescription className="text-green-700 dark:text-green-300">
                        Your Main Group is active and ready for wallet creation and key share management.
                      </AlertDescription>
                    </Alert>

                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100 dark:bg-gray-800">
                          <TableHead className="text-gray-900 dark:text-gray-100">
                            Key Share Holder
                          </TableHead>
                          <TableHead className="text-gray-900 dark:text-gray-100">Type</TableHead>
                          <TableHead className="text-gray-900 dark:text-gray-100">Status</TableHead>
                          <TableHead className="text-gray-900 dark:text-gray-100">
                            Last Active
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                            Cobo
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            TSS Test Node
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            Just now
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                            Organization
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            API Node
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            Just now
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="signing" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <Image
                    src="/interconnected-growth.png"
                    alt="Signing Groups"
                    width={80}
                    height={80}
                    className="mb-6"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    No Signing Groups Created
                  </h3>
                  <p className="mb-4 max-w-md text-center text-sm text-gray-600 dark:text-gray-400">
                    Signing Groups allow you to delegate transaction signing capabilities to specific groups of users.
                  </p>
                  <Button
                    disabled={!activeVault?.mainGroupCreated}
                    onClick={() => !activeVault?.mainGroupCreated && setShowMainGroupRequired(true)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Signing Group
                  </Button>
                </motion.div>
              </TabsContent>

              <TabsContent value="recovery" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <Image
                    src="/digital-invoice-flow.png"
                    alt="Recovery Groups"
                    width={80}
                    height={80}
                    className="mb-6"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    No Recovery Groups Created
                  </h3>
                  <p className="mb-4 max-w-md text-center text-sm text-gray-600 dark:text-gray-400">
                    Recovery Groups provide a secure way to recover access to your wallets in case of emergency.
                  </p>
                  <Button
                    disabled={!activeVault?.mainGroupCreated}
                    onClick={() => !activeVault?.mainGroupCreated && setShowMainGroupRequired(true)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Recovery Group
                  </Button>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderVaultCreation = () => {
    return (
      <Card className="border-none shadow-xl bg-white dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold">
                Admin: MPC Wallets Overview
              </CardTitle>
              <CardDescription className="text-sm text-gray-100">
                Manage all MPC vaults and projects with advanced security controls.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              className="h-10 text-white hover:bg-indigo-600"
              onClick={() => setShowHelpTopics(true)}
            >
              <Info className="mr-2 h-4 w-4" />
              Introduction and Demo
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 text-white border-white/20 hover:bg-indigo-600"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
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
                    How to Approve Vault Creation?
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Approval guide</TooltipContent>
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
                  placeholder="Search by name or user"
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
                onClick={() => setShowCreateVault(true)}
              >
                Create Vault
              </Button>
            </div>
          </motion.div>

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg"
              >
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{selectedItems.length}</span> item(s) selected
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

          <Tabs value={activeTab} onValueChange={handleActiveTabChange} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <TabsTrigger
                value="organization"
                className="text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm"
              >
                Organization-Controlled
              </TabsTrigger>
              <TabsTrigger
                value="user"
                className="text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm"
              >
                User-Controlled
              </TabsTrigger>
            </TabsList>
            <TabsContent value="organization" className="pt-6">
              {filteredVaults.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No vaults found matching your search.
                </motion.div>
              ) : viewMode === "list" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100 dark:bg-gray-800">
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedItems.length === filteredVaults.length &&
                              filteredVaults.length > 0
                            }
                            onCheckedChange={handleSelectAllItems}
                            aria-label="Select all vaults"
                          />
                        </TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-100">Vault</TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-100">User</TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-100">
                          Vault ID
                        </TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-100">Status</TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-100">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVaults.map((vault) => (
                        <motion.tr
                          key={vault.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(vault.id)}
                              onCheckedChange={(checked) => handleSelectItem(vault.id, !!checked)}
                              aria-label={`Select vault ${vault.name}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {vault.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {vault.type}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Link
                                href={`/admin/users/${vault.userId}`}
                                className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                              >
                                {vault.userName}
                              </Link>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {vault.userEmail}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                {vault.id}
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                      onClick={() => copyToClipboard(vault.id)}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Copy vault ID</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                vault.status === "active"
                                  ? "default"
                                  : vault.status === "frozen"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {vault.status.charAt(0).toUpperCase() + vault.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {vault.status === "pending" ? (
                                <>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                          onClick={() => handleOpenApprovalDialog(vault)}
                                        >
                                          <Check className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Approve vault</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                          onClick={() => handleOpenApprovalDialog(vault)}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Reject vault</TooltipContent>
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
                                          onClick={() => setActiveVault(vault)}
                                        >
                                          <Info className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>View details</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                          onClick={() =>
                                            vault.status === "active"
                                              ? console.log("Freeze vault:", vault.id)
                                              : console.log("Unfreeze vault:", vault.id)
                                          }
                                        >
                                          <Shield className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {vault.status === "active" ? "Freeze vault" : "Unfreeze vault"}
                                      </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Link href={`/admin/vaults/${vault.id}`}>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                        </Link>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit vault</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {filteredVaults.map((vault) => (
                    <VaultInfoCard
                      key={vault.id}
                      name={vault.name}
                      type={vault.type}
                      status={vault.status}
                      created={vault.created}
                      mainGroupCreated={vault.mainGroupCreated}
                      id={vault.id}
                      userName={vault.userName}
                      userEmail={vault.userEmail}
                      threshold={vault.threshold}
                      onApprove={() => handleOpenApprovalDialog(vault)}
                      onFreeze={() =>
                        vault.status === "active"
                          ? console.log("Freeze vault:", vault.id)
                          : console.log("Unfreeze vault:", vault.id)
                      }
                    />
                  ))}
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6 text-sm text-gray-500 dark:text-gray-400"
              >
                Showing {filteredVaults.length} of {vaults.length} vaults
              </motion.div>
            </TabsContent>
            <TabsContent value="user" className="pt-6">
              {filteredProjects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No projects found matching your search.
                </motion.div>
              ) : viewMode === "list" ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100 dark:bg-gray-800">
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedItems.length === filteredProjects.length &&
                              filteredProjects.length > 0
                            }
                            onCheckedChange={handleSelectAllItems}
                            aria-label="Select all projects"
                          />
                        </TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-100">Project</TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-100">User</TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-100">
                          Project ID
                        </TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-100">Status</TableHead>
                        <TableHead className="text-gray-900 dark:text-gray-100">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <motion.tr
                          key={project.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(project.id)}
                              onCheckedChange={(checked) =>
                                handleSelectItem(project.id, !!checked)
                              }
                              aria-label={`Select project ${project.name}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {project.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                User-Controlled
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Link
                                href={`/admin/users/${project.userId}`}
                                className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                              >
                                {project.userName}
                              </Link>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {project.userEmail}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                {project.id}
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                      onClick={() => copyToClipboard(project.id)}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Copy project ID</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.status === "active"
                                  ? "default"
                                  : project.status === "frozen"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {project.status === "pending" ? (
                                <>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                          onClick={() => handleOpenApprovalDialog(project)}
                                        >
                                          <Check className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Approve project</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                          onClick={() => handleOpenApprovalDialog(project)}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Reject project</TooltipContent>
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
                                          <Info className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>View details</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                          onClick={() =>
                                            project.status === "active"
                                              ? console.log("Freeze project:", project.id)
                                              : console.log("Unfreeze project:", project.id)
                                          }
                                        >
                                          <Shield className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {project.status === "active"
                                          ? "Freeze project"
                                          : "Unfreeze project"}
                                      </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Link href={`/admin/projects/${project.id}`}>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                        </Link>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit project</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {filteredProjects.map((project) => (
                    <VaultInfoCard
                      key={project.id}
                      name={project.name}
                      type="User-Controlled"
                      status={project.status}
                      created={project.created}
                      mainGroupCreated={false}
                      id={project.id}
                      userName={project.userName}
                      userEmail={project.userEmail}
                      threshold={project.threshold}
                      onApprove={() => handleOpenApprovalDialog(project)}
                      onFreeze={() =>
                        project.status === "active"
                          ? console.log("Freeze project:", project.id)
                          : console.log("Unfreeze project:", project.id)
                      }
                    />
                  ))}
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6 text-sm text-gray-500 dark:text-gray-400"
              >
                Showing {filteredProjects.length} of {projects.length} projects
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Admin: MPC Wallets
              </h1>
              <Badge className="bg-indigo-600 text-white">Admin</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage all MPC vaults and projects with advanced security controls
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              <span className="font-semibold">Vaults:</span> {vaults.length}
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              <span className="font-semibold">Projects:</span> {projects.length}
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              <span className="font-semibold">Users:</span>{" "}
              {new Set([...vaults.map((v) => v.userId), ...projects.map((p) => p.userId)]).size}
            </span>
          </div>
        </motion.div>

        {activeVault ? renderVaultDetails() : renderVaultCreation()}

        <Dialog open={showCreateVault} onOpenChange={setShowCreateVault}>
          <DialogContent className="sm:max-w-md rounded-lg bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create Vault
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowCreateVault(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="vault-name" className="text-gray-700 dark:text-gray-300">
                  Vault Name
                </Label>
                <Input
                  id="vault-name"
                  placeholder="Enter vault name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="h-11 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold" className="text-gray-700 dark:text-gray-300">
                  Threshold Signature Scheme
                </Label>
                <Select value={threshold} onValueChange={setThreshold}>
                  <SelectTrigger
                    id="threshold"
                    className="h-11 rounded-lg border-gray-300 dark:border-gray-600"
                  >
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2/2">2-of-2</SelectItem>
                    <SelectItem value="2/3">2-of-3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This will create a vault with a {threshold} threshold signature scheme, requiring
                multiple parties to sign transactions.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-11 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowCreateVault(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-11 bg-indigo-600 hover:bg-indigo-700"
                onClick={handleVaultCreated}
                disabled={!projectName}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCreateMainGroup} onOpenChange={setShowCreateMainGroup}>
          <DialogContent className="sm:max-w-md rounded-lg bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create Main Group
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowCreateMainGroup(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label className="text-gray-700 dark:text-gray-300">Key Share Holders</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-2">
                        <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Cobo
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">TSS Test Node</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Ready
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-2">
                        <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Organization
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">API Node</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowSecurityVerification(true)}
                    >
                      Set Up
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-11 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowCreateMainGroup(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-11 bg-indigo-600 hover:bg-indigo-700"
                onClick={handleMainGroupCreated}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showSecurityVerification} onOpenChange={setShowSecurityVerification}>
          <DialogContent className="sm:max-w-md rounded-lg bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Security Verification
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowSecurityVerification(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <Alert
                variant="default"
                className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900"
              >
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <AlertTitle className="text-yellow-800 dark:text-yellow-200">
                  Cobo Guard Setup Required
                </AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                  For the security of your assets, please set up Cobo Guard first.
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 dark:bg-indigo-900 p-2">
                    <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      Cobo Guard
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="h-11 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Set Up
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showMainGroupRequired} onOpenChange={setShowMainGroupRequired}>
          <DialogContent className="sm:max-w-xs rounded-lg bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Main Group Required
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowMainGroupRequired(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Please set up the Main Group before creating Recovery Groups.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="h-11 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setShowMainGroupRequired(false)}
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showKeyShareVerification} onOpenChange={setShowKeyShareVerification}>
          <DialogContent className="sm:max-w-4xl rounded-lg bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Key Share Verification
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowKeyShareVerification(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4 flex justify-end">
                <Button
                  variant="outline"
                  className="h-11 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-gray-800">
                    <TableHead className="text-gray-900 dark:text-gray-100">Group</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">
                      Key Share Holder
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Status</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">
                      Verification Time
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Image
                          src="/digital-wallet-batch.png"
                          alt="No Data"
                          width={60}
                          height={60}
                          className="mb-4"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No Data to Display
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showHelpTopics} onOpenChange={setShowHelpTopics}>
          <DialogContent className="sm:max-w-3xl rounded-lg bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Help Topics
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowHelpTopics(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 border-r pr-4">
                <div className="rounded-md bg-indigo-100 dark:bg-indigo-900 p-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Introduction and Demo for Creating MPC Wallets
                </div>
              </div>
              <div className="col-span-3 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Introduction and Demo for Creating MPC Wallets
                </h3>
                <div className="aspect-video overflow-hidden rounded-lg bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Introduction to Cobo's MPC Wallets"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="h-11 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Guide
                  </Button>
                  <Button
                    className="h-11 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setShowHelpTopics(false)}
                  >
                    Got It
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
          <DialogContent className="sm:max-w-md rounded-lg bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create User-Controlled Project
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowCreateProject(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name" className="text-gray-700 dark:text-gray-300">
                  Project Name
                </Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter a name for your project"
                  className="h-11 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold" className="text-gray-700 dark:text-gray-300">
                  Threshold of Signing Group</Label>
                <Select value={threshold} onValueChange={setThreshold}>
                  <SelectTrigger id="threshold" className="h-10">
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2/2">2/2</SelectItem>
                    <SelectItem value="2/3">2/3</SelectItem>
                    <SelectItem value="3/3">3/3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                When creating a project, you need to set up a threshold signature scheme among the key share holders.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => setShowCreateProject(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-10"
                onClick={handleProjectCreated}
                disabled={!projectName}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve {itemToApprove && "name" in itemToApprove ? "Vault" : "Project"} Creation</DialogTitle>
              <DialogDescription>
                Review and approve or reject the creation of a new MPC {itemToApprove && "name" in itemToApprove ? "vault" : "project"}.
              </DialogDescription>
            </DialogHeader>
            {itemToApprove && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <span className="font-medium">Name:</span> {itemToApprove.name}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium">User:</span>{" "}
                  <Link href={`/admin/users/${itemToApprove.userId}`} className="hover:underline">
                    {itemToApprove.userName}
                  </Link> ({itemToApprove.userEmail})
                </div>
                <div className="grid gap-2">
                  <span className="font-medium">Type:</span>{" "}
                  {"type" in itemToApprove ? itemToApprove.type : "User-Controlled"}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium">Threshold:</span> {itemToApprove.threshold}
                </div>
                <div className="grid gap-2">
                  <span className="font-medium">Created At:</span> {itemToApprove.created}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectItem}>
                Reject
              </Button>
              <Button onClick={handleApproveItem}>Approve</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}