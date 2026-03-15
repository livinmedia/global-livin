import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LIVIN — One Platform. Every Role.',
  description: 'The unified platform for LIVIN Media.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
