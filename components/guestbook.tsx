'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import WriteMessageForm from './write-message-form';
import BottomBar from './BottomBar';
import { Card, CardContent } from '@/components/ui/card';

export default function Guestbook() {
  const [entries, setEntries] = useState<
    Array<{ id: number; nickname: string; message: string; date: string }>
  >([]);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const [pageStart, setPageStart] = useState(0);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const hasMeasuredRef = useRef(false);
  const [cardsPaddingTop, setCardsPaddingTop] = useState<number>(188);

  const maskNickname = (name: string) => {
    const visible = name.slice(0, Math.max(0, name.length - 2));
    return `${visible}**`;
  };

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

  useEffect(() => {
    const measure = () => {
      const container = cardsContainerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      // 카드 시작점을 페이지 상단으로부터 정확히 300px로 맞추기 위한 동적 패딩 계산
      const desiredTop = 280;
      const requiredPadding = Math.max(0, Math.round(desiredTop - containerRect.top));
      if (requiredPadding !== cardsPaddingTop) {
        setCardsPaddingTop(requiredPadding);
      }
      const visibleCount = new Set<number>();
      const cards = container.querySelectorAll<HTMLElement>('.message-card');
      cards.forEach((el) => {
        const idAttr = el.getAttribute('data-entry-id');
        if (!idAttr) return;
        const id = parseInt(idAttr, 10);
        const rect = el.getBoundingClientRect();
        if (rect.top >= containerRect.top && rect.bottom <= containerRect.bottom) {
          visibleCount.add(id);
        }
      });
      if (!hasMeasuredRef.current && visibleCount.size > 0) {
        setPageSize(visibleCount.size);
        hasMeasuredRef.current = true;
      }
    };

    // 최초 렌더 이후 측정 (레이아웃 안정화 후)
    const raf = requestAnimationFrame(() => measure());
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(() => measure());
    if (cardsContainerRef.current) ro.observe(cardsContainerRef.current);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [entries, cardsPaddingTop]);

  const displayedEntries = pageSize ? entries.slice(pageStart, Math.min(entries.length, pageStart + pageSize)) : entries;
  const maxStart = pageSize ? Math.max(0, entries.length - pageSize) : 0;

  if (showWriteForm) {
    return <WriteMessageForm onBack={() => setShowWriteForm(false)} />;
  }

  return (
    <div
      className="relative h-[89vh] overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(to bottom, #FFFFFF 0px, #FFFFFF 30px, rgba(255,255,255,0) 90px), linear-gradient(to top, #FFFFFF 0px, #FFFFFF 60px, rgba(255,255,255,0) 120px), url('/frame.png')",
        backgroundSize: 'auto, auto, cover',
        backgroundPosition: 'top left, bottom left, center 30px',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
      }}
    >
      <img
        src="/logo.png"
        alt="Logo"
        className="absolute top-safe left-4 w-18 h-14 object-contain z-10"
      />

      <div className="max-w-md mx-auto w-full h-full flex flex-col overflow-hidden px-4 mb-20">
        <div className="text-center flex-shrink-0 mt-[30px]">
          <h1 className="text-lg font-extrabold mb-1 mt-10 text-[#262D2A]">
            에필로그 팀에게
          </h1>
          <h1 className="text-lg font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-b from-[#262D2A] to-[#7C9389]">작별을 보내주세요</h1>
          <p className="text-xs text-gray-500 font-pretendard">
            전시에 대한 방명록 페이지입니다
          </p>
          <div className="flex items-center justify-center mt-3 mb-1">
            <span className="text-[13px] text-[#4C5A55] font-pretendard">
              <span className="font-bold">{entries.length}</span>개의 작별이 모였어요
            </span>
          </div>
        </div>

        

        <div className="relative flex-1 overflow-hidden">
          <div
            className="relative w-full h-full overflow-hidden px-[50px]"
            style={{
              WebkitMaskImage: 'linear-gradient(to top, transparent, black 30%)',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'bottom',
              maskImage: 'linear-gradient(to top, transparent, black 30%)',
              maskRepeat: 'no-repeat',
              maskPosition: 'bottom',
              paddingTop: `${cardsPaddingTop}px`,
            }}
            ref={cardsContainerRef}
          >
            {/* 좌우 탐색 버튼 (이미지 교체) */}
            <button
              type="button"
              aria-label="previous"
              onClick={() => setPageStart((v) => (pageSize ? Math.max(0, v - pageSize) : 0))}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20"
            >
              <img src="/button_right.png" alt="Previous" className="w-10 h-10 opacity-80 hover:opacity-100" />
            </button>
            <button
              type="button"
              aria-label="next"
              onClick={() => setPageStart((v) => (pageSize ? Math.min(maxStart, v + pageSize) : 0))}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20"
            >
              <img src="/button_left.png" alt="Next" className="w-10 h-10 opacity-80 hover:opacity-100" />
            </button>

            <div className="flex gap-[0rem]">
              <div className="flex flex-col gap-[0.6rem] w-1/2">
                {displayedEntries
                  .map((entry, idx) => ({ entry, idx }))
                  .filter(({ idx }) => idx % 2 === 0)
                  .map(({ entry }) => (
                    <Card
                      key={entry.id}
                      className="message-card bg-white/40 border-0 shadow-sm overflow-hidden rounded-none transform-gpu -rotate-[6.5deg] origin-left translate-y-[10px]"
                      style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' }}
                      data-entry-id={entry.id}
                    >
                      <CardContent className="py-0 px-4">
                        <div className="origin-left" suppressHydrationWarning>
                          <div
                            className="text-[11px] text-gray-700 leading-relaxed mb-1"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              transform: 'matrix(0.98, 0, -0.05, 1, 0, 0)',
                              transformOrigin: 'left center',
                            } as React.CSSProperties}
                            suppressHydrationWarning
                          >
                            {entry.message}
                          </div>
                          <div 
                            className="text-[10px] text-gray-600 font-pretendard flex items-center gap-1"
                            style={{
                              transform: 'matrix(0.98, 0, -0.05, 1, 0, 0)',
                              transformOrigin: 'left center',
                            }}
                            suppressHydrationWarning
                          >
                            <span className="font-medium" suppressHydrationWarning>{maskNickname(entry.nickname)}</span>
                            <span className="opacity-60" suppressHydrationWarning>|</span>
                            <span suppressHydrationWarning>{entry.date}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              <div className="flex flex-col gap-[0.6rem] w-1/2">
                {displayedEntries
                  .map((entry, idx) => ({ entry, idx }))
                  .filter(({ idx }) => idx % 2 === 1)
                  .map(({ entry }) => (
                    <Card
                      key={entry.id}
                      className="message-card bg-white/40 border-0 shadow-sm overflow-hidden rounded-none transform-gpu -rotate-[6.5deg] origin-left -translate-y-[8px]"
                      style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' }}
                      data-entry-id={entry.id}
                    >
                      <CardContent className="py-0 px-4">
                        <div className="origin-left" suppressHydrationWarning>
                          <div
                            className="text-[11px] text-gray-700 leading-relaxed mb-1"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              transform: 'matrix(0.98, 0, -0.05, 1, 0, 0)',
                              transformOrigin: 'left center',
                            } as React.CSSProperties}
                            suppressHydrationWarning
                          >
                            {entry.message}
                          </div>
                          <div 
                            className="text-[10px] text-gray-600 font-pretendard flex items-center gap-1"
                            style={{
                              transform: 'matrix(0.98, 0, -0.05, 1, 0, 0)',
                              transformOrigin: 'left center',
                            }}
                            suppressHydrationWarning
                          >
                            <span className="font-medium" suppressHydrationWarning>{maskNickname(entry.nickname)}</span>
                            <span className="opacity-60" suppressHydrationWarning>|</span>
                            <span suppressHydrationWarning>{entry.date}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>

          <BottomBar>
            <div className="relative bg-[#262D2A] text-white text-[13px] p-3 rounded-lg text-center font-pretendard w-[97%]">
              전시에 대한 방명록을 자유롭게 남겨보세요!
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#262D2A]" />
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
