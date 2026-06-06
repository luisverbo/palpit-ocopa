export type UserPlan = 'free' | 'craque' | 'corporativo'
export type JogoStatus = 'agendado' | 'ao_vivo' | 'encerrado' | 'cancelado'
export type JogoFase = 'grupos' | 'oitavas' | 'quartas' | 'semi' | 'terceiro' | 'final'
export type LigaTipo = 'privada' | 'publica' | 'corporativa'

export interface Profile {
  id: string
  username: string
  nome_completo?: string
  avatar_url?: string
  plano: UserPlan
  pontos_total: number
  palpites_total: number
  palpites_certos: number
  sequencia_acertos: number
  melhor_sequencia: number
  created_at: string
}

export interface Selecao {
  id: string
  nome: string
  codigo: string
  bandeira_url?: string
  grupo?: string
}

export interface Jogo {
  id: string
  id_externo?: number
  selecao_casa_id: string
  selecao_fora_id: string
  data_hora: string
  fase: JogoFase
  grupo?: string
  rodada?: number
  status: JogoStatus
  gols_casa?: number
  gols_fora?: number
  prorrogacao: boolean
  penaltis: boolean
  penaltis_casa?: number
  penaltis_fora?: number
  prazo_palpite: string
  selecao_casa?: Selecao
  selecao_fora?: Selecao
}

export interface Palpite {
  id: string
  user_id: string
  jogo_id: string
  liga_id?: string
  gols_casa: number
  gols_fora: number
  over_under?: 'over' | 'under'
  over_under_valor?: number
  vai_prorrogacao?: boolean
  vai_penaltis?: boolean
  pontos: number
  acertou_placar: boolean
  acertou_vencedor: boolean
  processado: boolean
  is_automatico: boolean
  created_at: string
}

export interface Liga {
  id: string
  nome: string
  slug: string
  descricao?: string
  codigo_convite: string
  criador_id: string
  tipo: LigaTipo
  premiacao?: string
  logo_url?: string
  max_membros: number
  ativa: boolean
  created_at: string
}

export interface LigaMembro {
  id: string
  liga_id: string
  user_id: string
  pontos: number
  posicao?: number
  eh_admin: boolean
  joined_at: string
  profiles?: Profile
}

export interface MembroRanking extends LigaMembro {
  posicao: number
}
