import './globals.css'
import Link from 'next/link'
import { AuthButton } from '../components/AuthButton'
import ThemeToggle from '../components/ThemeToggle'
import { ToastProvider } from '../components/Toast'
import { PlayerProvider } from '../components/player/PlayerProvider'
import MiniPlayer from '../components/MiniPlayer'

export const metadata = { title: 'Sever Music' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <ToastProvider>
          <PlayerProvider>
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-sever-card/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-header">
              <div className="container flex items-center justify-between py-3">
                <nav className="flex gap-3 text-sm">
                  <Link className="px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10" href="/">Главная</Link>
                  <Link className="px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10" href="/submit">Отправить заявку</Link>
                  <Link className="px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10" href="/profile">Профиль</Link>
                </nav>
                <div className="flex gap-2">
                  <ThemeToggle />
                  <AuthButton />
                </div>
              </div>
            </header>

            <main className="page">{children}</main>
            <MiniPlayer />

            <footer className="container py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Sever Music
            </footer>
          </PlayerProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
