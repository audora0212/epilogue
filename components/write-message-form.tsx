"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import SuccessScreen from "./success-screen"
import BottomBar from "./BottomBar"

interface WriteMessageFormProps {
  onBack: () => void
}

export default function WriteMessageForm({ onBack }: WriteMessageFormProps) {
  const [message, setMessage] = useState("")
  const [senderName, setSenderName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submittedData, setSubmittedData] = useState<{
    nickname: string
    message: string
    date: string
  } | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (showSuccess && submittedData) {
    return <SuccessScreen onGoHome={onBack} submittedMessage={submittedData} totalCount={83} />
  }

  const handleSubmit = async () => {
    if (!message.trim() || !senderName.trim()) {
      alert("메시지와 이름을 모두 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))

    const currentDate = new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    setSubmittedData({ nickname: senderName, message, date: currentDate })
    setIsSubmitting(false)
    setShowSuccess(true)
  }

  return (
    <div className="relative h-[87vh] bg-white overflow-auto">
      {/* 수정된 헤더 */}
      <div className="flex items-center justify-center p-4 pb-2 pt-safe relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="absolute left-4 h-8 w-8 p-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-gray-800 font-pretendard">
          작별 남기기
        </h1>
      </div>

      <div className="max-w-md mx-auto">
        <div className="p-4 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-maruburi">
              To, 에필로그 팀/윤영주
            </h2>
            <div className="p-4 mb-4 bg-[#F4F5F4] rounded-lg text-left">
              <p className="text-sm font-pretendard mb-2 text-[#7E8D87]">
                에필로그가 탄생하기까지...
              </p>
              <p className="text-sm font-pretendard text-gray-700">
                "에필로그 팀은 에필로그 서비스 시스템을 디자인하기 위해 약 30차례의
                회의를 거쳤어요"
              </p>
            </div>
          </div>

          <div className="relative">
            <Textarea
              placeholder={`진심에 대한 방명록을 자유롭게 남겨보세요!\n(가상의 고인) 故윤영주에게 추모사를 남겨주세요`}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 150))}
              className="min-h-[200px] bg-white border-gray-200 text-base placeholder:text-sm placeholder:font-pretendard whitespace-pre-line resize-none font-pretendard"
            />
            <div className="absolute bottom-3 right-3 text-[70%] text-gray-400 font-pretendard">
              {message.length}/150
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-right w-full font-maruburi">
              From,
            </h3>
            <div className="relative">
              <Input
                placeholder="남기는 이의 이름, 별명을 적어주세요"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value.slice(0, 16))}
                className="bg-white border-gray-200 text-base placeholder:text-xs placeholder:font-pretendard font-pretendard"
              />
              <div className="absolute bottom-3 right-3 text-[70%] text-gray-400 font-pretendard">
                {senderName.length}/16
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomBar>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !message.trim() || !senderName.trim()}
          className="w-full bg-[#396F4B] bottom-20 text-white py-3 rounded-full font-medium font-pretendard disabled:bg-opacity-30"
        >
          {isSubmitting ? "등록 중..." : "작별 남기기"}
        </Button>
      </BottomBar>
    </div>
  )
}
