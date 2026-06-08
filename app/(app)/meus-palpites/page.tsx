import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { bandeiraPais } from '@/lib/bandeiras'
import { formatarData, formatarHora } from '@/lib/utils-date'

export default async function MeusPalpitesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: palpites } = await supabase
    .from('palpites')
    .select(`
      *,
      jogos (
        id, data_hora, status, gols_casa, gols_fora, fase, grupo,
        selecao_casa:selecoes!jogos_selecao_casa_id_fkey(codigo, nome),
        selecao_fora:selecoes!jogos_selecao_fora_id_fkey(codigo, nome)
      )
    `)
    .eq('user_id', user.id)
    .is('liga_id', null)
    .order('created_at', { ascending: false })

  const total = palpites?.length ?? 0
  const acertos = palpites?.filter(p => p.processado && p.acertou_placar).length ?? 0
  const pontos = palpites?.reduce((s, p) => s + (p.pontos ?? 0), 0) ?? 0

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">⚽ Meus Palpites</h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Todos os seus palpites da Copa</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Palpites', valor: total },
          { label: 'Acertos exatos', valor: acertos },
          { label: 'Total de pontos', valor: pontos },
        ].map(({ label, valor }) => (
          <div key={label} className="rounded-xl p-3 text-center border" style={{ background: '#132b1a', borderColor: '#1e4028' }}>
            <p className="text-2xl font-black" style={{ color: '#FFDF00' }}>{valor}</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {(palpites ?? []).map(p => {
          const j = p.jogos as any
          if (!j) return null
          const encerrado = j.status === 'encerrado'
          return (
            <Link key={p.id} href={`/jogos/${j.id}`}>
              <div className="rounded-xl p-4 border transition-all hover:scale-[1.01]"
                style={{ background: '#132b1a', borderColor: encerrado && p.processado ? (p.acertou_placar ? '#009c3b' : '#1e4028') : '#1e4028' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: '#6b7280' }}>
                    {formatarData(j.data_hora)} · {formatarHora(j.data_hora)}
                  </span>
                  {encerrado && p.processado ? (
                    <span className="text-sm font-black" style={{ color: '#FFDF00' }}>+{p.pontos ?? 0} pts</span>
                  ) : encerrado ? (
                    <span className="text-xs" style={{ color: '#6b7280' }}>Calculando...</span>
                  ) : (
                    <span className="text-xs font-medium" style={{ color: '#009c3b' }}>Agendado</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-2xl">{bandeiraPais(j.selecao_casa?.codigo ?? '')}</span>
                    <span className="text-sm font-bold text-white">{j.selecao_casa?.codigo ?? '??'}</span>
                  </div>

                  <div className="text-center min-w-[100px]">
                    <p className="text-xs mb-0.5" style={{ color: '#6b7280' }}>Seu palpite</p>
                    <p className="text-xl font-black text-white">{p.gols_casa} × {p.gols_fora}</p>
                    {encerrado && (
                      <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                        Real: {j.gols_casa} × {j.gols_fora}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-sm font-bold text-white">{j.selecao_fora?.codigo ?? '??'}</span>
                    <span className="text-2xl">{bandeiraPais(j.selecao_fora?.codigo ?? '')}</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}

        {total === 0 && (
          <div className="text-center py-16" style={{ color: '#6b7280' }}>
            <p className="text-4xl mb-3">🎯</p>
            <p className="font-bold text-white mb-1">Nenhum palpite ainda</p>
            <p className="text-sm">Acesse os jogos e faça seus palpites!</p>
            <Link href="/jogos" className="inline-block mt-4 px-6 py-2 rounded-xl font-bold text-white text-sm"
              style={{ background: '#009c3b' }}>Ver jogos</Link>
          </div>
        )}
      </div>
    </div>
  )
}
