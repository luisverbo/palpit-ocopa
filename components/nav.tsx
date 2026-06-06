'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Home, Calendar, Trophy, Users, User, LogOut } from 'lucide-react'

const LINKS = [
  { href: '/dashboard', icon: Home, label: 'Início' },
  { href: '/jogos', icon: Calendar, label: 'Jogos' },
  { href: '/ligas', icon: Users, label: 'Ligas' },
  { href: '/ranking', icon: Trophy, label: 'Ranking' },
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
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-zinc-950 border-r border-zinc-800 p-4 z-10">
        <div className="mb-8">
          <h1 className="text-xl font-black text-green-400">⚽ PalpitãoCopa</h1>
        </div>
        <div className="flex-1 space-y-1">
          {LINKS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith(href) ? 'bg-green-500/20 text-green-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
        <button onClick={sair} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
          <LogOut size={18} />
          Sair
        </button>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-10">
        <div className="flex items-center justify-around py-2">
          {LINKS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${pathname.startsWith(href) ? 'text-green-400' : 'text-zinc-500'}`}
            >
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
