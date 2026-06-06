import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LigaCard } from '@/components/liga-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default async function LigasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: membros } = await supabase
    .from('liga_membros')
    .select('pontos, posicao, ligas(*)')
    .eq('user_id', user.id)
    .order('pontos', { ascending: false })

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Minhas Ligas</h1>
        <Link href="/ligas/criar">
          <Button size="sm" className="bg-green-500 hover:bg-green-400 text-black font-bold gap-1">
            <Plus size={16} /> Criar
          </Button>
        </Link>
      </div>

      {membros && membros.length > 0 ? (
        <div className="space-y-3">
          {membros.map((m: any) => m.ligas && (
            <LigaCard
              key={m.ligas.id}
              liga={m.ligas}
              pontos={m.pontos}
              posicao={m.posicao}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🏆</p>
          <p className="text-white font-bold">Você ainda não está em nenhuma liga</p>
          <p className="text-zinc-500 text-sm mt-2">Crie uma liga ou entre com um código de convite</p>
          <div className="flex gap-3 justify-center mt-6">
            <Link href="/ligas/criar">
              <Button className="bg-green-500 hover:bg-green-400 text-black font-bold">Criar Liga</Button>
            </Link>
            <Link href="/ligas/entrar">
              <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">Entrar com código</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-zinc-800">
        <Link href="/ligas/entrar">
          <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">
            Entrar em uma liga com código
          </Button>
        </Link>
      </div>
    </div>
  )
}
