'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { createHubClient, UserClaims } from '@/lib/supabase'

export default function InboxPage() {
  const [claims, setClaims] = useState<UserClaims | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createHubClient()
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) { const { data } = await supabase.rpc('get_user_spoke_claims', { user_email: user.email }); if (data) setClaims(data) }
      setLoading(false)
    }
    load()
  }, [])
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#4A5568' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar claims={claims} />
      <main style={{ flex: 1, padding: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Inbox</div>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, color: '#E2E8F0' }}>Your inbox is empty</div>
          <div style={{ fontSize: 13, color: '#4A5568', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>When you receive emails from leads, partners, or system notifications, they will appear here. All your @rkrt.in and @livin.in emails in one unified inbox.</div>
        </div>
      </main>
    </div>
  )
}
