'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Jogo, Palpite } from '@/types'
import { bandeiraPais } from '@/lib/bandeiras'

interface Props {
  jogo: Jogo
  palpiteExistente?: Palpite | null
  ligaId?: string
  onSalvo?: (palpite: Palpite) => void
}

export function PalpiteForm({ jogo, palpiteExistente, ligaId, onSalvo }: Props) {
  const [golsCasa, setGolsCasa] = useState(palpiteExistente?.gols_casa ?? 0)
  const [golsFora, setGolsFora] = useState(palpiteExistente?.gols_fora ?? 0)
  const [overUnder, setOverUnder] = useState<'over' | 'under' | undefined>(palpiteExistente?.over_under)
  const [vaiProrrogacao, setVaiProrrogacao] = useState<boolean | undefined>(palpiteExistente?.vai_prorrogacao)
  const [vaiPenaltis, setVaiPenaltis] = useState<boolean | undefined>(palpiteExistente?.vai_penaltis)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const supabase = createClient()

  async function salvar() {
    setSalvando(true)
    setErro('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setErro('Não autenticado'); setSalvando(false); return }

    const payload = {
      user_id: user.id,
      jogo_id: jogo.id,
      liga_id: ligaId ?? null,
      gols_casa: golsCasa,
      gols_fora: golsFora,
      over_under: overUnder ?? null,
      over_under_valor: overUnder ? 2.5 : null,
      vai_prorrogacao: jogo.fase !== 'grupos' ? vaiProrrogacao ?? null : null,
      vai_penaltis: jogo.fase !== 'grupos' ? vaiPenaltis ?? null : null,
    }

    let result
    if (palpiteExistente) {
      result = await supabase.from('palpites').update(payload).eq('id', palpiteExistente.id).select().single()
    } else {
      result = await supabase.from('palpites').insert(payload).select().single()
    }

    if (result.error) { setErro('Erro: ' + result.error.message) }
    else { setSucesso(true); onSalvo?.(result.data) }
    setSalvando(false)
  }

  const btnStyle = (active: boolean) => ({
    flex: 1,
    padding: '8px',
    borderRadius: '10px',
    border: `2px solid ${active ? '#009c3b' : '#1e4028'}`,
    background: active ? 'rgba(0,156,59,0.15)' : 'rgba(0,0,0,0.2)',
    color: active ? '#009c3b' : '#6b7280',
    fontWeight: active ? 'bold' : 'normal',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontSize: '13px',
  } as React.CSSProperties)

  return (
    <div className="rounded-2xl p-5 border space-y-5" style={{ background: '#132b1a', borderColor: '#1e4028' }}>
      {/* Seleções e placar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-2 flex-1">
          <span className="text-5xl">{bandeiraPais(jogo.selecao_casa?.codigo ?? '')}</span>
          <span className="text-sm font-bold text-white">{jogo.selecao_casa?.nome ?? 'Casa'}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1" style={{ color: '#6b7280' }}>Casa</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setGolsCasa(Math.max(0, golsCasa - 1))}
                className="w-7 h-7 rounded-lg font-bold text-lg flex items-center justify-center"
                style={{ background: '#1e4028', color: '#009c3b' }}>-</button>
              <span className="text-3xl font-black w-10 text-center text-white">{golsCasa}</span>
              <button onClick={() => setGolsCasa(golsCasa + 1)}
                className="w-7 h-7 rounded-lg font-bold text-lg flex items-center justify-center"
                style={{ background: '#1e4028', color: '#009c3b' }}>+</button>
            </div>
          </div>
          <span className="text-2xl font-black" style={{ color: '#FFDF00' }}>×</span>
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1" style={{ color: '#6b7280' }}>Fora</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setGolsFora(Math.max(0, golsFora - 1))}
                className="w-7 h-7 rounded-lg font-bold text-lg flex items-center justify-center"
                style={{ background: '#1e4028', color: '#009c3b' }}>-</button>
              <span className="text-3xl font-black w-10 text-center text-white">{golsFora}</span>
              <button onClick={() => setGolsFora(golsFora + 1)}
                className="w-7 h-7 rounded-lg font-bold text-lg flex items-center justify-center"
                style={{ background: '#1e4028', color: '#009c3b' }}>+</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <span className="text-5xl">{bandeiraPais(jogo.selecao_fora?.codigo ?? '')}</span>
          <span className="text-sm font-bold text-white">{jogo.selecao_fora?.nome ?? 'Fora'}</span>
        </div>
      </div>

      {/* Palpites extras */}
      <div className="border-t pt-4 space-y-3" style={{ borderColor: '#1e4028' }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#009c3b' }}>
          ⚡ Palpites extras (mais pontos!)
        </p>

        {jogo.fase !== 'grupos' && (
          <>
            <div>
              <p className="text-xs mb-2" style={{ color: '#6b7280' }}>Vai para prorrogação?</p>
              <div className="flex gap-2">
                {[true, false].map(v => (
                  <button key={String(v)} onClick={() => setVaiProrrogacao(vaiProrrogacao === v ? undefined : v)}
                    style={btnStyle(vaiProrrogacao === v)}>
                    {v ? '✅ Sim' : '❌ Não'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs mb-2" style={{ color: '#6b7280' }}>Vai para pênaltis?</p>
              <div className="flex gap-2">
                {[true, false].map(v => (
                  <button key={String(v)} onClick={() => setVaiPenaltis(vaiPenaltis === v ? undefined : v)}
                    style={btnStyle(vaiPenaltis === v)}>
                    {v ? '✅ Sim' : '❌ Não'}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {erro && <p className="text-sm text-red-400">{erro}</p>}
      {sucesso && <p className="text-sm font-bold" style={{ color: '#009c3b' }}>✅ Palpite salvo!</p>}

      <button onClick={salvar} disabled={salvando}
        className="w-full py-4 rounded-xl font-black text-lg transition-all hover:scale-[1.02] disabled:opacity-50"
        style={{ background: salvando ? '#1e4028' : '#009c3b', color: '#fff', boxShadow: '0 0 20px rgba(0,156,59,0.3)' }}>
        {salvando ? 'Salvando...' : palpiteExistente ? '✏️ Atualizar Palpite' : '⚽ Confirmar Palpite'}
      </button>
    </div>
  )
}
