'use client'
import { useState, useEffect } from 'react'
import { createHubClient, UserClaims } from '@/lib/supabase'

interface FeedPost {
  id: string; author_name: string; author_role: string; author_badge_text: string;
  author_context: string; post_type: string; content: string;
  like_count: number; comment_count: number; ai_generated: boolean; created_at: string
}

const POST_TYPES = [
  { value: 'win', label: 'WIN', color: '#00D4AA' },
  { value: 'tip', label: 'TIP', color: '#EF9F27' },
  { value: 'question', label: 'QUESTION', color: '#534AB7' },
  { value: 'city_update', label: 'CITY UPDATE', color: '#D85A30' },
  { value: 'general', label: 'POST', color: '#4A5568' },
]

function getInitials(n: string) { return n.split(' ').map(x => x[0]).join('').substring(0,2).toUpperCase() }
function timeAgo(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 60) return m + 'm'; const h = Math.floor(m/60)
  if (h < 24) return h + 'h'; return Math.floor(h/24) + 'd'
}

function getBadge(role: string) {
  if (role === 'user') return 'badge-recruiter'
  if (role === 'market_mayor') return 'badge-mm'
  if (role === 'mvp_partner') return 'badge-mvp'
  if (role === 'ai_ceo' || role === 'ai_assistant') return 'badge-ai'
  return 'badge-explorer'
}

export default function FeedPage({ claims }: { claims: UserClaims | null }) {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [newPost, setNewPost] = useState('')
  const [postType, setPostType] = useState('general')
  const [loading, setLoading] = useState(true)
  const supabase = createHubClient()

  useEffect(() => {
    loadFeed()
    const channel = supabase.channel('feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feed_posts' },
        (payload) => { setPosts(prev => [payload.new as FeedPost, ...prev]) })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function loadFeed() {
    const { data } = await supabase.from('feed_posts').select('*')
      .eq('is_deleted', false).order('created_at', { ascending: false }).limit(50)
    if (data) setPosts(data)
    setLoading(false)
  }

  async function submitPost() {
    if (!newPost.trim() || !claims) return
    const spoke = claims.spokes[0]
    await supabase.from('feed_posts').insert({
      author_id: claims.global_user_id,
      author_name: claims.full_name,
      author_role: spoke?.role || 'explorer',
      author_badge_text: spoke?.role === 'market_mayor' ? 'Market Mayor' : spoke?.role === 'user' ? 'Recruiter' : 'Explorer',
      author_badge_color: spoke?.role === 'market_mayor' ? '#D85A30' : '#00D4AA',
      author_context: spoke?.metadata?.city ? spoke.metadata.city + ', ' + spoke.metadata.state : '',
      post_type: postType, content: newPost,
    })
    setNewPost(''); setPostType('general')
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px' }}>
      {claims && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#D85A30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>{getInitials(claims.full_name)}</div>
            <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Share a win, ask the community, drop a tip..." style={{ flex: 1, minHeight: 60, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 46 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {POST_TYPES.map(pt => (
                <span key={pt.value} onClick={() => setPostType(pt.value)} style={{
                  fontSize: 10, padding: '3px 10px', borderRadius: 12, cursor: 'pointer', fontWeight: 600,
                  background: postType === pt.value ? pt.color : '#1A2744',
                  color: postType === pt.value ? '#0B1120' : '#888',
                }}>{pt.label}</span>
              ))}
            </div>
            <button onClick={submitPost} className="btn-primary" style={{ padding: '6px 16px', fontSize: 12 }}>Post</button>
          </div>
        </div>
      )}
      {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#4A5568' }}>Loading feed...</div>
       : posts.length === 0 ? <div style={{ textAlign: 'center', padding: 40, color: '#4A5568' }}>The feed is empty. Be the first to post!</div>
       : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {posts.map(post => (
            <div key={post.id} className="card" style={{
              background: post.ai_generated ? 'linear-gradient(135deg, rgba(83,74,183,0.1), rgba(0,212,170,0.1))' : undefined,
              borderColor: post.ai_generated ? 'rgba(83,74,183,0.2)' : undefined,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: post.ai_generated ? 'linear-gradient(135deg, #00D4AA, #534AB7)' : '#D85A30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>{getInitials(post.author_name)}</div>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{post.author_name}</span>
                  {post.author_badge_text && <span className={getBadge(post.author_role)} style={{ marginLeft: 6, fontSize: 9, padding: '1px 6px', borderRadius: 4 }}>{post.author_badge_text}</span>}
                  {post.author_context && <span style={{ fontSize: 9, color: '#4A5568', marginLeft: 4 }}>{post.author_context}</span>}
                </div>
                <span style={{ fontSize: 10, color: '#4A5568', marginLeft: 'auto' }}>{timeAgo(post.created_at)}</span>
              </div>
              <div style={{ paddingLeft: 40 }}>
                {post.post_type !== 'general' && (
                  <span style={{ display: 'inline-block', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600, marginBottom: 6, background: POST_TYPES.find(pt => pt.value === post.post_type)?.color || '#4A5568', color: '#0B1120' }}>{post.post_type.replace('_', ' ').toUpperCase()}</span>
                )}
                <div style={{ fontSize: 13, color: '#B4B2A9', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{post.content}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <span style={{ fontSize: 11, color: '#4A5568', cursor: 'pointer' }}>{post.like_count} likes</span>
                  <span style={{ fontSize: 11, color: '#4A5568', cursor: 'pointer' }}>{post.comment_count} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
