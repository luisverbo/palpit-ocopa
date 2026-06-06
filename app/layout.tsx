import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PalpitãoCopa',
  description: 'Bolão da Copa do Mundo com ligas privadas e ranking em tempo real',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-[#0A0F0D] text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
