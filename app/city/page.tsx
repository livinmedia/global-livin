'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { createHubClient, UserClaims } from '@/lib/supabase'
// removed createClient import

interface CityData {
  name: string; slug: string; state_abbr: string; has_market_mayor: boolean;
  mm_claimed: boolean; articles: number; partners: number; leads: number;
  content_status: string; mm_tier: string;
}

export default function CityDashboard() {
  const [claims, setClaims] = useState<UserClaims | null>(null)
  const [cities, setCities] = useState<CityData[]>([])
  const [selected, setSelected] = useState<CityData | null>(null)
  const [articles, setArticles] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'overview' | 'city'>('overview')
  const supabase = createHubClient()

  // removed: const livin = createClient(
    process.env.NEXT_PUBLIC_LIVIN_SUPABASE_URL || 'https://bmemtekrchzoxpwtaufd.supabase.co',
    process.env.NEXT_PUBLIC_LIVIN_SUPABASE_ANON_KEY || ''
  )

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        const { data } = await supabase.rpc('get_user_spoke_claims', { user_email: session.user.email })
        if (data) setClaims(data)
      }
      await loadCities()
      setLoading(false)
    }
    load()
  }, [])

  async function loadCities() {
    try {
      const res = await fetch('https://bmemtekrchzoxpwtaufd.supabase.co/rest/v1/rpc/get_city_dashboard_data', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'apikey': process.env.NEXT_PUBLIC_LIVIN_SUPABASE_ANON_KEY || '' }
      })
    } catch(e) {}
    // Fallback: fetch cities directly
    const res = await fetch('https://bmemtekrchzoxpwtaufd.supabase.co/rest/v1/cities?select=name,slug,has_market_mayor,mm_claimed,content_status,mm_tier,state_region_id&is_active=eq.true&order=name', {
      headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZW10ZWtyY2h6b3hwd3RhdWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzYwNjQsImV4cCI6MjA4ODAxMjA2NH0.4mVNMV0Z8cMcR4OaZbYABMCFLGCMXVxMaSTLYPFpnPY' }
    })
    if (res.ok) {
      const data = await res.json()
      // Enrich with article counts
      const citiesWithCounts: CityData[] = data.map((c: any) => ({
        ...c, state_abbr: '', articles: 0, partners: 0, leads: 0
      }))
      setCities(citiesWithCounts)
    }
  }

  async function selectCity(city: CityData) {
    setSelected(city)
    setView('city')
    // Load articles for this city
    const res = await fetch(`https://bmemtekrchzoxpwtaufd.supabase.co/rest/v1/content_records?city_id=eq.${city.slug}&select=id,title,content_type,status,created_at&order=created_at.desc&limit=20`, {
      headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZW10ZWtyY2h6b3hwd3RhdWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzYwNjQsImV4cCI6MjA4ODAxMjA2NH0.4mVNMV0Z8cMcR4OaZbYABMCFLGCMXVxMaSTLYPFpnPY' }
    })
    if (res.ok) setArticles(await res.json())
    // Load partners
    const pRes = await fetch(`https://bmemtekrchzoxpwtaufd.supabase.co/rest/v1/market_vendor_partners?city_id=eq.${city.slug}&select=*&limit=20`, {
      headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZW10ZWtyY2h6b3hwd3RhdWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzYwNjQsImV4cCI6MjA4ODAxMjA2NH0.4mVNMV0Z8cMcR4OaZbYABMCFLGCMXVxMaSTLYPFpnPY' }
    })
    if (pRes.ok) setPartners(await pRes.json())
  }

  const isOwner = claims?.spokes.some(s => s.role === 'owner')

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#4A5568' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar claims={claims} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #1A2744' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ padding: '4px 12px', fontSize: 11, borderRadius: 20, border: '1px solid #D85A30', background: 'rgba(216,90,48,0.15)', color: '#D85A30', fontWeight: 500 }}>
              {isOwner ? 'Admin — All Cities' : 'My City'}
            </span>
            {selected && (
              <>
                <span style={{ color: '#4A5568' }}>/</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#D85A30' }}>{selected.name}</span>
              </>
            )}
          </div>
          {selected && (
            <button onClick={() => { setSelected(null); setView('overview') }} className="btn-ghost" style={{ padding: '4px 12px', fontSize: 11 }}>
              ← All cities
            </button>
          )}
        </div>

        {/* OVERVIEW — City grid */}
        {view === 'overview' && (
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>LIVIN Cities</div>
            <div style={{ fontSize: 13, color: '#4A5568', marginBottom: 20 }}>{cities.length} cities • Select one to manage</div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
              <div className="stat-card"><div style={{ fontSize: 11, color: '#4A5568' }}>Total cities</div><div style={{ fontSize: 22, fontWeight: 600, color: '#D85A30' }}>{cities.length}</div></div>
              <div className="stat-card"><div style={{ fontSize: 11, color: '#4A5568' }}>With Market Mayor</div><div style={{ fontSize: 22, fontWeight: 600, color: '#00D4AA' }}>{cities.filter(c => c.has_market_mayor).length}</div></div>
              <div className="stat-card"><div style={{ fontSize: 11, color: '#4A5568' }}>Unclaimed</div><div style={{ fontSize: 22, fontWeight: 600, color: '#EF9F27' }}>{cities.filter(c => !c.mm_claimed).length}</div></div>
              <div className="stat-card"><div style={{ fontSize: 11, color: '#4A5568' }}>With content</div><div style={{ fontSize: 22, fontWeight: 600 }}>{cities.filter(c => c.content_status !== 'pending').length || '—'}</div></div>
            </div>

            {/* City grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {cities.map(city => (
                <div key={city.slug} onClick={() => selectCity(city)} className="card" style={{ cursor: 'pointer', transition: 'border-color 0.2s', padding: 14 }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#D85A30')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1A2744')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{city.name}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {city.has_market_mayor && <span style={{ fontSize: 8, padding: '2px 6px', background: 'rgba(216,90,48,0.15)', color: '#D85A30', borderRadius: 4 }}>MM</span>}
                      {city.mm_claimed && <span style={{ fontSize: 8, padding: '2px 6px', background: 'rgba(0,212,170,0.15)', color: '#00D4AA', borderRadius: 4 }}>claimed</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#4A5568' }}>
                    {city.content_status || 'pending'}
                    {city.mm_tier && <span> • {city.mm_tier}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CITY VIEW — selected city dashboard */}
        {view === 'city' && selected && (
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 22, fontWeight: 600 }}>{selected.name}</span>
              {selected.has_market_mayor && <span className="badge-mm" style={{ padding: '3px 10px' }}>Market Mayor</span>}
              {!selected.has_market_mayor && <span style={{ fontSize: 9, padding: '3px 10px', background: 'rgba(239,159,39,0.15)', color: '#EF9F27', borderRadius: 10 }}>No MM assigned</span>}
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
              <div className="stat-card"><div style={{ fontSize: 11, color: '#4A5568' }}>Articles</div><div style={{ fontSize: 22, fontWeight: 600, color: '#D85A30' }}>{articles.length}</div></div>
              <div className="stat-card"><div style={{ fontSize: 11, color: '#4A5568' }}>Partners</div><div style={{ fontSize: 22, fontWeight: 600, color: '#534AB7' }}>{partners.length}</div></div>
              <div className="stat-card"><div style={{ fontSize: 11, color: '#4A5568' }}>Status</div><div style={{ fontSize: 14, fontWeight: 600, color: '#00D4AA' }}>{selected.content_status || 'pending'}</div></div>
              <div className="stat-card"><div style={{ fontSize: 11, color: '#4A5568' }}>MM Tier</div><div style={{ fontSize: 14, fontWeight: 600 }}>{selected.mm_tier || 'none'}</div></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {/* Articles */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Content</span>
                  <span style={{ fontSize: 12, color: '#4A5568' }}>{articles.length} articles</span>
                </div>
                {articles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: '#4A5568', fontSize: 13 }}>No articles yet</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {articles.slice(0, 8).map((a: any) => (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1A2744' }}>
                        <span style={{ fontSize: 12, maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title || 'Untitled'}</span>
                        <span style={{ fontSize: 10, color: '#4A5568' }}>{a.content_type || a.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Partners */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Local partners</span>
                  <span style={{ fontSize: 12, color: '#4A5568' }}>{partners.length} active</span>
                </div>
                {partners.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: '#4A5568', fontSize: 13 }}>No partners yet</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {partners.map((p: any) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1A2744' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{p.business_name || p.name}</div>
                          <div style={{ fontSize: 10, color: '#4A5568' }}>{p.category || p.business_type}</div>
                        </div>
                        <span style={{ fontSize: 9, padding: '2px 8px', background: 'rgba(83,74,183,0.15)', color: '#AFA9EC', borderRadius: 10 }}>{p.tier || p.plan || 'basic'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* LIVI insight */}
            <div style={{ padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, rgba(216,90,48,0.08), rgba(239,159,39,0.08))', border: '1px solid rgba(216,90,48,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#D85A30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>L</div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>LIVI</span>
              </div>
              <div style={{ fontSize: 13, color: '#B4B2A9', paddingLeft: 32 }}>
                {selected.has_market_mayor
                  ? `${selected.name} has a Market Mayor. ${articles.length} articles published, ${partners.length} local partners active.`
                  : `${selected.name} needs a Market Mayor! This city has ${articles.length} articles but no one managing it. Great opportunity.`
                }
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
