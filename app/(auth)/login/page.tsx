'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      setErro('Email ou senha incorretos')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  async function entrarGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-green-400">⚽ PalpitãoCopa</h1>
          <p className="text-zinc-400 mt-2">Faça login para palpitar</p>
        </div>

        <form onSubmit={entrar} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
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
            <Label htmlFor="senha" className="text-zinc-300">Senha</Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              className="mt-1 bg-zinc-900 border-zinc-700 text-white"
              required
            />
          </div>
          {erro && <p className="text-sm text-red-400">{erro}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-4">
          <Button onClick={entrarGoogle} variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">
            Entrar com Google
          </Button>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Não tem conta?{' '}
          <Link href="/cadastro" className="text-green-400 hover:text-green-300">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
