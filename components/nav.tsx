'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Home, Calendar, Trophy, Users, User, LogOut, BookOpen, Target, Star } from 'lucide-react'

const LINKS = [
  { href: '/dashboard', icon: Home, label: 'Início' },
  { href: '/jogos', icon: Calendar, label: 'Jogos' },
  { href: '/meus-palpites', icon: Target, label: 'Meus Palpites' },
  { href: '/campeao', icon: Star, label: 'Campeão' },
  { href: '/ligas', icon: Users, label: 'Ligas' },
  { href: '/ranking', icon: Trophy, label: 'Ranking' },
  { href: '/regras', icon: BookOpen, label: 'Regras' },
  { href: '/perfil', icon: User, label: 'Perfil' },
]

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function sair() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 z-10 border-r"
        style={{ background: '#0f2318', borderColor: '#1e4028' }}>
        <div className="p-5 border-b" style={{ borderColor: '#1e4028' }}>
          <div className="text-2xl font-black" style={{ color: '#FFDF00' }}>⚽ PalpitãoCopa</div>
          <div className="text-xs mt-0.5" style={{ color: '#009c3b' }}>Copa do Mundo 2026</div>
        </div>
        <div className="flex-1 p-3 space-y-1">
          {LINKS.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={active
                  ? { background: 'rgba(0,156,59,0.2)', color: '#009c3b', borderLeft: '3px solid #009c3b' }
                  : { color: '#9ca3af' }
                }>
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </div>
        <div className="p-3 border-t" style={{ borderColor: '#1e4028' }}>
          <button onClick={sair}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm w-full transition-all"
            style={{ color: '#6b7280' }}>
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-10 border-t"
        style={{ background: '#0f2318', borderColor: '#1e4028' }}>
        <div className="flex items-center justify-around py-2">
          {LINKS.filter(l => l.href !== '/regras').map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors"
                style={{ color: active ? '#009c3b' : '#6b7280' }}>
                <Icon size={20} />
                <span className="text-xs">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
