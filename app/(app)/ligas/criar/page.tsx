'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'

function gerarSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    + '-' + Math.random().toString(36).slice(2, 6)
}

function gerarCodigo(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

export default function CriarLigaPage() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [premiacao, setPremiacao] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function criar(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) { setErro('Nome da liga é obrigatório'); return }
    setLoading(true)
    setErro('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setErro('Não autenticado'); setLoading(false); return }

    const { data: profile } = await supabase.from('profiles').select('plano').eq('id', user.id).single()
    const { count } = await supabase.from('ligas').select('id', { count: 'exact' }).eq('criador_id', user.id)

    if (profile?.plano === 'free' && (count ?? 0) >= 2) {
      setErro('Plano gratuito permite criar até 2 ligas. Atualize para o plano Craque.')
      setLoading(false)
      return
    }

    const slug = gerarSlug(nome)
    const codigo = gerarCodigo()

    const { data: liga, error } = await supabase
      .from('ligas')
      .insert({ nome: nome.trim(), slug, descricao: descricao || null, premiacao: premiacao || null, criador_id: user.id, codigo_convite: codigo })
      .select()
      .single()

    if (error) { setErro('Erro ao criar liga: ' + error.message); setLoading(false); return }

    await supabase.from('liga_membros').insert({ liga_id: liga.id, user_id: user.id, eh_admin: true })

    router.push(`/ligas/${liga.slug}`)
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-black text-white mb-6">Criar Liga</h1>

      <form onSubmit={criar} className="space-y-4">
        <div>
          <Label className="text-zinc-300">Nome da liga *</Label>
          <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Liga do Trampo 2026" className="mt-1 bg-zinc-900 border-zinc-700 text-white" required />
        </div>
        <div>
          <Label className="text-zinc-300">Descrição</Label>
          <Textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Liga dos amigos do trabalho..." className="mt-1 bg-zinc-900 border-zinc-700 text-white resize-none" rows={3} />
        </div>
        <div>
          <Label className="text-zinc-300">Premiação (texto livre)</Label>
          <Input value={premiacao} onChange={e => setPremiacao(e.target.value)} placeholder="Perdedor paga o churrasco 🍖" className="mt-1 bg-zinc-900 border-zinc-700 text-white" />
        </div>
        {erro && <p className="text-sm text-red-400">{erro}</p>}
        <Button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold">
          {loading ? 'Criando...' : 'Criar Liga'}
        </Button>
      </form>
    </div>
  )
}
