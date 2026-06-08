export default function RegrasPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto pb-20">
      <div className="text-center mb-8">
        <div className="text-5xl mb-2">📋</div>
        <h1 className="text-3xl font-black" style={{ color: '#FFDF00' }}>Como Jogar</h1>
        <p className="text-zinc-400 mt-1">Tudo que você precisa saber para vencer o bolão</p>
      </div>

      {/* Como funciona */}
      <section className="mb-6 rounded-2xl p-5 border" style={{ background: '#132b1a', borderColor: '#1e4028' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#009c3b' }}>⚽ Como Funciona</h2>
        <div className="space-y-3 text-sm text-zinc-300">
          <p>1. <strong className="text-white">Crie uma liga</strong> ou entre na liga de um amigo usando o código de convite</p>
          <p>2. <strong className="text-white">Palpite antes do jogo</strong> — o prazo fecha 1 hora antes do apito inicial</p>
          <p>3. <strong className="text-white">Ganhe pontos</strong> automaticamente quando o jogo terminar</p>
          <p>4. <strong className="text-white">Acompanhe o ranking</strong> da sua liga em tempo real</p>
          <p>5. <strong className="text-white">O maior pontuador</strong> ao final da Copa vence o bolão!</p>
        </div>
      </section>

      {/* Pontuação */}
      <section className="mb-6 rounded-2xl p-5 border" style={{ background: '#132b1a', borderColor: '#1e4028' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#009c3b' }}>🏆 Tabela de Pontuação</h2>
        <div className="space-y-2">
          {[
            { pts: 10, desc: 'Placar exato', ex: 'Você: 2×1 | Resultado: 2×1', cor: '#FFDF00' },
            { pts: 7, desc: 'Vencedor + diferença de gols', ex: 'Você: 2×0 | Resultado: 3×1', cor: '#009c3b' },
            { pts: 5, desc: 'Só o vencedor (ou empate)', ex: 'Você: 1×0 | Resultado: 2×0', cor: '#009c3b' },
            { pts: 3, desc: 'Over/Under correto', ex: 'Você: Over 2.5 | Total: 3 gols', cor: '#60a5fa' },
            { pts: 2, desc: 'Prorrogação correta', ex: 'Você: Sim | Jogo foi para prorrogação', cor: '#a78bfa' },
            { pts: 2, desc: 'Pênaltis correto', ex: 'Você: Sim | Jogo foi para pênaltis', cor: '#a78bfa' },
          ].map(({ pts, desc, ex, cor }) => (
            <div key={desc} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="text-2xl font-black min-w-[48px] text-center" style={{ color: cor }}>
                +{pts}
              </div>
              <div>
                <p className="font-medium text-white text-sm">{desc}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{ex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Palpites extras */}
      <section className="mb-6 rounded-2xl p-5 border" style={{ background: '#132b1a', borderColor: '#1e4028' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#009c3b' }}>⚡ Palpites Extras</h2>
        <div className="space-y-2 text-sm text-zinc-300">
          <p><strong className="text-white">Over/Under 2.5:</strong> Você aposta se o jogo terá mais ou menos de 2.5 gols no total.</p>
          <p><strong className="text-white">Prorrogação:</strong> Disponível nas fases eliminatórias — você aposta se o jogo vai para a prorrogação.</p>
          <p><strong className="text-white">Pênaltis:</strong> Disponível nas fases eliminatórias — você aposta se o jogo vai para os pênaltis.</p>
        </div>
      </section>

      {/* Jogar com amigos */}
      <section className="mb-6 rounded-2xl p-5 border" style={{ background: '#132b1a', borderColor: '#1e4028' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#009c3b' }}>👥 Jogar com Amigos</h2>
        <div className="space-y-3 text-sm text-zinc-300">
          <div className="flex gap-3 items-start">
            <span className="text-xl">1️⃣</span>
            <p>Acesse <strong className="text-white">Ligas</strong> e clique em <strong className="text-white">Criar Liga</strong></p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-xl">2️⃣</span>
            <p>Dê um nome e coloque a premiação do bolão (ex: &quot;Perdedor paga o churrasco 🍖&quot;)</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-xl">3️⃣</span>
            <p>Compartilhe o <strong className="text-white">código de 8 letras</strong> com seus amigos pelo WhatsApp</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-xl">4️⃣</span>
            <p>Seus amigos entram em <strong className="text-white">Ligas → Entrar com código</strong></p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-xl">5️⃣</span>
            <p>Acompanhe o ranking da liga em <strong className="text-white">tempo real</strong> durante os jogos!</p>
          </div>
        </div>
      </section>

      {/* Regras importantes */}
      <section className="rounded-2xl p-5 border" style={{ background: 'rgba(255,223,0,0.05)', borderColor: 'rgba(255,223,0,0.2)' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#FFDF00' }}>⚠️ Regras Importantes</h2>
        <div className="space-y-2 text-sm text-zinc-300">
          <p>• O prazo para palpitar fecha <strong className="text-white">1 hora antes</strong> do jogo começar</p>
          <p>• Palpites são <strong className="text-white">privados</strong> — ninguém vê o palpite do outro durante o prazo</p>
          <p>• Cada usuário pode ter <strong className="text-white">palpites diferentes</strong> em ligas diferentes</p>
          <p>• A pontuação é calculada <strong className="text-white">automaticamente</strong> quando o jogo termina</p>
          <p>• No plano gratuito você pode criar até <strong className="text-white">2 ligas</strong> e entrar em ligas ilimitadas</p>
        </div>
      </section>
    </div>
  )
}
