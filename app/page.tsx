import { AdminProvider } from "@/lib/admin-context"
import { StandingsTable } from "@/components/standings-table"

export default function Home() {
  return (
    <AdminProvider>
      <main className="min-h-screen bg-background">
        <StandingsTable />
      </main>
    </AdminProvider>
  )
}
