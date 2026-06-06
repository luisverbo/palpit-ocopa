import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const body = await request.json()
  const { jogo_id, liga_id, gols_casa, gols_fora, over_under, over_under_valor, vai_prorrogacao, vai_penaltis } = body

  const { data: jogo } = await supabase.from('jogos').select('prazo_palpite, status').eq('id', jogo_id).single()
  if (!jogo) return NextResponse.json({ erro: 'Jogo não encontrado' }, { status: 404 })
  if (new Date() > new Date(jogo.prazo_palpite)) return NextResponse.json({ erro: 'Prazo encerrado' }, { status: 400 })
  if (jogo.status !== 'agendado') return NextResponse.json({ erro: 'Jogo não está agendado' }, { status: 400 })

  const payload = {
    user_id: user.id,
    jogo_id,
    liga_id: liga_id ?? null,
    gols_casa: parseInt(gols_casa),
    gols_fora: parseInt(gols_fora),
    over_under: over_under ?? null,
    over_under_valor: over_under_valor ?? null,
    vai_prorrogacao: vai_prorrogacao ?? null,
    vai_penaltis: vai_penaltis ?? null,
  }

  const { data, error } = await supabase.from('palpites').upsert(payload, { onConflict: 'user_id,jogo_id,liga_id' }).select().single()
  if (error) return NextResponse.json({ erro: error.message }, { status: 400 })

  return NextResponse.json(data)
}
