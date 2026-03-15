'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { createHubClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createHubClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    }
    window.location.href = '/feed'
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0B1120' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #D85A30, #EF9F27)', fontSize: 18, fontWeight: 700, color: 'white', letterSpacing: 2, marginBottom: 12 }}>LIVIN</div>
          <div style={{ fontSize: 14, color: '#4A5568' }}>One platform. Every role. One feed.</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, textAlign: 'center' }}>{isSignup ? 'Create your account' : 'Welcome back'}</div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#4A5568', display: 'block', marginBottom: 4 }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#4A5568', display: 'block', marginBottom: 4 }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required minLength={6} />
            </div>
            {error && <div style={{ fontSize: 12, color: '#E24B4A', background: 'rgba(226,75,74,0.1)', padding: '8px 12px', borderRadius: 8, marginBottom: 14 }}>{error}</div>}
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: 12, fontSize: 14, fontWeight: 600 }} disabled={loading}>{loading ? 'Loading...' : isSignup ? 'Create account' : 'Sign in'}</button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <span style={{ fontSize: 13, color: '#4A5568' }}>{isSignup ? 'Already have an account? ' : "Don't have an account? "}</span>
              <span onClick={() => setIsSignup(!isSignup)} style={{ fontSize: 13, color: '#D85A30', cursor: 'pointer' }}>{isSignup ? 'Sign in' : 'Sign up'}</span>
            </div>
          </div>
        </form>
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#4A5568' }}>Powered by LIVI — AI CEO of LIVIN Media</div>
      </div>
    </div>
  )
}
