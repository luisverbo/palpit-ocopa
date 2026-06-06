'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function CadastroPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [username, setUsername] = useState('')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (username.length < 3) { setErro('Username deve ter pelo menos 3 caracteres'); return }
    if (!/^[a-z0-9_]+$/.test(username)) { setErro('Username: apenas letras minúsculas, números e _'); return }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { username, nome_completo: nomeCompleto } }
    })

    if (error) {
      setErro(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        username,
        nome_completo: nomeCompleto || null,
      })
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-green-400">⚽ PalpitãoCopa</h1>
          <p className="text-zinc-400 mt-2">Crie sua conta e dispute o bolão</p>
        </div>

        <form onSubmit={cadastrar} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-zinc-300">Username *</Label>
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase())}
              placeholder="ex: cravador_top"
              className="mt-1 bg-zinc-900 border-zinc-700 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="nome" className="text-zinc-300">Nome (opcional)</Label>
            <Input
              id="nome"
              value={nomeCompleto}
              onChange={e => setNomeCompleto(e.target.value)}
              placeholder="Seu nome"
              className="mt-1 bg-zinc-900 border-zinc-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-zinc-300">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="mt-1 bg-zinc-900 border-zinc-700 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="senha" className="text-zinc-300">Senha *</Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="mt-1 bg-zinc-900 border-zinc-700 text-white"
              minLength={6}
              required
            />
          </div>
          {erro && <p className="text-sm text-red-400">{erro}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold">
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-green-400 hover:text-green-300">Faça login</Link>
        </p>
      </div>
    </div>
  )
}
