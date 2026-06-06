'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

    if (result.error) {
      setErro('Erro ao salvar: ' + result.error.message)
    } else {
      setSucesso(true)
      onSalvo?.(result.data)
    }
    setSalvando(false)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-2 flex-1">
          <span className="text-4xl">{bandeiraPais(jogo.selecao_casa?.codigo ?? '')}</span>
          <span className="text-sm text-zinc-400">{jogo.selecao_casa?.nome ?? 'Casa'}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <Label className="text-xs text-zinc-500 mb-1">Casa</Label>
            <Input
              type="number"
              min={0}
              max={20}
              value={golsCasa}
              onChange={e => setGolsCasa(parseInt(e.target.value) || 0)}
              className="w-16 text-center text-xl font-bold bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <span className="text-2xl text-zinc-500 mt-4">×</span>
          <div className="flex flex-col items-center">
            <Label className="text-xs text-zinc-500 mb-1">Fora</Label>
            <Input
              type="number"
              min={0}
              max={20}
              value={golsFora}
              onChange={e => setGolsFora(parseInt(e.target.value) || 0)}
              className="w-16 text-center text-xl font-bold bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <span className="text-4xl">{bandeiraPais(jogo.selecao_fora?.codigo ?? '')}</span>
          <span className="text-sm text-zinc-400">{jogo.selecao_fora?.nome ?? 'Fora'}</span>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-4 space-y-3">
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Palpites extras (+pontos)</p>

        <div>
          <Label className="text-xs text-zinc-400">Total de gols (2.5)</Label>
          <div className="flex gap-2 mt-1">
            {(['over', 'under'] as const).map(o => (
              <button
                key={o}
                onClick={() => setOverUnder(overUnder === o ? undefined : o)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${overUnder === o ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
              >
                {o === 'over' ? 'Over +2.5' : 'Under -2.5'}
              </button>
            ))}
          </div>
        </div>

        {jogo.fase !== 'grupos' && (
          <>
            <div>
              <Label className="text-xs text-zinc-400">Vai para prorrogação?</Label>
              <div className="flex gap-2 mt-1">
                {[true, false].map(v => (
                  <button
                    key={String(v)}
                    onClick={() => setVaiProrrogacao(vaiProrrogacao === v ? undefined : v)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${vaiProrrogacao === v ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
                  >
                    {v ? 'Sim' : 'Não'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Vai para pênaltis?</Label>
              <div className="flex gap-2 mt-1">
                {[true, false].map(v => (
                  <button
                    key={String(v)}
                    onClick={() => setVaiPenaltis(vaiPenaltis === v ? undefined : v)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${vaiPenaltis === v ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}
                  >
                    {v ? 'Sim' : 'Não'}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {erro && <p className="text-sm text-red-400">{erro}</p>}
      {sucesso && <p className="text-sm text-green-400">Palpite salvo! ⚽</p>}

      <Button
        onClick={salvar}
        disabled={salvando}
        className="w-full bg-green-500 hover:bg-green-400 text-black font-bold"
      >
        {salvando ? 'Salvando...' : palpiteExistente ? 'Atualizar Palpite' : 'Confirmar Palpite'}
      </Button>
    </div>
  )
}
