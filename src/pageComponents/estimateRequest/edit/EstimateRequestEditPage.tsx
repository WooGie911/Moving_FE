"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpeechBubble from "@/components/estimateRequest/create/SpeechBubble";
import { Button } from "@/components/common/button/Button";
import { useModal } from "@/components/common/modal/ModalContext";
import { useLanguageStore } from "@/stores/languageStore";
import { formatDateByLanguage } from "@/utils/dateUtils";
import { fadeInUpAnimation } from "@/constant/quoteStyles";
import estimateRequestApi from "@/lib/api/estimateRequest.api";
import { toEstimateRequestPayload } from "@/lib/api/estimateRequest.api";

const EstimateRequestEditPage = () => {
  const [quoteData, setQuoteData] = useState<any | null>(null);
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
      const response = await estimateRequestApi.getActive();
      if (response.success && response.data) {
        setQuoteData(response.data);
      } else if (response.success && !response.data) {
        // 활성 견적이 없으면(이 페이지에 올 일이 없음)
        setQuoteData(null);
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

  // 답변별 수정 핸들러 (해당 step만 수정)
  const handleEditStep = (step: number) => {
    sessionStorage.setItem("isEditMode", "true");
    sessionStorage.setItem("editStep", String(step));
    router.push("/estimateRequest/create");
  };

  // PATCH(수정) API 연결 (전체 수정)
  const handlePatch = async () => {
    console.log("handlePatch 실행"); // ← 버튼 클릭 시 무조건 찍혀야 함
    if (!quoteData) {
      alert("수정할 데이터가 없습니다.");
      return;
    }
    const fromAddressId = quoteData.fromAddressId || quoteData.fromAddress?.id;
    const toAddressId = quoteData.toAddressId || quoteData.toAddress?.id;
    console.log("quoteData", quoteData);
    console.log("fromAddressId", fromAddressId, "toAddressId", toAddressId);

    const patchPayload: any = {
      moveType: quoteData.moveType?.toUpperCase() || undefined,
      moveDate: quoteData.moveDate ? quoteData.moveDate.split("T")[0] : undefined,
      description: quoteData.description ?? "",
      fromAddressId,
      toAddressId,
    };
    Object.keys(patchPayload).forEach((key) => patchPayload[key] === undefined && delete patchPayload[key]);
    try {
      console.log("PATCH payload", patchPayload);
      const response = await estimateRequestApi.updateActive(patchPayload);
      if (response.success) {
        window.location.reload();
      } else {
        alert(response.message || "수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("PATCH 에러:", error, patchPayload, quoteData);
      alert("수정에 실패했습니다. 콘솔을 확인해주세요.");
    }
  };

  // DELETE(삭제) API 연결 (모달 확인 시에만 삭제)
  const handleDeleteClick = () => {
    open({
      title: "정말 삭제하시겠습니까?",
      children: <div className="p-6">삭제 후 복구할 수 없습니다.</div>,
      buttons: [
        {
          text: "취소",
          onClick: close,
        },
        {
          text: "삭제",
          variant: "solid",
          onClick: async () => {
            try {
              const response = await estimateRequestApi.cancelActive();
              if (response.success) {
                window.location.reload();
              } else {
                alert(response.message || "삭제에 실패했습니다.");
              }
              close();
            } catch (error) {
              alert("삭제에 실패했습니다.");
              close();
            }
          },
        },
      ],
    });
  };

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

  // moveType 한글 변환
  const moveTypeLabel =
    quoteData.moveType === "HOME"
      ? "가정 이사"
      : quoteData.moveType === "OFFICE"
        ? "사무실 이사"
        : quoteData.moveType === "SMALL"
          ? "소형 이사"
          : quoteData.moveType;

  // 날짜 변환
  const moveDateLabel = quoteData.moveDate ? quoteData.moveDate.split("T")[0] : "";

  // 주소 라벨(백엔드에서 내려줌, region 영문 제거)
  const stripRegion = (label: string) => {
    if (!label) return "-";
    // 영문 region(BUSAN, SEOUL 등)으로 시작하면 제거
    return label
      .replace(
        /^(BUSAN|SEOUL|DAEGU|INCHEON|GWANGJU|DAEJEON|ULSAN|SEJONG|GYEONGGI|GANGWON|CHUNGBUK|CHUNGNAM|JEONBUK|JEONNAM|GYEONGBUK|GYEONGNAM|JEJU)\s*/,
        "",
      )
      .trim();
  };
  const fromAddressLabel = stripRegion(quoteData.fromAddressLabel);
  const toAddressLabel = stripRegion(quoteData.toAddressLabel);

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
          <SpeechBubble type="answer" isLatest={false} onEdit={() => handleEditStep(1)}>
            {t("quote.result.movingType")}: {moveTypeLabel}
          </SpeechBubble>
        </div>
        <div className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false} onEdit={() => handleEditStep(2)}>
            {t("quote.result.movingDate")}: {moveDateLabel}
          </SpeechBubble>
        </div>
        <div className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false} onEdit={() => handleEditStep(3)}>
            {t("quote.result.departure")}: {fromAddressLabel}
          </SpeechBubble>
        </div>
        <div className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false} onEdit={() => handleEditStep(4)}>
            {t("quote.result.arrival")}: {toAddressLabel}
          </SpeechBubble>
        </div>

        {/* 수정/삭제 질문 말풍선 */}
        <div className="fade-in-up">
          <SpeechBubble type="question">
            <div className="flex min-w-[279px] flex-col gap-3 px-6 py-5">
              <p className="text-black-400">아래 버튼을 통해 수정 또는 삭제할 수 있습니다.</p>
              <div className="flex gap-3">
                <Button
                  variant="outlined"
                  width="flex-1"
                  height="h-[54px]"
                  rounded="rounded-[16px]"
                  onClick={handlePatch}
                >
                  수정하기
                </Button>
                <Button
                  variant="solid"
                  width="flex-1"
                  height="h-[54px]"
                  rounded="rounded-[16px]"
                  onClick={handleDeleteClick}
                >
                  삭제하기
                </Button>
              </div>
            </div>
          </SpeechBubble>
        </div>
      </div>
    </div>
  );
};

export default EstimateRequestEditPage;
