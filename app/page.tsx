import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1a0f 0%, #002776 50%, #0a1a0f 100%)' }}>

      {/* Decoração de fundo */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #FFDF00 0, #FFDF00 1px, transparent 0, transparent 50%)',
        backgroundSize: '20px 20px'
      }} />

      <div className="relative z-10 max-w-lg">
        <div className="text-8xl mb-4">⚽</div>
        <h1 className="text-5xl font-black mb-2" style={{ color: '#FFDF00', textShadow: '0 0 30px rgba(255,223,0,0.3)' }}>
          PalpitãoCopa
        </h1>
        <div className="text-2xl font-bold mb-2" style={{ color: '#009c3b' }}>2026 🇧🇷</div>
        <p className="text-zinc-300 mb-8 text-lg">
          Dispute o bolão com seus amigos, crie ligas privadas e acompanhe o ranking em tempo real!
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/cadastro">
            <button className="px-8 py-4 rounded-xl font-black text-lg transition-all hover:scale-105"
              style={{ background: '#009c3b', color: '#fff', boxShadow: '0 0 20px rgba(0,156,59,0.4)' }}>
              Criar Conta Grátis
            </button>
          </Link>
          <Link href="/login">
            <button className="px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all hover:scale-105"
              style={{ borderColor: '#FFDF00', color: '#FFDF00', background: 'rgba(255,223,0,0.1)' }}>
              Já tenho conta
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-12">
          {[
            { icon: '🏆', label: 'Ligas Privadas' },
            { icon: '📊', label: 'Ranking ao Vivo' },
            { icon: '⚡', label: 'Pontos Automáticos' },
          ].map(({ icon, label }) => (
            <div key={label} className="p-3 rounded-xl text-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,223,0,0.2)' }}>
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs text-zinc-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
