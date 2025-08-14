import { ISpeechBubbleProps } from "@/types/estimateRequest";
import { useTranslations } from "next-intl";

// 공통 스타일 변수
const SPEECH_BUBBLE_STYLES = {
  base: "lg:text-2lg inline-block max-w-full gap-2 rounded-3xl px-4 py-3 text-md leading-6 font-medium md:gap-4 md:px-5 mb-2 shadow-sm",
  question: "text-black-400 self-start rounded-tl-none bg-gray-50",
  answerLatest: "self-end rounded-tr-none bg-primary-400 text-gray-50",
  answerPrevious: "self-end rounded-tr-none bg-primary-100 text-primary-400",
  editButton:
    "hover:text-primary-400 mt-1 mr-2 text-xs leading-6 font-medium text-gray-500 underline transition-colors lg:mt-[6px] lg:text-base",
} as const;

const SpeechBubble: React.FC<ISpeechBubbleProps> = ({ type, children, isLatest = false, onEdit }) => {
  const t = useTranslations("estimateRequest");
  const isQuestion = type === "question";
  const isAnswer = type === "answer";

  // 답변 배경색 결정
  const getAnswerBackground = () => {
    return isLatest ? SPEECH_BUBBLE_STYLES.answerLatest : SPEECH_BUBBLE_STYLES.answerPrevious;
  };

  // 말풍선 클래스 조합
  const bubbleClass = [
    SPEECH_BUBBLE_STYLES.base,
    isQuestion ? SPEECH_BUBBLE_STYLES.question : getAnswerBackground(),
  ].join(" ");

  return (
    <article
      className="flex flex-col items-end"
      role="article"
      aria-label={isQuestion ? t("aria.question") : t("aria.answer")}
    >
      <div
        className={bubbleClass}
        style={{
          alignSelf: isQuestion ? "flex-start" : "flex-end",
        }}
        role={"region"}
        aria-label={isQuestion ? t("aria.questionContent") : t("aria.answerContent")}
        aria-live={isLatest ? "polite" : "off"}
      >
        {children}
      </div>

      {/* 수정하기 버튼 - 답변이고 최신이 아니고 수정 함수가 있을 때만 표시 */}
      {isAnswer && !isLatest && onEdit && (
        <button
          className={SPEECH_BUBBLE_STYLES.editButton}
          onClick={onEdit}
          aria-label={t("aria.editAnswer")}
          type="button"
        >
          {t("editAnswer")}
        </button>
      )}
    </article>
  );
};

export default SpeechBubble;
