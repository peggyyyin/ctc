import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crossing the Canyon Quiz',
  description: 'by the Reinvention Lab at Teach for America',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
