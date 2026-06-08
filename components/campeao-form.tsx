'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { bandeiraPais } from '@/lib/bandeiras'

interface Selecao { id: string; nome: string; codigo: string }

interface Props {
  selecoes: Selecao[]
  palpiteAtual?: { id: string; selecao_id: string } | null
}

export function CampeaoForm({ selecoes, palpiteAtual }: Props) {
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState<Selecao | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const supabase = createClient()

  const filtradas = selecoes.filter(s =>
    s.nome.toLowerCase().includes(busca.toLowerCase()) ||
    s.codigo.toLowerCase().includes(busca.toLowerCase())
  )

  async function salvar() {
    if (!selecionado) return
    setSalvando(true)
    setErro('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setErro('Não autenticado'); setSalvando(false); return }

    const { error } = await supabase.from('palpites_campeao').upsert({
      user_id: user.id,
      liga_id: null,
      selecao_id: selecionado.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,liga_id' })

    if (error) setErro('Erro: ' + error.message)
    else setSucesso(true)
    setSalvando(false)
  }

  if (sucesso) {
    return (
      <div className="rounded-2xl p-8 border text-center" style={{ background: '#132b1a', borderColor: '#009c3b' }}>
        <div className="text-5xl mb-3">{bandeiraPais(selecionado?.codigo ?? '')}</div>
        <p className="text-xl font-black text-white">{selecionado?.nome}</p>
        <p className="mt-3 font-bold" style={{ color: '#009c3b' }}>✅ Palpite salvo!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Buscar seleção..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
        style={{ background: '#132b1a', border: '2px solid #1e4028' }}
      />

      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
        {filtradas.map(s => (
          <button key={s.id} onClick={() => setSelecionado(selecionado?.id === s.id ? null : s)}
            className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
            style={{
              background: selecionado?.id === s.id ? 'rgba(0,156,59,0.15)' : '#132b1a',
              borderColor: selecionado?.id === s.id ? '#009c3b' : '#1e4028',
            }}>
            <span className="text-2xl">{bandeiraPais(s.codigo)}</span>
            <div>
              <p className="text-xs font-bold" style={{ color: selecionado?.id === s.id ? '#009c3b' : '#fff' }}>{s.codigo}</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>{s.nome}</p>
            </div>
          </button>
        ))}
      </div>

      {selecionado && (
        <div className="rounded-xl p-3 border text-center" style={{ background: 'rgba(255,223,0,0.05)', borderColor: '#FFDF00' }}>
          <p className="text-sm" style={{ color: '#FFDF00' }}>
            Campeão escolhido: <strong>{selecionado.nome}</strong> {bandeiraPais(selecionado.codigo)}
          </p>
        </div>
      )}

      {erro && <p className="text-sm text-red-400">{erro}</p>}

      <button onClick={salvar} disabled={!selecionado || salvando}
        className="w-full py-4 rounded-xl font-black text-lg transition-all hover:scale-[1.02] disabled:opacity-40"
        style={{ background: '#009c3b', color: '#fff', boxShadow: '0 0 20px rgba(0,156,59,0.3)' }}>
        {salvando ? 'Salvando...' : palpiteAtual ? '✏️ Atualizar Palpite' : '🏆 Confirmar Campeão'}
      </button>
    </div>
  )
}
