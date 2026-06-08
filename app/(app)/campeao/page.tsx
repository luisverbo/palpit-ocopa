import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CampeaoForm } from '@/components/campeao-form'

export default async function CampeaoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: selecoes }, { data: palpiteAtual }] = await Promise.all([
    supabase.from('selecoes').select('id, nome, codigo').order('nome'),
    supabase.from('palpites_campeao').select('*, selecoes(*)').eq('user_id', user.id).is('liga_id', null).maybeSingle(),
  ])

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🏆</div>
        <h1 className="text-2xl font-black text-white">Palpite do Campeão</h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Quem vai levantar a taça em 2026?</p>
      </div>

      {palpiteAtual && (
        <div className="rounded-2xl p-4 border mb-6 text-center" style={{ background: 'rgba(0,156,59,0.1)', borderColor: '#009c3b' }}>
          <p className="text-xs font-bold uppercase" style={{ color: '#009c3b' }}>Seu palpite atual</p>
          <p className="text-4xl mt-2">{(palpiteAtual as any).selecoes?.codigo}</p>
          <p className="text-xl font-black text-white mt-1">{(palpiteAtual as any).selecoes?.nome}</p>
        </div>
      )}

      <CampeaoForm selecoes={selecoes ?? []} palpiteAtual={palpiteAtual as any} />
    </div>
  )
}
