'use client'

import { useEffect } from "react"
import BottomBar from "./BottomBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SuccessScreenProps {
  onGoHome: () => void
  submittedMessage: { nickname: string; message: string; date: string }
  totalCount: number
}

export default function SuccessScreen({
  onGoHome,
  submittedMessage,
  totalCount,
}: SuccessScreenProps) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div
      className="relative h-[87vh] flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center pt-safe pt-8 mb-6">
          <div className="text-sm text-gray-600 mb-2">
            에필로그 팀/(가상의 고인) 故윤영주께 보내는
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            {submittedMessage.nickname}님의 작별이 남겨졌어요
          </h1>
          <div className="text-sm text-gray-500">
          </div>
        </div>

        <div className="flex justify-center mb-32">
          <Card
            className="shadow-sm max-w-xs w-full border-none"
            style={{
              transform: "skewX(-2deg) rotate(3deg)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <CardContent className="overflow-hidden p-0">
              <div style={{ transform: "skewX(-2deg) rotate(deg)", padding: "0.5rem 1rem 1rem" }}>
                <div className="text-sm font-normal text-gray-600 mb-2 font-pretendard whitespace-normal break-all">
                  {submittedMessage.nickname}
                </div>
                <div className="text-sm font-bold text-gray-700 leading-relaxed mb-3 whitespace-normal break-all">
                  {submittedMessage.message}
                </div>
                <div className="text-xs text-gray-400 text-right font-pretendard whitespace-normal break-all">
                  {submittedMessage.date}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomBar>
        <Button
          onClick={onGoHome}
          className="w-full bg-[#396F4B] text-white py-3 rounded-full font-medium mb-safe font-pretendard disabled:bg-opacity-30"
        >
          처음으로 돌아가기
        </Button>
      </BottomBar>
    </div>
  )
}
