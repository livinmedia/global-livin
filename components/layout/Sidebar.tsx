'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserClaims, hasRole } from '@/lib/supabase'

function NavIcon({ href, children, label, active, badge }: {
  href: string; children: React.ReactNode; label: string; active: boolean; badge?: number
}) {
  return (
    <Link href={href} title={label}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', position: 'relative',
        background: active ? '#1A2744' : 'transparent',
      }}>
        <div style={{ color: active ? '#D85A30' : '#4A5568' }}>{children}</div>
        {badge && badge > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2, width: 14, height: 14,
            background: '#D85A30', borderRadius: '50%', fontSize: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700
          }}>{badge}</span>
        )}
      </div>
    </Link>
  )
}

function Divider() {
  return <div style={{ width: 28, borderTop: '1px solid #1A2744', margin: '4px 0' }} />
}

function Label({ text }: { text: string }) {
  return <div style={{ fontSize: 7, color: '#4A5568', letterSpacing: 1.5, textAlign: 'center', margin: '4px 0 2px' }}>{text}</div>
}

const I = {
  feed: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>,
  target: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
  table: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  grid: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  edit: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  mail: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  chat: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
}

export default function Sidebar({ claims }: { claims: UserClaims | null }) {
  const p = usePathname()
  const isRecruiter = hasRole(claims, 'rkrt')
  const isMM = claims?.spokes.some(s => s.slug === 'livin' && s.role === 'market_mayor')

  return (
    <div style={{
      width: 56, display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '12px 0', background: '#0D1528', borderRight: '1px solid #1A2744',
      flexShrink: 0, height: '100vh', position: 'sticky', top: 0
    }}>
      <Link href="/feed">
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #D85A30, #EF9F27)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 7, fontWeight: 700, color: 'white', letterSpacing: 0.5,
          marginBottom: 20, cursor: 'pointer'
        }}>LIVIN</div>
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', flex: 1 }}>
        <NavIcon href="/feed" label="Feed" active={p === '/feed' || p === '/'}>{I.feed}</NavIcon>

        {isRecruiter && (<>
          <Divider /><Label text="RECRUIT" />
          <NavIcon href="/recruit" label="Dashboard" active={p === '/recruit'}>{I.target}</NavIcon>
          <NavIcon href="/recruit/leads" label="Leads" active={p === '/recruit/leads'}>{I.table}</NavIcon>
          <NavIcon href="/recruit/pipeline" label="Pipeline" active={p === '/recruit/pipeline'}>{I.grid}</NavIcon>
        </>)}

        {isMM && (<>
          <Divider /><Label text="MY CITY" />
          <NavIcon href="/city" label="City" active={p === '/city'}>{I.grid}</NavIcon>
          <NavIcon href="/city/content" label="Content" active={p === '/city/content'}>{I.edit}</NavIcon>
        </>)}

        <Divider />
        <NavIcon href="/inbox" label="Inbox" active={p === '/inbox'} badge={4}>{I.mail}</NavIcon>
        <NavIcon href="/chat" label="Chat" active={p === '/chat'}>{I.chat}</NavIcon>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #1A2744' }}>
        <Link href="/settings">
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: '#D85A30',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: 'white', cursor: 'pointer'
          }}>{claims?.full_name?.split(' ').map(n => n[0]).join('').substring(0,2) || '?'}</div>
        </Link>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: '#00D4AA',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative'
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0B1120' }}>R</span>
          <span style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, background: '#00D4AA', border: '2px solid #0D1528', borderRadius: '50%' }} />
        </div>
      </div>
    </div>
  )
}
