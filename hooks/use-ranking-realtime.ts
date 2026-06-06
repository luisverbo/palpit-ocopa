'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { MembroRanking } from '@/types'

export function useRankingRealtime(ligaId: string) {
  const [ranking, setRanking] = useState<MembroRanking[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function carregarRanking() {
    const { data } = await supabase
      .from('liga_membros')
      .select(`pontos, joined_at, eh_admin, user_id, id, liga_id, profiles(id, username, avatar_url, sequencia_acertos, pontos_total, palpites_total, palpites_certos, plano, nome_completo, melhor_sequencia, created_at)`)
      .eq('liga_id', ligaId)
      .order('pontos', { ascending: false })

    setRanking((data ?? []).map((m, i) => ({ ...m, posicao: i + 1 })) as unknown as MembroRanking[])
    setLoading(false)
  }

  useEffect(() => {
    carregarRanking()

    const channel = supabase
      .channel(`ranking-liga-${ligaId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'liga_membros',
        filter: `liga_id=eq.${ligaId}`,
      }, () => carregarRanking())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [ligaId])

  return { ranking, loading }
}
