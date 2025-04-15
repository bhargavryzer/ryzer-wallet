import { DashboardLayout } from "@/components/dashboard-layout"
import { WalletDashboard } from "@/components/wallet-dashboard"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <WalletDashboard />
    </DashboardLayout>
  )
}
