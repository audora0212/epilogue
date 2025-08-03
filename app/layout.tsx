// app/layout.tsx

import type React from 'react'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '에필로그 방명록',
  description: '진심에 대한 방명록 페이지입니다',
  icons: {
    icon: '/new-favicon.ico',         // 기본 favicon
    shortcut: '/new-favicon.ico',     // 바로가기 아이콘
    apple: '/new-favicon.ico',        // iOS 터치 아이콘 (필요시 PNG로 교체)
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* PWA 메타 태그 */}
        <meta name="theme-color" content="#fef7ed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* favicon 변경 */}
        <link rel="icon" href="/new-favicon.ico" />
        <link rel="shortcut icon" href="/new-favicon.ico" />

        {/* Apple touch icon (iOS) */}
        <link rel="apple-touch-icon" href="/new-favicon.ico" />
      </head>
      <body>
        <div className="safe-area-wrapper">{children}</div>
      </body>
    </html>
  )
}
