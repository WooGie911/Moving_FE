import React from "react";

interface ISpeechBubbleProps {
  type: "question" | "answer";
  children: React.ReactNode;
  isLatestAnswer?: boolean; // 가장 최근 대답 여부
  onEdit?: () => void; // 수정하기 클릭 시 동작
}

const baseBubbleClass =
  "lg:text-2lg inline-block max-w-[75%] gap-2 rounded-3xl px-5 py-3 text-md leading-6 font-medium md:gap-4 mb-2 shadow-sm";

const SpeechBubble = ({ type, children, isLatestAnswer = false, onEdit }: ISpeechBubbleProps) => {
  const isQuestion = type === "question";
  const isAnswer = type === "answer";

  // answer 중에서 최신이 아니면 연한 배경
  const answerBg = isLatestAnswer ? "bg-primary-400 text-gray-50" : "bg-primary-100 text-primary-400";

  const bubbleClass = [
    baseBubbleClass,
    isQuestion ? "text-black-400 self-start rounded-tl-none bg-gray-50" : `self-end rounded-tr-none ${answerBg}`,
  ].join(" ");

  return (
    <div className="flex flex-col items-end">
      <div
        className={bubbleClass}
        style={{
          alignSelf: isQuestion ? "flex-start" : "flex-end",
        }}
      >
        {children}
      </div>
      {/* answer 중 최신이 아닌 경우에만 수정하기 노출 */}
      {isAnswer && !isLatestAnswer && onEdit && (
        <button
          className="hover:text-primary-400 mt-1 mr-2 text-xs leading-6 font-medium text-gray-500 underline transition-colors lg:mt-[6px] lg:text-base"
          onClick={onEdit}
        >
          수정하기
        </button>
      )}
    </div>
  );
};

export default SpeechBubble;
