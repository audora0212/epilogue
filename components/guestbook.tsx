'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WriteMessageForm from './write-message-form';
import BottomBar from './BottomBar';

export default function Guestbook() {
  const [entries, setEntries] = useState<
    Array<{ id: number; nickname: string; message: string; date: string }>
  >([]);
  const [showWriteForm, setShowWriteForm] = useState(false);

  useEffect(() => {
    if (showWriteForm) return;
    fetch('/api/messages')
      .then((res) => {
        console.log('API status:', res.status);
        return res.json();
      })
      .then((data: Array<{ id: number; nickname: string; message: string; date: string }>) => {
        // 최근 추가된 메시지를 먼저 보여주도록 정렬
        const sorted = data.sort((a, b) => b.id - a.id);
        setEntries(sorted);
      })
      .catch((err) => console.error('Fetch error:', err));
  }, [showWriteForm]);

  if (showWriteForm) {
    return <WriteMessageForm onBack={() => setShowWriteForm(false)} />;
  }

  return (
    <div
      className="relative h-[87vh] overflow-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
          <h1 className="text-lg font-bold text-gray-800 mb-2">작별을 보내주세요</h1>
          <p className="text-xs text-gray-500 font-pretendard">
            전시시에 대한 방명록 페이지입니다
          </p>
        </div>

        <div className="flex items-center justify-center p-2 flex-shrink-0 mt-4 mb-2">
          <span className="text-10 text-gray-70 font-pretendard">
            <span className="font-bold">{entries.length}</span>개의 작별이 모였어요
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              WebkitMaskImage: 'linear-gradient(to top, transparent, black 30%)',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'bottom',
              maskImage: 'linear-gradient(to top, transparent, black 30%)',
              maskRepeat: 'no-repeat',
              maskPosition: 'bottom',
            }}
          >
            <div className="flex gap-[0.6rem]">
              <div className="flex flex-col gap-[0.6rem] w-1/2">
                {entries
                  .filter((_, i) => i % 2 === 0)
                  .map((entry) => (
                    <Card key={entry.id} className="bg-white/40 border-0 shadow-sm">
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
                {entries
                  .filter((_, i) => i % 2 === 1)
                  .map((entry) => (
                    <Card key={entry.id} className="bg-white/40 border-0 shadow-sm">
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
            <div className="relative bg-gray-800 text-white text-xs p-3 rounded-lg text-center font-pretendard">
              전시에 대한 방명록을 자유롭게 남겨보세요!
              <br />
              (가상의 고인) 故윤영주에게 추모사를 남겨주세요
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-800" />
            </div>
            <div className="mt-2 w-full">
              <Button
                size="xl"
                className="w-full bg-[#396F4B] text-white rounded-full font-medium font-pretendard disabled:bg-opacity-30 text-[16px]"
                onClick={() => setShowWriteForm(true)}
              >
                작별 남기기
              </Button>
            </div>
          </BottomBar>
        </div>
      </div>
    </div>
  );
}
