import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  const urls = [
    'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard',
    'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611',
    'https://sports.core.api.espn.com/v2/sports/soccer/leagues/fifa.world/events?limit=10',
    'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/schedule',
  ]

  const results: any = {}

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      const data = await res.json()
      results[url] = {
        status: res.status,
        eventCount: data?.events?.length ?? data?.count ?? 'N/A',
        keys: Object.keys(data),
        sample: JSON.stringify(data).slice(0, 300),
      }
    } catch (err) {
      results[url] = { erro: String(err) }
    }
  }

  return NextResponse.json(results)
}
