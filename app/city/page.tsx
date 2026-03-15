'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { createHubClient, UserClaims, getSpoke } from '@/lib/supabase'

export default function CityDashboard() {
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
  const livinSpoke = getSpoke(claims, 'livin')
  const city = livinSpoke?.metadata?.city || 'Your City'
  const state = livinSpoke?.metadata?.state || ''
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#4A5568' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar claims={claims} />
      <main style={{ flex: 1, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 600 }}>{city}{state ? ', ' + state : ''}</span>
          <span className="badge-mm" style={{ padding: '3px 10px' }}>Market Mayor</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[{ l: 'Articles', v: '--', c: '#D85A30' }, { l: 'Leads', v: '--', c: '#534AB7' }, { l: 'Partners', v: '--', c: '#E2E8F0' }, { l: 'Revenue', v: '--', c: '#00D4AA' }].map((s, i) => (
            <div key={i} className="stat-card"><div style={{ fontSize: 11, color: '#4A5568' }}>{s.l}</div><div style={{ fontSize: 22, fontWeight: 600, color: s.c }}>{s.v}</div></div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div className="card"><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Neighborhoods</div><div style={{ textAlign: 'center', padding: '30px 0', color: '#4A5568', fontSize: 13 }}>LIVIN.in data connecting soon<br/><button className="btn-primary" style={{ marginTop: 12, padding: '8px 20px', fontSize: 12 }}>+ Add neighborhood</button></div></div>
          <div className="card"><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Content</div><div style={{ textAlign: 'center', padding: '30px 0', color: '#4A5568', fontSize: 13 }}>AI-drafted content will appear here for your review</div></div>
        </div>
        <div style={{ padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, rgba(216,90,48,0.08), rgba(239,159,39,0.08))', border: '1px solid rgba(216,90,48,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#D85A30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>L</div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>LIVI</span>
          </div>
          <div style={{ fontSize: 13, color: '#B4B2A9', paddingLeft: 32 }}>Welcome to your Market Mayor dashboard for {city}! Your LIVIN.in city data is being connected. Check the feed to connect with your community.</div>
        </div>
      </main>
    </div>
  )
}
