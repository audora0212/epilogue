"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import WriteMessageForm from "./write-message-form"
import BottomBar from "./BottomBar"

const mockEntries = [
  { id: 1, nickname: "닉네임", message: "항상 밝고 따뜻한 사람이셨어요. 편히 쉬세요", date: "2025년 11월 9일" },
  { id: 2, nickname: "닉네임", message: "항상 밝고 따뜻한 사람이셨어요. 편히 쉬세요", date: "2025년 11월 5일" },
  { id: 3, nickname: "닉네임", message: "어렸을때 같이 노드에서 뛰놀던 기억이 아직도 나는데, 이제 함께 만져 가게 되었구나. 난 조금만 있다가 갈 테니 먼저 갈 지니고 있어줘", date: "2025년 11월 6일" },
  { id: 4, nickname: "닉네임", message: "항상 밝고 따뜻한 사람이셨어요. 편히 쉬세요", date: "2025년 11월 6일" },
  { id: 5, nickname: "닉네임", message: "항상 밝고 따뜻한 사람이셨어요. 편히 쉬세요항상 밝고 따뜻한 사람이셨어요. 편히 쉬세요", date: "2025년 11월 6일" },
  { id: 6, nickname: "닉네임", message: "진심에 대한 방명록을 자유롭게 남겨보세요! (가상의 고인) 故윤영주에게 추모사를 남겨주세요", date: "2025년 11월 6일" },
  { id: 7, nickname: "닉네임", message: "좋은 추억만 간직하고 있을게요", date: "2025년 11월 7일" },
  { id: 8, nickname: "닉네임", message: "하늘에서 편히 쉬세요", date: "2025년 11월 8일" },
  { id: 9, nickname: "닉네임", message: "항상 기억하겠습니다", date: "2025년 11월 9일" },
  { id: 10, nickname: "닉네임", message: "감사했습니다", date: "2025년 11월 10일" },
]

export default function Guestbook() {
  const [showWriteForm, setShowWriteForm] = useState(false)

  useEffect(() => {
    if (!showWriteForm) window.scrollTo(0, 0)
  }, [showWriteForm])

  if (showWriteForm) {
    return <WriteMessageForm onBack={() => setShowWriteForm(false)} />
  }

  return (
    <div
      className="relative h-[87vh] overflow-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src="/logo.png"
        alt="Logo"
        className="absolute top-safe left-4 w-18 h-14 object-contain z-10"
      />

      <div className="max-w-md mx-auto w-full h-full flex flex-col overflow-hidden px-4 mb-20">
        <div className="text-center flex-shrink-0 mt-[30px]">
          <h1 className="text-lg font-bold text-gray-800 mb-1 mt-10">
            에필로그 팀/故윤영주께
          </h1>
          <h1 className="text-lg font-bold text-gray-800 mb-2">
            작별을 보내주세요
          </h1>
          <p className="text-xs text-gray-500 font-pretendard">
            진심에 대한 방명록 페이지입니다
          </p>
        </div>

        <div className="flex items-center justify-center p-2 flex-shrink-0 mt-4 mb-2">
          <span className="text-10 text-gray-70 font-pretendard">
            <span className="font-bold">{mockEntries.length}개</span>의 작별이 모였어요
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              WebkitMaskImage: 'linear-gradient(to top, transparent, black 30%)',
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "bottom",
              maskImage: 'linear-gradient(to top, transparent, black 30%)',
              maskRepeat: "no-repeat",
              maskPosition: "bottom",
            }}
          >
            <div className="flex gap-[0.6rem]">
              <div className="flex flex-col gap-[0.6rem] w-1/2">
                {mockEntries
                  .filter((_, i) => i % 2 === 0)
                  .map((entry) => (
                    <Card
                      key={entry.id}
                      className="bg-white/40 border-0 shadow-sm"
                    >
                      <CardContent className="py-0 px-4">
                        <div className="text-xs font-medium text-gray-600 mb-1 font-pretendard">
                          {entry.nickname}
                        </div>
                        <div className="text-xs text-gray-700 leading-relaxed mb-1">
                          {entry.message}
                        </div>
                        <div className="text-xs text-gray-400 font-pretendard">
                          {entry.date}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              <div className="flex flex-col gap-[0.6rem] w-1/2">
                {mockEntries
                  .filter((_, i) => i % 2 === 1)
                  .map((entry) => (
                    <Card
                      key={entry.id}
                      className="bg-white/40 border-0 shadow-sm"
                    >
                      <CardContent className="py-0 px-4">
                        <div className="text-xs font-medium text-gray-600 mb-1 font-pretendard">
                          {entry.nickname}
                        </div>
                        <div className="text-xs text-gray-700 leading-relaxed mb-1">
                          {entry.message}
                        </div>
                        <div className="text-xs text-gray-400 font-pretendard">
                          {entry.date}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>

          <BottomBar>
            <div className="bg-gray-800 text-white text-xs p-3 rounded-lg text-center font-pretendard">
              진심에 대한 방명록을 자유롭게 남겨보세요!
              <br />
              (가상의 고인) 故윤영주에게 추모사를 남겨주세요
            </div>
            <div className="mt-2 w-full">
              <Button
                className="w-full bg-[#396F4B] text-white py-3 rounded-full font-medium font-pretendard disabled:bg-opacity-30"
                onClick={() => setShowWriteForm(true)}
              >
                작별 남기기
              </Button>
            </div>
          </BottomBar>
        </div>
      </div>
    </div>
  )
}
