// components/BottomBar.tsx
"use client"

import { ReactNode } from "react"

export default function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-x-0 bottom-4 px-4 pb-safe pointer-events-auto flex flex-col items-center">
      {children}
    </div>
  )
}
