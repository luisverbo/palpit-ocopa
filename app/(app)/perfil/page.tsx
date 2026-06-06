import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const taxaAcerto = profile?.palpites_total
    ? Math.round((profile.palpites_certos / profile.palpites_total) * 100)
    : 0

  const { data: ultimosPalpites } = await supabase
    .from('palpites')
    .select('*, jogos(*, selecao_casa:selecoes!jogos_selecao_casa_id_fkey(codigo), selecao_fora:selecoes!jogos_selecao_fora_id_fkey(codigo))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="bg-green-500/20 text-green-400 text-2xl font-bold">
            {profile?.username?.[0]?.toUpperCase() ?? '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-black text-white">{profile?.username}</h1>
          {profile?.nome_completo && <p className="text-zinc-400 text-sm">{profile.nome_completo}</p>}
          <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
            {profile?.plano ?? 'free'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: 'Pontos Total', value: profile?.pontos_total ?? 0, color: 'text-yellow-400' },
          { label: 'Taxa de Acerto', value: `${taxaAcerto}%`, color: 'text-green-400' },
          { label: 'Palpites', value: profile?.palpites_total ?? 0, color: 'text-white' },
          { label: 'Sequência', value: `🔥 ${profile?.sequencia_acertos ?? 0}`, color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-zinc-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Últimos Palpites</h2>
        <div className="space-y-2">
          {(ultimosPalpites ?? []).map((p: any) => (
            <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">
                  {p.jogos?.selecao_casa?.codigo ?? '?'} {p.gols_casa} × {p.gols_fora} {p.jogos?.selecao_fora?.codigo ?? '?'}
                </span>
              </div>
              {p.processado && (
                <span className={`text-sm font-bold ${p.pontos > 0 ? 'text-yellow-400' : 'text-zinc-500'}`}>
                  {p.pontos > 0 ? `+${p.pontos}` : '0'} pts
                </span>
              )}
            </div>
          ))}
          {(!ultimosPalpites || ultimosPalpites.length === 0) && (
            <p className="text-center text-zinc-500 py-8">Nenhum palpite ainda</p>
          )}
        </div>
      </section>
    </div>
  )
}
