'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import FeedPage from '@/components/feed/FeedPage'
import { createHubClient, UserClaims } from '@/lib/supabase'

export default function Feed() {
  const [claims, setClaims] = useState<UserClaims | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createHubClient()

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user?.email) {
          const { data } = await supabase.rpc('get_user_spoke_claims', { user_email: session.user.email })
          if (data) setClaims(data)
        }
      } catch (e) {
        console.error('Failed to load claims:', e)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#4A5568' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #D85A30, #EF9F27)', fontSize: 14, fontWeight: 700, color: 'white', letterSpacing: 1, marginBottom: 12 }}>LIVIN</div>
        <div>Loading your dashboard...</div>
      </div>
    </div>
  )

  if (!claims) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#4A5568' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 12 }}>Not signed in</div>
        <a href="/login" style={{ color: '#D85A30' }}>Go to login</a>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar claims={claims} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #1A2744' }}>
          <span style={{ padding: '4px 12px', fontSize: 11, borderRadius: 20, border: '1px solid #D85A30', background: 'rgba(216,90,48,0.15)', color: '#D85A30', fontWeight: 500 }}>Feed</span>
          <span style={{ fontSize: 11, color: '#4A5568' }}>{claims.full_name} • {claims.spokes.map(s => s.role).join(' + ')}</span>
        </div>
        <FeedPage claims={claims} />
      </main>
    </div>
  )
}
