import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Muktha’s Bollinger Bands — FindScan Assignment',
  description: 'Custom implementation of Bollinger Bands with KLineCharts in Next.js + TailwindCSS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="p-4 text-center font-semibold text-lg border-b border-gray-800">
            Muktha’s Bollinger Bands Demo
          </header>

          {/* Main Content */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-800">
            © 2025 Muktha | Built with Next.js + KLineCharts
          </footer>
        </div>
      </body>
    </html>
  )
}
