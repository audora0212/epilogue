'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import SuccessScreen from './success-screen';
import BottomBar from './BottomBar';

interface WriteMessageFormProps {
  onBack: () => void;
}

export default function WriteMessageForm({ onBack }: WriteMessageFormProps) {
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    nickname: string;
    message: string;
    date: string;
  } | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // 회전할 문구 리스트
  const phrases = [
    '에필로그 팀의 팀원들은 모두 가족의 장례를 경험해보았어요. 그 경험을 바탕으로 해당 서비스 시스템을 기획하게 되었어요.',
    '에필로그라는 시스템에 포함되는 앱/웹, 그리고 제품은 무려 5개나 되어요. 에필로그 팀은 이를 모두 디자인하고자 했어요.',
    '죽음이란 결국에는 나의 삶을 돌아보게 만드는 거울이라고 생각해요. 무서운 일이지만 결국 끝이 있기에 지금의 삶이 빛나는 것 아닐까요?',
    '고인의 이야기를 들여다볼 수 있는 장례식, 저희 팀의 아이디어가 만들고자 하는 풍경이에요.',
    '내가 살아온 이야기의 후일담 즉, ‘에필로그’를 남기고 갈 수 있다면, 어떨 이야기를 남기고 싶으신가요?'
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 초기 메시지 수 조회 및 스크롤 탑
    async function fetchCount() {
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const data = await res.json();
          setTotalCount(data.length);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchCount();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // 10초마다 문구 전환, 페이드 효과
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIndex(prev => (prev + 1) % phrases.length);
        setVisible(true);
      }, 500); // 페이드 전환 시간
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (showSuccess && submittedData) {
    return (
      <SuccessScreen
        onGoHome={onBack}
        submittedMessage={submittedData}
        totalCount={totalCount}
      />
    );
  }

  const handleSubmit = async () => {
    if (!message.trim() || !senderName.trim()) {
      alert('메시지와 이름을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    const currentDate = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: senderName, message, date: currentDate }),
      });
      if (!res.ok) throw new Error('저장 실패');
      const messages = await res.json();
      setTotalCount(messages.length);
      setSubmittedData({ nickname: senderName, message, date: currentDate });
      setShowSuccess(true);
    } catch (e) {
      alert('메시지 저장에 실패했습니다.');
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-[87vh] bg-white overflow-auto">
      <div className="flex items-center justify-center p-4 pb-2 pt-safe relative">
        <Button variant="ghost" size="sm" onClick={onBack} className="absolute left-4 h-8 w-8 p-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-gray-800 font-pretendard">작별 남기기</h1>
      </div>

      <div className="max-w-md mx-auto">
        <div className="p-4 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-maruburi">To, 에필로그 팀/윤영주</h2>
            <div className="p-4 mb-4 bg-[#F4F5F4] rounded-lg text-left">
              <p className="text-sm font-pretendard mb-2 text-[#7E8D87]">에필로그가 탄생하기까지...</p>
              <p className={`text-sm font-pretendard transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                {phrases[phraseIndex]}
              </p>
            </div>
          </div>

          <div className="relative">
            <Textarea
              placeholder={`진심에 대한 방명록을 자유롭게 남겨보세요!\n(가상의 고인) 故윤영주에게 추모사를 남겨주세요`}
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, 150))}
              className="min-h-[200px] bg-white border-gray-200 text-base placeholder:text-sm placeholder:font-pretendard whitespace-pre-line resize-none font-pretendard"
            />
            <div className="absolute bottom-3 right-3 text-[70%] text-gray-400 font-pretendard">
              {message.length}/150
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-right w-full font-maruburi">From,</h3>
            <div className="relative">
              <Input
                placeholder="남기는 이의 이름, 별명을 적어주세요"
                value={senderName}
                onChange={e => setSenderName(e.target.value.slice(0, 16))}
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
          size="xl"
          className="w-full bg-[#396F4B] bottom-20 text-white rounded-full font-medium font-pretendard disabled:bg-opacity-30 text-[16px]"
        >
          {isSubmitting ? '등록 중...' : '작별 남기기'}
        </Button>
      </BottomBar>
    </div>
  );
}
