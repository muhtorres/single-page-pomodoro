import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pomodoro Timer',
  description: 'Stay focused with the Pomodoro technique. Manage tasks and track your sessions.',
  keywords: ['pomodoro', 'timer', 'focus', 'productivity', 'task management'],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Get locale from server (for SSR), falls back to 'pt-BR'
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
