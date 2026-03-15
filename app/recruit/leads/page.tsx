'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { createHubClient, UserClaims } from '@/lib/supabase'

export default function LeadsPage() {
  const [claims, setClaims] = useState<UserClaims | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createHubClient()
  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) { const { data } = await supabase.rpc('get_user_spoke_claims', { user_email: session.user.email }); if (data) setClaims(data) }
      setLoading(false)
    }
    load()
  }, [])
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#4A5568' }}>Loading...</div>
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar claims={claims} />
      <main style={{ flex: 1, padding: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Leads</div>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#4A5568', marginBottom: 8 }}>Your leads from RKRT will appear here</div>
          <div style={{ fontSize: 12, color: '#4A5568' }}>Cross-database API routes connecting leads from app.rkrt.in</div>
        </div>
      </main>
    </div>
  )
}
