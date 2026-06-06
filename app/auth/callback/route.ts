import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    if (data.user) {
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', data.user.id).maybeSingle()
      if (!profile) {
        const username = data.user.email?.split('@')[0]?.replace(/[^a-z0-9_]/g, '') ?? 'user'
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username: `${username}_${Date.now().toString(36)}`,
          nome_completo: data.user.user_metadata?.full_name,
          avatar_url: data.user.user_metadata?.avatar_url,
        })
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
