'use client'
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
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.rpc('get_user_spoke_claims', { user_email: user.email })
        if (data) setClaims(data)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#4A5568' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar claims={claims} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #1A2744' }}>
          <span style={{ padding: '4px 12px', fontSize: 11, borderRadius: 20, border: '1px solid #D85A30', background: 'rgba(216,90,48,0.15)', color: '#D85A30', fontWeight: 500 }}>Feed</span>
          <span style={{ fontSize: 11, color: '#4A5568' }}>{claims ? claims.full_name : 'Not logged in'}</span>
        </div>
        <FeedPage claims={claims} />
      </main>
    </div>
  )
}
