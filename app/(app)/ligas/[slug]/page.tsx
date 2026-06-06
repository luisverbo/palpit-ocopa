import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { RankingTabela } from '@/components/ranking-tabela'
import { JogoCard } from '@/components/jogo-card'
import { Button } from '@/components/ui/button'
import type { Jogo } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function LigaPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: liga } = await supabase.from('ligas').select('*').eq('slug', slug).single()
  if (!liga) notFound()

  const { data: membro } = await supabase
    .from('liga_membros')
    .select('*')
    .eq('liga_id', liga.id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membro) redirect('/ligas')

  const { data: membros } = await supabase
    .from('liga_membros')
    .select('*, profiles(id, username, avatar_url, sequencia_acertos, pontos_total, palpites_total, palpites_certos, plano, nome_completo, melhor_sequencia, created_at)')
    .eq('liga_id', liga.id)
    .order('pontos', { ascending: false })

  const ranking = (membros ?? []).map((m, i) => ({ ...m, posicao: i + 1 }))

  const { data: jogosProximos } = await supabase
    .from('jogos')
    .select('*, selecao_casa:selecoes!jogos_selecao_casa_id_fkey(*), selecao_fora:selecoes!jogos_selecao_fora_id_fkey(*)')
    .eq('status', 'agendado')
    .gte('data_hora', new Date().toISOString())
    .order('data_hora')
    .limit(3)

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">{liga.nome}</h1>
        {liga.descricao && <p className="text-zinc-400 text-sm mt-1">{liga.descricao}</p>}
        {liga.premiacao && <p className="text-yellow-500 text-sm mt-1">🏆 {liga.premiacao}</p>}
        <div className="mt-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-500">Código de convite</p>
          <p className="text-lg font-mono font-bold text-white tracking-widest">{liga.codigo_convite}</p>
          <p className="text-xs text-zinc-600">Compartilhe este código para convidar amigos</p>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Ranking</h2>
        <RankingTabela ranking={ranking as any} currentUserId={user.id} />
      </section>

      {jogosProximos && jogosProximos.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Próximos Jogos</h2>
          <div className="space-y-3">
            {jogosProximos.map(j => <JogoCard key={j.id} jogo={j as Jogo} ligaId={liga.id} />)}
          </div>
          <Link href="/jogos" className="block mt-3">
            <Button variant="outline" className="w-full border-zinc-700 text-zinc-400 hover:bg-zinc-800">Ver todos os jogos</Button>
          </Link>
        </section>
      )}
    </div>
  )
}
