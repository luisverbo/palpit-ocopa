import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-black text-green-400 mb-2">⚽ PalpitãoCopa</h1>
      <p className="text-xl text-zinc-400 mb-8">Bolão da Copa do Mundo com ligas privadas e ranking em tempo real</p>
      <div className="flex gap-3">
        <Link href="/login" className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition-colors">
          Entrar
        </Link>
        <Link href="/cadastro" className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-xl border border-zinc-700 transition-colors">
          Cadastrar
        </Link>
      </div>
    </main>
  )
}
