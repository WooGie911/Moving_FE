import React from "react";
import { ISpeechBubbleProps } from "@/types/quote";

const baseBubbleClass =
  "lg:text-2lg inline-block max-w-full gap-2 rounded-3xl px-5 py-3 text-md leading-6 font-medium md:gap-4 mb-2 shadow-sm";

const SpeechBubble = ({ type, children, isLatest = false, onEdit }: ISpeechBubbleProps) => {
  const isQuestion = type === "question";
  const isAnswer = type === "answer";

  // answer 중에서 최신 질문 이후의 답변이 아니면 연한 배경
  const answerBg = isLatest ? "bg-primary-400 text-gray-50" : "bg-primary-100 text-primary-400";

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
      {/* answer 중 최신 질문 이후의 답변이 아닌 경우에만 수정하기 노출 */}
      {isAnswer && !isLatest && onEdit && (
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
