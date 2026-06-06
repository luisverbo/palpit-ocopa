import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default async function RankingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, pontos_total, palpites_total, palpites_certos, sequencia_acertos')
    .order('pontos_total', { ascending: false })
    .limit(100)

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black text-white mb-6">🏆 Ranking Geral</h1>

      <div className="space-y-2">
        {(profiles ?? []).map((p, i) => {
          const pos = i + 1
          const emoji = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : `${pos}º`
          const isMe = p.id === user.id

          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isMe ? 'bg-green-500/10 border-green-500/30' : 'bg-zinc-900 border-zinc-800'}`}
            >
              <span className="text-lg w-8 text-center">{emoji}</span>
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-zinc-700 text-white text-sm">
                  {p.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {p.username}
                  {isMe && <span className="ml-1 text-xs text-green-400">(você)</span>}
                </p>
                <p className="text-xs text-zinc-500">{p.palpites_certos}/{p.palpites_total} acertos</p>
              </div>
              {p.sequencia_acertos > 1 && (
                <span className="text-xs text-orange-400">🔥{p.sequencia_acertos}</span>
              )}
              <span className="text-lg font-bold text-yellow-400 font-mono">{p.pontos_total}</span>
            </div>
          )
        })}

        {(!profiles || profiles.length === 0) && (
          <div className="text-center py-16 text-zinc-500">Nenhum participante ainda</div>
        )}
      </div>
    </div>
  )
}
