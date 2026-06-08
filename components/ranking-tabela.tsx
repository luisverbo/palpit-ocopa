'use client'
import type { MembroRanking } from '@/types'

interface Props {
  ranking: MembroRanking[]
  currentUserId?: string
}

export function RankingTabela({ ranking, currentUserId }: Props) {
  return (
    <div className="space-y-2">
      {ranking.map((membro) => {
        const profile = membro.profiles
        const isMe = membro.user_id === currentUserId
        const pos = membro.posicao
        const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : null

        return (
          <div key={membro.id}
            className="flex items-center gap-3 p-3 rounded-xl border transition-all"
            style={{
              background: isMe ? 'rgba(0,156,59,0.1)' : 'rgba(0,0,0,0.2)',
              borderColor: isMe ? '#009c3b' : '#1e4028',
            }}>
            <div className="w-9 text-center">
              {medal ? (
                <span className="text-xl">{medal}</span>
              ) : (
                <span className="text-sm font-bold" style={{ color: '#6b7280' }}>{pos}º</span>
              )}
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: '#1e4028', color: '#009c3b' }}>
              {profile?.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {profile?.username ?? 'Usuário'}
                {isMe && <span className="ml-1 text-xs" style={{ color: '#009c3b' }}>(você)</span>}
              </p>
              {profile?.sequencia_acertos !== undefined && profile.sequencia_acertos > 1 && (
                <p className="text-xs" style={{ color: '#f97316' }}>🔥 {profile.sequencia_acertos} em sequência</p>
              )}
            </div>
            <span className="text-xl font-black" style={{ color: '#FFDF00' }}>{membro.pontos}</span>
          </div>
        )
      })}
      {ranking.length === 0 && (
        <div className="text-center py-12" style={{ color: '#6b7280' }}>
          <p className="text-3xl mb-2">👥</p>
          <p>Nenhum membro ainda</p>
        </div>
      )}
    </div>
  )
}
