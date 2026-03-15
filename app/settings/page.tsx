'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import { createHubClient, UserClaims } from '@/lib/supabase'

export default function SettingsPage() {
  const [claims, setClaims] = useState<UserClaims | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createHubClient()
  const router = useRouter()
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) { const { data } = await supabase.rpc('get_user_spoke_claims', { user_email: user.email }); if (data) setClaims(data) }
      setLoading(false)
    }
    load()
  }, [])
  async function handleLogout() { await supabase.auth.signOut(); router.push('/login') }

  function getSpokeColor(slug: string) {
    if (slug === 'rkrt') return { bg: 'rgba(0,212,170,0.15)', color: '#00D4AA', label: 'RKRT' }
    if (slug === 'livin') return { bg: 'rgba(216,90,48,0.15)', color: '#D85A30', label: 'LIVIN' }
    return { bg: 'rgba(83,74,183,0.15)', color: '#AFA9EC', label: 'LIVI' }
  }
  function getRoleLabel(s: any) {
    if (s.role === 'user') return 'Recruiter'
    if (s.role === 'market_mayor') return 'Market Mayor' + (s.metadata?.city ? ' — ' + s.metadata.city + ', ' + s.metadata.state : '')
    if (s.role === 'owner') return 'Owner'
    return s.role
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#4A5568' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar claims={claims} />
      <main style={{ flex: 1, padding: 20, maxWidth: 600 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Settings</div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#D85A30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'white' }}>{claims?.full_name?.split(' ').map(n => n[0]).join('').substring(0,2) || '?'}</div>
          <div><div style={{ fontSize: 18, fontWeight: 600 }}>{claims?.full_name}</div><div style={{ fontSize: 13, color: '#4A5568' }}>Plan: {claims?.global_plan}</div></div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Your roles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {claims?.spokes.map((s, i) => {
            const sc = getSpokeColor(s.slug)
            return (
              <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 10, background: sc.bg, color: sc.color, fontWeight: 600 }}>{sc.label}</span>
                  <span style={{ fontSize: 13 }}>{getRoleLabel(s)}</span>
                </div>
                <span style={{ fontSize: 11, color: '#4A5568' }}>{s.plan}</span>
              </div>
            )
          })}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Permissions</div>
        <div className="card" style={{ marginBottom: 24 }}>
          {claims?.spokes.map((s, i) => (
            <div key={i} style={{ marginBottom: i < (claims?.spokes.length || 0) - 1 ? 12 : 0 }}>
              <div style={{ fontSize: 11, color: getSpokeColor(s.slug).color, marginBottom: 4, fontWeight: 600 }}>{s.slug.toUpperCase()}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {s.permissions.map((p, j) => <span key={j} style={{ fontSize: 10, padding: '2px 8px', background: '#1A2744', borderRadius: 4, color: '#888' }}>{p}</span>)}
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleLogout} className="btn-ghost" style={{ width: '100%', padding: 12, fontSize: 14, color: '#E24B4A', borderColor: 'rgba(226,75,74,0.3)' }}>Sign out</button>
      </main>
    </div>
  )
}
