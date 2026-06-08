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
    const eventos = await buscarTodosJogos()
    if (!eventos.length) {
      return NextResponse.json({ ok: false, erro: 'Nenhum jogo retornado' })
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
      const status = mapearStatus(competition.status?.type?.name ?? '')
      const golsCasa = homeTeam.score !== undefined && homeTeam.score !== '' ? parseInt(homeTeam.score) : null
      const golsFora = awayTeam.score !== undefined && awayTeam.score !== '' ? parseInt(awayTeam.score) : null
      const nomeFase = evento.name ?? evento.shortName ?? ''

      await supabase.from('jogos').upsert({
        id_externo: parseInt(evento.id),
        selecao_casa_id: casaId,
        selecao_fora_id: foraId,
        data_hora: dataHora.toISOString(),
        prazo_palpite: prazo.toISOString(),
        fase: mapearFase(nomeFase),
        grupo: extrairGrupo(nomeFase),
        rodada: evento.week?.number ?? null,
        status,
        gols_casa: golsCasa,
        gols_fora: golsFora,
        prorrogacao: false,
        penaltis: false,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id_externo' })

      if (status === 'encerrado') {
        const { data: jogoDb } = await supabase.from('jogos').select('id').eq('id_externo', parseInt(evento.id)).single()
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

async function buscarTodosJogos(): Promise<any[]> {
  let todos: any[] = []

  // Busca por cada dia da Copa (11 Jun a 19 Jul 2026)
  const datas = gerarDatas('2026-06-11', '2026-07-19')

  for (const data of datas) {
    try {
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${data}`,
        { cache: 'no-store' }
      )
      if (!res.ok) continue
      const json = await res.json()
      if (json.events?.length) {
        todos = [...todos, ...json.events]
      }
    } catch {}
  }

  return todos
}

function gerarDatas(inicio: string, fim: string): string[] {
  const datas: string[] = []
  const d = new Date(inicio)
  const end = new Date(fim)
  while (d <= end) {
    const ano = d.getFullYear()
    const mes = String(d.getMonth() + 1).padStart(2, '0')
    const dia = String(d.getDate()).padStart(2, '0')
    datas.push(`${ano}${mes}${dia}`)
    d.setDate(d.getDate() + 1)
  }
  return datas
}

async function obterOuCriarSelecao(supabase: any, team: any) {
  if (!team?.abbreviation) return null
  const codigo = team.abbreviation.toUpperCase().slice(0, 3)
  const { data } = await supabase.from('selecoes').select('id').eq('codigo', codigo).maybeSingle()
  if (data) return data.id
  const { data: nova } = await supabase.from('selecoes')
    .insert({ nome: team.displayName ?? team.name, codigo })
    .select('id').single()
  return nova?.id ?? null
}

function mapearStatus(status: string): string {
  if (status === 'STATUS_FINAL') return 'encerrado'
  if (['STATUS_IN_PROGRESS', 'STATUS_HALFTIME'].includes(status)) return 'ao_vivo'
  if (['STATUS_CANCELED', 'STATUS_POSTPONED'].includes(status)) return 'cancelado'
  return 'agendado'
}

function mapearFase(nome: string): string {
  const n = nome.toLowerCase()
  if (n.includes('final') && !n.includes('semi') && !n.includes('quarter') && !n.includes('third')) return 'final'
  if (n.includes('semi')) return 'semi'
  if (n.includes('quarter')) return 'quartas'
  if (n.includes('round of 16')) return 'oitavas'
  if (n.includes('round of 32')) return 'oitavas'
  if (n.includes('third')) return 'terceiro'
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
