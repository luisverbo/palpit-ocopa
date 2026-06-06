import type { Palpite, Jogo } from '@/types'

export const PONTOS = {
  PLACAR_EXATO: 10,
  VENCEDOR_E_DIFERENCA: 7,
  VENCEDOR_CORRETO: 5,
  OVER_UNDER: 3,
  PRORROGACAO: 2,
  PENALTIS: 2,
  CAMPEAO_COPA: 50,
  ARTILHEIRO_COPA: 20,
} as const

export function calcularPontosPalpite(palpite: Pick<Palpite, 'gols_casa' | 'gols_fora' | 'over_under' | 'over_under_valor' | 'vai_prorrogacao' | 'vai_penaltis'>, resultado: Pick<Jogo, 'gols_casa' | 'gols_fora' | 'prorrogacao' | 'penaltis'>): number {
  let pts = 0
  const { gols_casa: pc, gols_fora: pf } = palpite
  const { gols_casa: rc, gols_fora: rf } = resultado

  if (rc === undefined || rf === undefined) return 0

  if (pc === rc && pf === rf) {
    pts += PONTOS.PLACAR_EXATO
  } else if ((pc - pf) === (rc - rf)) {
    pts += PONTOS.VENCEDOR_E_DIFERENCA
  } else if (
    (pc > pf && rc > rf) ||
    (pc < pf && rc < rf) ||
    (pc === pf && rc === rf)
  ) {
    pts += PONTOS.VENCEDOR_CORRETO
  }

  if (palpite.over_under && palpite.over_under_valor !== undefined) {
    const total = rc + rf
    if (
      (palpite.over_under === 'over' && total > palpite.over_under_valor) ||
      (palpite.over_under === 'under' && total < palpite.over_under_valor)
    ) pts += PONTOS.OVER_UNDER
  }

  if (palpite.vai_prorrogacao !== null && palpite.vai_prorrogacao !== undefined) {
    if (palpite.vai_prorrogacao === resultado.prorrogacao) pts += PONTOS.PRORROGACAO
  }

  if (palpite.vai_penaltis !== null && palpite.vai_penaltis !== undefined) {
    if (palpite.vai_penaltis === resultado.penaltis) pts += PONTOS.PENALTIS
  }

  return pts
}
