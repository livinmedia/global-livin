'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { createHubClient, UserClaims } from '@/lib/supabase'

export default function RecruitDashboard() {
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
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Recruiting command center</div>
        <p style={{ fontSize: 13, color: '#4A5568', marginBottom: 20 }}>Your leads, pipeline, and outreach — powered by AI.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[{ l: 'Total leads', v: '--', c: '#00D4AA' }, { l: 'Hot', v: '--', c: '#E24B4A' }, { l: 'Emails sent', v: '--', c: '#E2E8F0' }, { l: 'Reply rate', v: '--', c: '#00D4AA' }].map((s, i) => (
            <div key={i} className="stat-card"><div style={{ fontSize: 11, color: '#4A5568' }}>{s.l}</div><div style={{ fontSize: 22, fontWeight: 600, color: s.c }}>{s.v}</div></div>
          ))}
        </div>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#4A5568', marginBottom: 8 }}>Recruiting data loading from RKRT...</div>
          <div style={{ fontSize: 12, color: '#4A5568' }}>This dashboard mirrors your app.rkrt.in data. Cross-database API routes connecting next.</div>
        </div>
        <div style={{ marginTop: 20, padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, rgba(83,74,183,0.1), rgba(0,212,170,0.1))', border: '1px solid rgba(83,74,183,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#00D4AA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#0B1120' }}>R</div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Rue</span>
          </div>
          <div style={{ fontSize: 13, color: '#B4B2A9', paddingLeft: 32 }}>Welcome to your recruiting command center on LIVIN. Your RKRT data is being connected. Check the feed for community activity!</div>
        </div>
      </main>
    </div>
  )
}
