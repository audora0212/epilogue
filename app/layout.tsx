// app/layout.tsx

import type React from 'react'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '에필로그 방명록',
  description: '진심에 대한 방명록 페이지입니다',
  // viewport removed from here
}

// 새로 추가: App Router 전용 viewport 설정
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

        {/* PWA 매니페스트 및 아이콘 */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <div className="safe-area-wrapper">{children}</div>
      </body>
    </html>
  )
}
