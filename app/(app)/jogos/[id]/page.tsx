import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PalpiteForm } from '@/components/palpite-form'
import { bandeiraPais } from '@/lib/bandeiras'
import { formatarData, formatarHora, prazoPassou } from '@/lib/utils-date'
import type { Jogo, Palpite } from '@/types'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ liga?: string }>
}

export default async function JogoPage({ params, searchParams }: Props) {
  const { id } = await params
  const { liga: ligaId } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: jogo } = await supabase
    .from('jogos')
    .select('*, selecao_casa:selecoes!jogos_selecao_casa_id_fkey(*), selecao_fora:selecoes!jogos_selecao_fora_id_fkey(*)')
    .eq('id', id)
    .single()

  if (!jogo) notFound()

  let palpiteQuery = supabase.from('palpites').select('*').eq('jogo_id', id).eq('user_id', user.id)
  if (ligaId) {
    palpiteQuery = palpiteQuery.eq('liga_id', ligaId)
  } else {
    palpiteQuery = palpiteQuery.is('liga_id', null)
  }
  const { data: palpite } = await palpiteQuery.maybeSingle()

  const fechado = prazoPassou(jogo.prazo_palpite)
  const j = jogo as Jogo

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
          {j.fase === 'grupos' ? `Fase de Grupos — Grupo ${j.grupo}` : j.fase.charAt(0).toUpperCase() + j.fase.slice(1)}
        </p>
        <p className="text-sm text-zinc-400">{formatarData(j.data_hora)}</p>
        <p className="text-2xl font-bold text-white">{formatarHora(j.data_hora)}</p>
      </div>

      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-5xl">{bandeiraPais(j.selecao_casa?.codigo ?? '')}</div>
          <div className="text-sm font-bold text-white mt-1">{j.selecao_casa?.nome ?? '??'}</div>
        </div>
        {j.status !== 'agendado' ? (
          <div className="text-4xl font-black text-white font-mono">
            {j.gols_casa} — {j.gols_fora}
          </div>
        ) : (
          <div className="text-xl text-zinc-500">VS</div>
        )}
        <div className="text-center">
          <div className="text-5xl">{bandeiraPais(j.selecao_fora?.codigo ?? '')}</div>
          <div className="text-sm font-bold text-white mt-1">{j.selecao_fora?.nome ?? '??'}</div>
        </div>
      </div>

      {j.status === 'agendado' && !fechado ? (
        <PalpiteForm jogo={j} palpiteExistente={palpite as Palpite | null} ligaId={ligaId} />
      ) : j.status === 'agendado' && fechado ? (
        <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 font-bold">Prazo de palpite encerrado</p>
          {palpite ? (
            <p className="text-zinc-400 mt-2">Seu palpite: {palpite.gols_casa} × {palpite.gols_fora}</p>
          ) : (
            <p className="text-zinc-500 text-sm mt-2">Você não fez palpite para este jogo</p>
          )}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
          {palpite ? (
            <>
              <p className="text-zinc-400">Seu palpite: <span className="text-white font-bold">{palpite.gols_casa} × {palpite.gols_fora}</span></p>
              {palpite.processado && (
                <p className="text-2xl font-black text-yellow-400 mt-2">+{palpite.pontos} pontos</p>
              )}
            </>
          ) : (
            <p className="text-zinc-500">Você não fez palpite para este jogo</p>
          )}
        </div>
      )}
    </div>
  )
}
