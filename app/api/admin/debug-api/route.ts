import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  const competitionId = process.env.FOOTBALL_DATA_COMPETITION || '2000'
  const apiKey = process.env.FOOTBALL_DATA_API_KEY || ''

  try {
    // Tenta buscar competições disponíveis
    const resComps = await fetch('https://api.football-data.org/v4/competitions', {
      headers: { 'X-Auth-Token': apiKey },
      cache: 'no-store',
    })
    const comps = await resComps.json()

    // Tenta buscar jogos da competição configurada
    const resMatches = await fetch(`https://api.football-data.org/v4/competitions/${competitionId}/matches`, {
      headers: { 'X-Auth-Token': apiKey },
      cache: 'no-store',
    })
    const matches = await resMatches.json()

    return NextResponse.json({
      configuredCompetitionId: competitionId,
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey.slice(0, 8) + '...',
      competitionsAvailable: comps?.competitions?.map((c: any) => ({ id: c.id, code: c.code, name: c.name })) ?? comps?.message,
      matchesStatus: resMatches.status,
      matchCount: matches?.matches?.length ?? 0,
      matchesError: matches?.message ?? null,
      firstMatch: matches?.matches?.[0] ?? null,
    })
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 })
  }
}
