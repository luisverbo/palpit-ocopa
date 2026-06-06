'use client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
        const posicaoEmoji = membro.posicao === 1 ? '🥇' : membro.posicao === 2 ? '🥈' : membro.posicao === 3 ? '🥉' : `${membro.posicao}º`

        return (
          <div
            key={membro.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isMe ? 'bg-green-500/10 border-green-500/30' : 'bg-zinc-900 border-zinc-800'}`}
          >
            <span className="text-lg w-8 text-center">{posicaoEmoji}</span>
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-zinc-700 text-white text-sm">
                {profile?.username?.[0]?.toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.username ?? 'Usuário'}
                {isMe && <span className="ml-1 text-xs text-green-400">(você)</span>}
              </p>
              {profile?.sequencia_acertos !== undefined && profile.sequencia_acertos > 1 && (
                <p className="text-xs text-orange-400">🔥 {profile.sequencia_acertos} em sequência</p>
              )}
            </div>
            <span className="text-lg font-bold text-yellow-400 font-mono">{membro.pontos}</span>
          </div>
        )
      })}
      {ranking.length === 0 && (
        <p className="text-center text-zinc-500 py-8">Nenhum membro ainda</p>
      )}
    </div>
  )
}
