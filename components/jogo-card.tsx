'use client'
import Link from 'next/link'
import { bandeiraPais } from '@/lib/bandeiras'
import { formatarDataHora, prazoPassou } from '@/lib/utils-date'
import type { Jogo } from '@/types'

const FASE_LABEL: Record<string, string> = {
  grupos: 'Fase de Grupos',
  oitavas: 'Oitavas de Final',
  quartas: 'Quartas de Final',
  semi: 'Semifinal',
  terceiro: '3º Lugar',
  final: '⭐ FINAL',
}

interface Props {
  jogo: Jogo
  palpite?: { gols_casa: number; gols_fora: number; pontos?: number } | null
  ligaId?: string
}

export function JogoCard({ jogo, palpite, ligaId }: Props) {
  const fechado = prazoPassou(jogo.prazo_palpite)
  const href = ligaId ? `/jogos/${jogo.id}?liga=${ligaId}` : `/jogos/${jogo.id}`
  const aoVivo = jogo.status === 'ao_vivo'
  const encerrado = jogo.status === 'encerrado'

  return (
    <Link href={href}>
      <div className="rounded-2xl p-4 border transition-all hover:scale-[1.01] cursor-pointer"
        style={{
          background: aoVivo ? 'linear-gradient(135deg, #0f2318, #132b1a)' : '#132b1a',
          borderColor: aoVivo ? '#009c3b' : encerrado ? '#1e4028' : '#1e4028',
          boxShadow: aoVivo ? '0 0 20px rgba(0,156,59,0.2)' : 'none',
        }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.3)', color: '#9ca3af' }}>
            {FASE_LABEL[jogo.fase]}{jogo.grupo ? ` · Grupo ${jogo.grupo}` : ''}
          </span>
          {aoVivo ? (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: 'rgba(0,156,59,0.2)', color: '#009c3b' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              AO VIVO
            </span>
          ) : encerrado ? (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.3)', color: '#6b7280' }}>
              Encerrado
            </span>
          ) : (
            <span className="text-xs font-medium" style={{ color: '#FFDF00' }}>
              {formatarDataHora(jogo.data_hora)}
            </span>
          )}
        </div>

        {/* Placar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-4xl">{bandeiraPais(jogo.selecao_casa?.codigo ?? '')}</span>
            <span className="text-sm font-bold text-white">{jogo.selecao_casa?.codigo ?? '??'}</span>
          </div>

          <div className="flex flex-col items-center gap-1 min-w-[90px]">
            {aoVivo || encerrado ? (
              <span className="text-3xl font-black font-mono"
                style={{ color: aoVivo ? '#009c3b' : '#fff' }}>
                {jogo.gols_casa ?? 0} — {jogo.gols_fora ?? 0}
              </span>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold" style={{ color: '#FFDF00' }}>VS</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-4xl">{bandeiraPais(jogo.selecao_fora?.codigo ?? '')}</span>
            <span className="text-sm font-bold text-white">{jogo.selecao_fora?.codigo ?? '??'}</span>
          </div>
        </div>

        {/* Palpite do usuário */}
        {palpite && (
          <div className="mt-3 pt-3 border-t text-center" style={{ borderColor: '#1e4028' }}>
            <span className="text-xs" style={{ color: '#6b7280' }}>
              Seu palpite: <span className="text-white font-bold">{palpite.gols_casa} × {palpite.gols_fora}</span>
              {palpite.pontos !== undefined && encerrado && (
                <span className="ml-2 font-black" style={{ color: '#FFDF00' }}>+{palpite.pontos} pts</span>
              )}
            </span>
          </div>
        )}

        {/* CTA */}
        {!fechado && !palpite && jogo.status === 'agendado' && (
          <div className="mt-3 text-center">
            <span className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: 'rgba(0,156,59,0.15)', color: '#009c3b' }}>
              Toque para palpitar ⚡
            </span>
          </div>
        )}
        {fechado && !palpite && jogo.status === 'agendado' && (
          <div className="mt-3 text-center">
            <span className="text-xs" style={{ color: '#ef4444' }}>Prazo encerrado</span>
          </div>
        )}
      </div>
    </Link>
  )
}
