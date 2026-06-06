'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function EntrarLigaPage() {
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    if (!codigo.trim()) return
    setLoading(true)
    setErro('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setErro('Não autenticado'); setLoading(false); return }

    const { data: liga } = await supabase
      .from('ligas')
      .select('id, slug, nome, max_membros')
      .eq('codigo_convite', codigo.trim().toUpperCase())
      .eq('ativa', true)
      .single()

    if (!liga) { setErro('Código de convite inválido ou liga não encontrada'); setLoading(false); return }

    const { count } = await supabase.from('liga_membros').select('id', { count: 'exact' }).eq('liga_id', liga.id)
    if ((count ?? 0) >= liga.max_membros) { setErro('Liga cheia'); setLoading(false); return }

    const { error } = await supabase
      .from('liga_membros')
      .insert({ liga_id: liga.id, user_id: user.id })
      .select()
      .single()

    if (error && error.code !== '23505') {
      setErro('Erro ao entrar na liga')
      setLoading(false)
      return
    }

    router.push(`/ligas/${liga.slug}`)
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl font-black text-white mb-2">Entrar em Liga</h1>
      <p className="text-zinc-400 text-sm mb-6">Digite o código de convite para participar</p>

      <form onSubmit={entrar} className="space-y-4">
        <div>
          <Label className="text-zinc-300">Código de convite</Label>
          <Input
            value={codigo}
            onChange={e => setCodigo(e.target.value.toUpperCase())}
            placeholder="XXXXXXXX"
            className="mt-1 bg-zinc-900 border-zinc-700 text-white tracking-widest text-center text-xl font-mono uppercase"
            maxLength={8}
          />
        </div>
        {erro && <p className="text-sm text-red-400">{erro}</p>}
        <Button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold">
          {loading ? 'Entrando...' : 'Entrar na Liga'}
        </Button>
      </form>
    </div>
  )
}
