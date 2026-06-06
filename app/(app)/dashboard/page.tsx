import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { JogoCard } from '@/components/jogo-card'
import type { Jogo } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const now = new Date().toISOString()
  const { data: jogosProximos } = await supabase
    .from('jogos')
    .select('*, selecao_casa:selecoes!jogos_selecao_casa_id_fkey(*), selecao_fora:selecoes!jogos_selecao_fora_id_fkey(*)')
    .eq('status', 'agendado')
    .gte('data_hora', now)
    .order('data_hora')
    .limit(5)

  const { data: jogosAoVivo } = await supabase
    .from('jogos')
    .select('*, selecao_casa:selecoes!jogos_selecao_casa_id_fkey(*), selecao_fora:selecoes!jogos_selecao_fora_id_fkey(*)')
    .eq('status', 'ao_vivo')
    .order('data_hora')

  const { data: minhasLigas } = await supabase
    .from('liga_membros')
    .select('pontos, posicao, ligas(*)')
    .eq('user_id', user.id)
    .limit(3)

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">
          Olá, {profile?.username ?? 'Visitante'} 👋
        </h1>
        <p className="text-zinc-400 text-sm">
          <span className="text-yellow-400 font-bold">{profile?.pontos_total ?? 0} pts</span> total
          {' · '}
          <span className="text-white">{profile?.palpites_total ?? 0} palpites</span>
        </p>
      </div>

      {jogosAoVivo && jogosAoVivo.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">🔴 Ao Vivo</h2>
          <div className="space-y-3">
            {jogosAoVivo.map(j => <JogoCard key={j.id} jogo={j as Jogo} />)}
          </div>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Próximos Jogos</h2>
        {jogosProximos && jogosProximos.length > 0 ? (
          <div className="space-y-3">
            {jogosProximos.map(j => <JogoCard key={j.id} jogo={j as Jogo} />)}
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <p className="text-zinc-500">Nenhum jogo agendado</p>
            <p className="text-xs text-zinc-600 mt-1">Os jogos serão sincronizados automaticamente</p>
          </div>
        )}
      </section>

      {minhasLigas && minhasLigas.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Minhas Ligas</h2>
          <div className="space-y-2">
            {minhasLigas.map((m: any) => m.ligas && (
              <div key={m.ligas.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm font-medium text-white">{m.ligas.nome}</span>
                <span className="text-yellow-400 font-bold">{m.pontos} pts</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
