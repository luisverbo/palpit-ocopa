import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { JogoCard } from '@/components/jogo-card'
import type { Jogo } from '@/types'

export default async function JogosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: jogos } = await supabase
    .from('jogos')
    .select('*, selecao_casa:selecoes!jogos_selecao_casa_id_fkey(*), selecao_fora:selecoes!jogos_selecao_fora_id_fkey(*)')
    .order('data_hora')

  const { data: meusPalpites } = await supabase
    .from('palpites')
    .select('jogo_id, gols_casa, gols_fora, pontos')
    .eq('user_id', user.id)
    .is('liga_id', null)

  const palpiteMap = new Map(meusPalpites?.map(p => [p.jogo_id, p]))

  const aoVivo = jogos?.filter(j => j.status === 'ao_vivo') ?? []
  const agendados = jogos?.filter(j => j.status === 'agendado') ?? []
  const encerrados = jogos?.filter(j => j.status === 'encerrado') ?? []

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-white mb-6">Jogos da Copa</h1>

      {aoVivo.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">🔴 Ao Vivo</h2>
          <div className="space-y-3">
            {aoVivo.map(j => <JogoCard key={j.id} jogo={j as Jogo} palpite={palpiteMap.get(j.id)} />)}
          </div>
        </section>
      )}

      {agendados.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3">Próximos Jogos</h2>
          <div className="space-y-3">
            {agendados.map(j => <JogoCard key={j.id} jogo={j as Jogo} palpite={palpiteMap.get(j.id)} />)}
          </div>
        </section>
      )}

      {encerrados.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Encerrados</h2>
          <div className="space-y-3">
            {encerrados.map(j => <JogoCard key={j.id} jogo={j as Jogo} palpite={palpiteMap.get(j.id)} />)}
          </div>
        </section>
      )}

      {(!jogos || jogos.length === 0) && (
        <div className="text-center py-16">
          <p className="text-zinc-500">Nenhum jogo cadastrado ainda</p>
          <p className="text-xs text-zinc-600 mt-2">Aguarde a sincronização com a API</p>
        </div>
      )}
    </div>
  )
}
