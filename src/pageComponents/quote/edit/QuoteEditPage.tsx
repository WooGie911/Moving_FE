"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpeechBubble from "@/components/quote/create/SpeechBubble";
import { Button } from "@/components/common/button/Button";
import { useModal } from "@/components/common/modal/ModalContext";
import { useLanguageStore } from "@/stores/languageStore";
import { formatDateByLanguage } from "@/utils/dateUtils";
import { fadeInUpAnimation } from "@/constant/quoteStyles";
import QuoteService, { IQuoteData } from "@/services/quoteService";

const QuoteEditPage = () => {
  const [quoteData, setQuoteData] = useState<IQuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t, language } = useLanguageStore();
  const { open, close } = useModal();

  // 활성 견적 데이터 로드
  useEffect(() => {
    fetchQuoteData();
  }, []);

  const fetchQuoteData = async () => {
    try {
      const response = await QuoteService.getActiveQuote();
      if (response.success && response.data) {
        setQuoteData(response.data);
      } else {
        throw new Error(response.message || "견적 데이터를 불러올 수 없습니다.");
      }
    } catch (error) {
      console.error("견적 데이터를 불러오는데 실패했습니다:", error);
      showErrorModal(error instanceof Error ? error.message : "견적 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const showErrorModal = (message: string) => {
    open({
      title: t("common.error"),
      children: (
        <div className="p-6">
          <p className="mb-4 text-gray-700">{message}</p>
        </div>
      ),
      buttons: [
        {
          text: t("common.confirm"),
          onClick: () => {
            close();
            window.location.reload();
          },
        },
      ],
    });
  };

  const handleDelete = () => {
    open({
      title: t("quote.deleteConfirmTitle"),
      children: (
        <div className="p-6">
          <p className="mb-4 text-gray-700">{t("quote.deleteConfirmMessage")}</p>
        </div>
      ),
      buttons: [
        {
          text: t("common.delete"),
          onClick: async () => {
            try {
              const response = await QuoteService.deleteQuote();
              if (response.success) {
                window.location.reload();
              } else {
                throw new Error(response.message);
              }
              close();
            } catch (error) {
              console.error("견적 삭제에 실패했습니다:", error);
              showErrorModal(error instanceof Error ? error.message : "견적 삭제에 실패했습니다.");
            }
          },
        },
      ],
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-200">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-200">
        <div className="text-center">
          <div className="mb-4 text-lg">견적을 찾을 수 없습니다.</div>
          <Button variant="solid" onClick={() => window.location.reload()}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <style jsx>{fadeInUpAnimation}</style>

      {/* 헤더 영역 */}
      <div className="sticky top-[72px] z-10 border-b border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2lg text-black-400 leading-lg mb-4 font-semibold">{t("quote.editTitle")}</h2>
      </div>

      {/* 말풍선 영역 */}
      <div className="space-y-4 p-6">
        {/* 기존 견적 정보 말풍선들 */}
        <div className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false}>
            {t("quote.result.movingType")}:{" "}
            {quoteData.movingType
              ? `${t(`quote.movingTypes.${quoteData.movingType.toLowerCase()}`)} (${t(`quote.movingTypes.${quoteData.movingType.toLowerCase()}Desc`)})`
              : ""}
          </SpeechBubble>
        </div>
        <div className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false}>
            {t("quote.result.movingDate")}: {formatDateByLanguage(quoteData.movingDate, language)}
          </SpeechBubble>
        </div>
        <div className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false}>
            {t("quote.result.departure")}: {quoteData.departureAddr} {quoteData.departureDetail || ""}
          </SpeechBubble>
        </div>
        <div className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false}>
            {t("quote.result.arrival")}: {quoteData.arrivalAddr} {quoteData.arrivalDetail || ""}
          </SpeechBubble>
        </div>

        {/* 수정/삭제 질문 말풍선 */}
        <div className="fade-in-up">
          <SpeechBubble type="question">
            <div className="flex min-w-[279px] flex-col gap-3 px-6 py-5">
              <p className="text-black-400">{t("quote.editQuestion")}</p>
              <div className="flex gap-3">
                <Button
                  variant="outlined"
                  width="flex-1"
                  height="h-[54px]"
                  rounded="rounded-[16px]"
                  onClick={() => {
                    // edit 모드임을 표시하고 create 페이지로 이동
                    sessionStorage.setItem("isEditMode", "true");
                    router.push("/quote/create");
                  }}
                >
                  {t("quote.editButton")}
                </Button>
                <Button
                  variant="solid"
                  width="flex-1"
                  height="h-[54px]"
                  rounded="rounded-[16px]"
                  onClick={handleDelete}
                >
                  {t("quote.deleteButton")}
                </Button>
              </div>
            </div>
          </SpeechBubble>
        </div>
      </div>
    </div>
  );
};

export default QuoteEditPage;
