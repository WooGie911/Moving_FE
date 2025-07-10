"use client";
import SpeechBubble from "@/components/quote/create/SpeechBubble";
import Image from "next/image";

const TestPage = () => {
  return (
    <div className="flex flex-col gap-4 bg-[#f7f7f7] p-4">
      <SpeechBubble type="question">몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)</SpeechBubble>
      <SpeechBubble type="question">이사 종류를 알려주세요.</SpeechBubble>
      <SpeechBubble type="question">
        <div>
          <Image src="/images/test.png" alt="테스트 이미지 넣었다는 가정" width={100} height={100} />
        </div>
      </SpeechBubble>

      <SpeechBubble type="answer" isLatestAnswer={false} onEdit={() => alert("수정하기")}>
        소형이사 (원룸, 투룸, 20평대 미만)
      </SpeechBubble>
      <SpeechBubble type="question">날짜를 선택해 주세요!</SpeechBubble>
      <SpeechBubble type="answer" isLatestAnswer={true}>
        내일
      </SpeechBubble>
      <SpeechBubble type="question">
        <div>
          <Image src="/images/test.png" alt="test" width={100} height={100} />
        </div>
      </SpeechBubble>
    </div>
  );
};

export default TestPage;
