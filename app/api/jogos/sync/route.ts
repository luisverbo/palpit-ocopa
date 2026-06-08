import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const authHeader = request.headers.get('authorization')
  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    searchParams.get('secret') === process.env.CRON_SECRET
  if (!isAuthorized) return new Response('Unauthorized', { status: 401 })

  const supabase = supabaseAdmin()

  try {
    // Busca todos os jogos da Copa 2026 pela ESPN API (gratuita, sem chave)
    const eventos = await buscarJogosESPN()
    if (!eventos.length) {
      return NextResponse.json({ ok: false, erro: 'Nenhum jogo retornado pela ESPN API' })
    }

    let sincronizados = 0

    for (const evento of eventos) {
      const competition = evento.competitions?.[0]
      if (!competition) continue

      const homeTeam = competition.competitors?.find((c: any) => c.homeAway === 'home')
      const awayTeam = competition.competitors?.find((c: any) => c.homeAway === 'away')
      if (!homeTeam || !awayTeam) continue

      const casaId = await obterOuCriarSelecao(supabase, homeTeam.team)
      const foraId = await obterOuCriarSelecao(supabase, awayTeam.team)
      if (!casaId || !foraId) continue

      const dataHora = new Date(evento.date)
      const prazo = new Date(dataHora.getTime() - 60 * 60 * 1000)
      const status = mapearStatusESPN(competition.status?.type?.name ?? '')

      const golsCasa = homeTeam.score ? parseInt(homeTeam.score) : null
      const golsFora = awayTeam.score ? parseInt(awayTeam.score) : null

      const jogoData = {
        id_externo: parseInt(evento.id),
        selecao_casa_id: casaId,
        selecao_fora_id: foraId,
        data_hora: dataHora.toISOString(),
        prazo_palpite: prazo.toISOString(),
        fase: mapearFaseESPN(evento.name ?? '', evento.season?.slug ?? ''),
        grupo: extrairGrupo(evento.name ?? ''),
        rodada: evento.week?.number ?? null,
        status,
        gols_casa: golsCasa,
        gols_fora: golsFora,
        prorrogacao: competition.status?.type?.shortDetail?.includes('ET') ?? false,
        penaltis: competition.status?.type?.shortDetail?.includes('PEN') ?? false,
        updated_at: new Date().toISOString(),
      }

      await supabase.from('jogos').upsert(jogoData, { onConflict: 'id_externo' })

      if (status === 'encerrado') {
        const { data: jogoDb } = await supabase.from('jogos').select('id').eq('id_externo', jogoData.id_externo).single()
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

async function buscarJogosESPN(): Promise<any[]> {
  const anos = ['20260611-20260630', '20260701-20260720']
  let todos: any[] = []

  for (const periodo of anos) {
    const [inicio, fim] = periodo.split('-')
    try {
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${inicio}-${fim}&limit=200`,
        { cache: 'no-store' }
      )
      const data = await res.json()
      if (data.events) todos = [...todos, ...data.events]
    } catch {}
  }

  // Fallback: tenta rota alternativa
  if (!todos.length) {
    try {
      const res = await fetch(
        'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?limit=200',
        { cache: 'no-store' }
      )
      const data = await res.json()
      if (data.events) todos = data.events
    } catch {}
  }

  return todos
}

async function obterOuCriarSelecao(supabase: any, team: { id: string; name: string; abbreviation: string; displayName: string }) {
  if (!team?.abbreviation) return null
  const codigo = team.abbreviation.toUpperCase().slice(0, 3)
  const { data } = await supabase.from('selecoes').select('id').eq('codigo', codigo).maybeSingle()
  if (data) return data.id
  const { data: nova } = await supabase.from('selecoes')
    .insert({ nome: team.displayName ?? team.name, codigo })
    .select('id').single()
  return nova?.id ?? null
}

function mapearStatusESPN(status: string): string {
  if (status === 'STATUS_FINAL') return 'encerrado'
  if (status === 'STATUS_IN_PROGRESS' || status === 'STATUS_HALFTIME') return 'ao_vivo'
  if (status === 'STATUS_CANCELED' || status === 'STATUS_POSTPONED') return 'cancelado'
  return 'agendado'
}

function mapearFaseESPN(nome: string, slug: string): string {
  const n = nome.toLowerCase()
  if (n.includes('final') && !n.includes('semi') && !n.includes('quarter') && !n.includes('third')) return 'final'
  if (n.includes('semi')) return 'semi'
  if (n.includes('quarter')) return 'quartas'
  if (n.includes('round of 16') || n.includes('oitavas')) return 'oitavas'
  if (n.includes('third')) return 'terceiro'
  if (n.includes('round of 32')) return 'oitavas'
  return 'grupos'
}

function extrairGrupo(nome: string): string | null {
  const match = nome.match(/group\s+([a-l])/i)
  return match ? match[1].toUpperCase() : null
}

async function calcularPontosJogo(supabase: any, jogoId: string) {
  const { data: palpites } = await supabase
    .from('palpites').select('id').eq('jogo_id', jogoId).eq('processado', false)
  for (const p of palpites ?? []) {
    await supabase.rpc('calcular_pontos_palpite', { palpite_id: p.id })
  }
}
