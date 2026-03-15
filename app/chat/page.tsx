'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { createHubClient, UserClaims } from '@/lib/supabase'

export default function ChatPage() {
  const [claims, setClaims] = useState<UserClaims | null>(null)
  const [channels, setChannels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createHubClient()
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) { const { data } = await supabase.rpc('get_user_spoke_claims', { user_email: user.email }); if (data) setClaims(data) }
      const { data: ch } = await supabase.from('chat_channels').select('*').eq('is_archived', false).order('name')
      if (ch) setChannels(ch)
      setLoading(false)
    }
    load()
  }, [])
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#4A5568' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar claims={claims} />
      <main style={{ flex: 1, padding: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Chat</div>
        <div className="card" style={{ marginBottom: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#00D4AA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#0B1120' }}>R</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 13, fontWeight: 500 }}>Rue — your assistant</span><span style={{ fontSize: 9, padding: '1px 6px', background: 'rgba(0,212,170,0.15)', color: '#00D4AA', borderRadius: 4 }}>online</span></div>
            <div style={{ fontSize: 12, color: '#4A5568' }}>Ask me anything about your leads, pipeline, or city</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#4A5568', letterSpacing: 1, marginTop: 20, marginBottom: 8 }}>CHANNELS</div>
        {channels.map(ch => (
          <div key={ch.id} className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 12, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: ch.brand === 'rkrt' ? '#00D4AA' : ch.brand === 'livin' ? '#D85A30' : '#1A2744', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>{ch.name[0]}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{ch.name}</div><div style={{ fontSize: 11, color: '#4A5568' }}>{ch.description}</div></div>
            <span style={{ fontSize: 9, padding: '2px 6px', background: '#1A2744', color: '#4A5568', borderRadius: 4 }}>{ch.channel_type}</span>
          </div>
        ))}
      </main>
    </div>
  )
}
