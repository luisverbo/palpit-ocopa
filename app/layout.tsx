import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PalpitãoCopa 2026 ⚽',
  description: 'Bolão da Copa do Mundo 2026 — ligas privadas, ranking em tempo real e palpites com amigos',
  themeColor: '#009c3b',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className} style={{ backgroundColor: '#0a1a0f', color: '#fff', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
