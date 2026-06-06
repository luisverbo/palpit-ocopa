const BASE_URL = 'https://api.football-data.org/v4'
const COMPETITION_ID = process.env.FOOTBALL_DATA_COMPETITION || '2000'

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY!,
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`Football API error: ${res.status}`)
  return res.json()
}

export async function buscarJogosDaCopa() {
  return apiFetch(`/competitions/${COMPETITION_ID}/matches`, {
    next: { revalidate: 60 },
  })
}

export async function buscarJogoAoVivo(jogoId: number) {
  return apiFetch(`/matches/${jogoId}`, { cache: 'no-store' })
}

export async function buscarTabelaGrupos() {
  return apiFetch(`/competitions/${COMPETITION_ID}/standings`, {
    next: { revalidate: 120 },
  })
}

export function mapearStatus(statusApi: string): string {
  const mapa: Record<string, string> = {
    SCHEDULED: 'agendado',
    TIMED: 'agendado',
    IN_PLAY: 'ao_vivo',
    PAUSED: 'ao_vivo',
    FINISHED: 'encerrado',
    CANCELLED: 'cancelado',
  }
  return mapa[statusApi] ?? 'agendado'
}
