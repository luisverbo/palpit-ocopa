'use client'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatarDataHora, prazoPassou } from '@/lib/utils-date'
import type { Jogo } from '@/types'
import { bandeiraPais } from '@/lib/bandeiras'

const FASE_LABEL: Record<string, string> = {
  grupos: 'Fase de Grupos',
  oitavas: 'Oitavas de Final',
  quartas: 'Quartas de Final',
  semi: 'Semifinal',
  terceiro: '3º Lugar',
  final: 'Final',
}

const STATUS_COLOR: Record<string, string> = {
  agendado: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ao_vivo: 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse',
  encerrado: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  cancelado: 'bg-red-500/20 text-red-400 border-red-500/30',
}

interface Props {
  jogo: Jogo
  palpite?: { gols_casa: number; gols_fora: number; pontos?: number } | null
  ligaId?: string
}

export function JogoCard({ jogo, palpite, ligaId }: Props) {
  const fechado = prazoPassou(jogo.prazo_palpite)
  const href = ligaId ? `/jogos/${jogo.id}?liga=${ligaId}` : `/jogos/${jogo.id}`

  return (
    <Link href={href}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-zinc-500">{FASE_LABEL[jogo.fase]}{jogo.grupo ? ` - Grupo ${jogo.grupo}` : ''}</span>
          <Badge className={`text-xs border ${STATUS_COLOR[jogo.status]}`}>
            {jogo.status === 'ao_vivo' ? '● AO VIVO' : jogo.status === 'encerrado' ? 'Encerrado' : formatarDataHora(jogo.data_hora)}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-3xl">{bandeiraPais(jogo.selecao_casa?.codigo ?? '')}</span>
            <span className="text-sm font-medium text-white">{jogo.selecao_casa?.codigo ?? '??'}</span>
          </div>

          <div className="flex flex-col items-center gap-1 min-w-[80px]">
            {jogo.status === 'encerrado' || jogo.status === 'ao_vivo' ? (
              <span className="text-2xl font-bold text-white font-mono">
                {jogo.gols_casa ?? 0} — {jogo.gols_fora ?? 0}
              </span>
            ) : (
              <span className="text-lg font-bold text-zinc-400">VS</span>
            )}
            {palpite && (
              <span className="text-xs text-zinc-500">
                Palpite: {palpite.gols_casa}×{palpite.gols_fora}
                {palpite.pontos !== undefined && jogo.status === 'encerrado' && (
                  <span className="ml-1 text-yellow-400 font-bold">+{palpite.pontos}pts</span>
                )}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-3xl">{bandeiraPais(jogo.selecao_fora?.codigo ?? '')}</span>
            <span className="text-sm font-medium text-white">{jogo.selecao_fora?.codigo ?? '??'}</span>
          </div>
        </div>

        {!fechado && jogo.status === 'agendado' && (
          <div className="mt-3 text-center">
            <span className="text-xs text-green-400">Clique para palpitar</span>
          </div>
        )}
        {fechado && !palpite && jogo.status === 'agendado' && (
          <div className="mt-3 text-center">
            <span className="text-xs text-red-400">Prazo encerrado</span>
          </div>
        )}
      </div>
    </Link>
  )
}
