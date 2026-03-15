import { createClient } from '@supabase/supabase-js'

export function createHubClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function createRkrtClient() {
  return createClient(
    process.env.RKRT_SUPABASE_URL!,
    process.env.RKRT_SUPABASE_ANON_KEY!
  )
}

export function createLivinClient() {
  return createClient(
    process.env.LIVIN_SUPABASE_URL!,
    process.env.LIVIN_SUPABASE_ANON_KEY!
  )
}

export interface UserSpoke {
  slug: string
  role: string
  plan: string
  permissions: string[]
  metadata: Record<string, any>
}

export interface UserClaims {
  global_user_id: string
  full_name: string
  global_plan: string
  spokes: UserSpoke[]
}

export function hasRole(claims: UserClaims | null, spokeSlug: string): boolean {
  if (!claims) return false
  return claims.spokes.some(s => s.slug === spokeSlug)
}

export function getSpoke(claims: UserClaims | null, spokeSlug: string): UserSpoke | undefined {
  if (!claims) return undefined
  return claims.spokes.find(s => s.slug === spokeSlug)
}

export function hasPermission(claims: UserClaims | null, spokeSlug: string, permission: string): boolean {
  const spoke = getSpoke(claims, spokeSlug)
  if (!spoke) return false
  return spoke.permissions.includes(permission) || spoke.permissions.includes('*')
}
