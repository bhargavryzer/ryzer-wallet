"use client"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"

interface AppCardProps {
  name: string
  description: string
  icon: string
  tags?: string[]
}

// Add the AppCard component implementation
function AppCard({ name, description, icon, tags }: AppCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full border">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-gray-100">
            <img src={icon || "/placeholder.svg"} alt={`${name} icon`} className="h-full w-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="mt-auto">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            View Details
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AppsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Apps</h1>
            <p className="text-muted-foreground">Discover and use applications to enhance your wallet experience</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">All Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AppCard
                name="Reports"
                description="Create transaction and asset reports to manage finances effectively."
                icon="/business-reports-analysis.png"
              />

              <AppCard
                name="Batch Payouts"
                description="Batch Payouts is an application for making multiple transfers in one go."
                icon="/digital-wallet-batch.png"
              />

              <AppCard
                name="Staking"
                description="Staking is an application that allows you to easily and securely grow your assets in wallets on Cobo Portal."
                icon="/interconnected-growth.png"
                tags={["Cobo"]}
              />

              <AppCard
                name="Invoicing"
                description="Invoicing is an application for efficiently managing invoices and settlements."
                icon="/digital-invoice-flow.png"
                tags={["Cobo"]}
              />

              <AppCard
                name="HelloWorld"
                description="Demonstrate how to create a Cobo Portal app."
                icon="/digital-greeting.png"
                tags={["Cobo", "Developer"]}
              />

              <AppCard
                name="SuperLoop"
                description="SuperLoop is an off-exchange settlement network that allows institutions to trade on exchanges without worrying about counterparty risks."
                icon="/placeholder.svg?height=60&width=60&query=superloop"
                tags={["Cobo", "Trading"]}
              />
            </div>
          </div>

          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-700"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 18v-6" />
                    <path d="M8 18v-1" />
                    <path d="M16 18v-3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-800">Build your own app</h3>
                  <p className="text-blue-700">
                    Create custom applications to extend the functionality of your Ryzer wallet.
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
