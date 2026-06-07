import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buscarJogosDaCopa, mapearStatus } from '@/lib/football-api'

const supabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const authHeader = request.headers.get('authorization')
  const querySecret = searchParams.get('secret')
  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    querySecret === process.env.CRON_SECRET

  if (!isAuthorized) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = supabaseAdmin()

  try {
    const dados = await buscarJogosDaCopa()

    if (!dados.matches) {
      return NextResponse.json({ ok: false, erro: 'Sem dados da API' })
    }

    let sincronizados = 0

    for (const jogo of dados.matches) {
      const status = mapearStatus(jogo.status)
      const dataHora = new Date(jogo.utcDate)
      const prazo = new Date(dataHora.getTime() - 60 * 60 * 1000)

      const casaId = await obterOuCriarSelecao(supabase, jogo.homeTeam)
      const foraId = await obterOuCriarSelecao(supabase, jogo.awayTeam)

      if (!casaId || !foraId) continue

      const jogoData = {
        id_externo: jogo.id,
        selecao_casa_id: casaId,
        selecao_fora_id: foraId,
        data_hora: jogo.utcDate,
        prazo_palpite: prazo.toISOString(),
        fase: mapearFase(jogo.stage),
        grupo: jogo.group?.replace('GROUP_', '') ?? null,
        rodada: jogo.matchday ?? null,
        status,
        gols_casa: jogo.score?.fullTime?.home ?? null,
        gols_fora: jogo.score?.fullTime?.away ?? null,
        prorrogacao: jogo.score?.duration === 'EXTRA_TIME' || jogo.score?.duration === 'PENALTY_SHOOTOUT',
        penaltis: jogo.score?.duration === 'PENALTY_SHOOTOUT',
        penaltis_casa: jogo.score?.penalties?.home ?? null,
        penaltis_fora: jogo.score?.penalties?.away ?? null,
        updated_at: new Date().toISOString(),
      }

      await supabase.from('jogos').upsert(jogoData, { onConflict: 'id_externo' })

      if (status === 'encerrado') {
        const { data: jogoDb } = await supabase.from('jogos').select('id').eq('id_externo', jogo.id).single()
        if (jogoDb) await calcularPontosJogo(supabase, jogoDb.id)
      }

      sincronizados++
    }

    return NextResponse.json({ ok: true, sincronizados })
  } catch (err) {
    console.error('Sync error:', err)
    return NextResponse.json({ ok: false, erro: String(err) }, { status: 500 })
  }
}

async function obterOuCriarSelecao(supabase: any, team: { id: number; name: string; tla: string }) {
  if (!team?.id) return null
  const { data } = await supabase.from('selecoes').select('id').eq('codigo', team.tla).maybeSingle()
  if (data) return data.id

  const { data: nova } = await supabase.from('selecoes')
    .insert({ nome: team.name, codigo: team.tla })
    .select('id').single()
  return nova?.id ?? null
}

function mapearFase(stage: string): string {
  const mapa: Record<string, string> = {
    'GROUP_STAGE': 'grupos',
    'ROUND_OF_16': 'oitavas',
    'QUARTER_FINALS': 'quartas',
    'SEMI_FINALS': 'semi',
    'THIRD_PLACE': 'terceiro',
    'FINAL': 'final',
  }
  return mapa[stage] ?? 'grupos'
}

async function calcularPontosJogo(supabase: any, jogoId: string) {
  const { data: palpites } = await supabase
    .from('palpites')
    .select('id')
    .eq('jogo_id', jogoId)
    .eq('processado', false)

  for (const p of palpites ?? []) {
    await supabase.rpc('calcular_pontos_palpite', { palpite_id: p.id })
  }
}
