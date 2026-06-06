import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Liga } from '@/types'

interface Props {
  liga: Liga
  pontos?: number
  posicao?: number
  membros?: number
}

export function LigaCard({ liga, pontos, posicao, membros }: Props) {
  return (
    <Link href={`/ligas/${liga.slug}`}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate">{liga.nome}</h3>
            {liga.descricao && <p className="text-xs text-zinc-500 mt-0.5 truncate">{liga.descricao}</p>}
            {liga.premiacao && (
              <p className="text-xs text-yellow-500 mt-1">🏆 {liga.premiacao}</p>
            )}
          </div>
          <Badge className={`text-xs border shrink-0 ${liga.tipo === 'publica' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'}`}>
            {liga.tipo}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800">
          {posicao !== undefined && (
            <div className="text-center">
              <p className="text-lg font-bold text-white">{posicao}º</p>
              <p className="text-xs text-zinc-500">posição</p>
            </div>
          )}
          {pontos !== undefined && (
            <div className="text-center">
              <p className="text-lg font-bold text-yellow-400">{pontos}</p>
              <p className="text-xs text-zinc-500">pontos</p>
            </div>
          )}
          {membros !== undefined && (
            <div className="text-center ml-auto">
              <p className="text-sm text-zinc-400">{membros} membros</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
