'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Palpite } from '@/types'

export function usePalpites(jogoId: string, ligaId?: string) {
  const [palpite, setPalpite] = useState<Palpite | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      let query = supabase
        .from('palpites')
        .select('*')
        .eq('jogo_id', jogoId)
        .eq('user_id', user.id)

      if (ligaId) {
        query = query.eq('liga_id', ligaId)
      } else {
        query = query.is('liga_id', null)
      }

      const { data } = await query.maybeSingle()
      setPalpite(data)
      setLoading(false)
    }
    load()
  }, [jogoId, ligaId])

  return { palpite, loading, setPalpite }
}
