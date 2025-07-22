"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/estimateRequest/create/ProgressBar";
import SpeechBubble from "@/components/estimateRequest/create/SpeechBubble";
import { Button } from "@/components/common/button/Button";
import AddressModal from "@/components/estimateRequest/create/card/AddressModal";
import { useModal } from "@/components/common/modal/ModalContext";

// 분리된 섹션 컴포넌트들
import MovingTypeSection from "@/components/estimateRequest/create/sections/MovingTypeSection";
import DateSection from "@/components/estimateRequest/create/sections/DateSection";
import AddressSection from "@/components/estimateRequest/create/sections/AddressSection";

// 타입과 상수
import { IFormState, TAddressType } from "@/types/estimateRequest";
import { fadeInUpAnimation } from "@/constant/quoteStyles";
import { formatDateByLanguage } from "@/utils/dateUtils";
import { useLanguageStore } from "@/stores/languageStore";

import estimateRequestApi from "@/lib/api/estimateRequest.api";

// 초기 상태
const initialForm: IFormState = {
  movingType: "",
  movingDate: "",
  isDateConfirmed: false,
  departure: {
    roadAddress: "",
    detailAddress: "",
    zonecode: "",
    jibunAddress: "",
    extraAddress: "",
  },
  arrival: {
    roadAddress: "",
    detailAddress: "",
    zonecode: "",
    jibunAddress: "",
    extraAddress: "",
  },
};

// 한글 시/도 → 영문 region enum 매핑
const regionMap: Record<string, string> = {
  서울특별시: "SEOUL",
  부산광역시: "BUSAN",
  대구광역시: "DAEGU",
  인천광역시: "INCHEON",
  광주광역시: "GWANGJU",
  대전광역시: "DAEJEON",
  울산광역시: "ULSAN",
  세종특별자치시: "SEJONG",
  경기도: "GYEONGGI",
  강원도: "GANGWON",
  충청북도: "CHUNGBUK",
  충청남도: "CHUNGNAM",
  전라북도: "JEONBUK",
  전라남도: "JEONNAM",
  경상북도: "GYEONGBUK",
  경상남도: "GYEONGNAM",
  제주특별자치도: "JEJU",
};

// 한글 시/도 약칭 → 공식명 변환
const cityToFullName = (city: string) => {
  const map: Record<string, string> = {
    서울: "서울특별시",
    부산: "부산광역시",
    대구: "대구광역시",
    인천: "인천광역시",
    광주: "광주광역시",
    대전: "대전광역시",
    울산: "울산광역시",
    세종: "세종특별자치시",
    경기: "경기도",
    강원: "강원도",
    충북: "충청북도",
    충남: "충청남도",
    전북: "전라북도",
    전남: "전라남도",
    경북: "경상북도",
    경남: "경상남도",
    제주: "제주특별자치도",
  };
  return map[city] || city;
};

// roadAddress에서 city, district, region 파싱
const parseAddress = (roadAddress: string) => {
  const parts = roadAddress.split(" ");
  let city = parts[0] || "";
  city = cityToFullName(city);
  const district = parts[1] || "";
  const detail = parts.slice(2).join(" ");
  const region = regionMap[city] || "";
  return { city, district, detail, region };
};

const EstimateRequestCreatePage = () => {
  const [form, setForm] = useState<IFormState>(initialForm);
  const [step, setStep] = useState(1); // 1:이사종류, 2:날짜, 3:주소, 4:확정
  const [showNextQuestion, setShowNextQuestion] = useState(true); // 초기에는 첫 번째 질문을 보여줌
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { open, close } = useModal();
  const { t, language } = useLanguageStore();
  const router = useRouter();

  // 견적 상태 저장
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  const progress = step === 4 ? 100 : step * 33;

  // edit 모드 체크 및 기존 데이터 로드
  useEffect(() => {
    // 세션 스토리지에서 edit 모드 확인
    const isEditModeFlag = sessionStorage.getItem("isEditMode") === "true";
    if (isEditModeFlag) {
      setIsEditMode(true);
      sessionStorage.removeItem("isEditMode"); // 사용 후 제거
    }
    // 활성 견적이 있는지 확인하고 데이터 로드
    fetchExistingQuote();
  }, []);

  // 기존 견적 데이터 가져오기
  const fetchExistingQuote = async () => {
    try {
      const response = await estimateRequestApi.getActive();
      if (response.success && response.data) {
        if (!isEditMode) {
          setIsEditMode(true);
        }
        setActiveStatus(response.data.status || null);
        const formData = transformQuoteDataToForm(response.data);
        setForm(formData);
        setStep(4);
        setShowNextQuestion(false);
      } else {
        setActiveStatus(null);
      }
    } catch (error) {
      setActiveStatus(null);
      console.error("기존 견적 데이터를 불러오는데 실패했습니다:", error);
      showErrorModal("견적 데이터를 불러오는데 실패했습니다.");
    }
  };

  // 견적 데이터를 폼 데이터로 변환
  const transformQuoteDataToForm = (quoteData: any): IFormState => {
    return {
      movingType: quoteData.movingType.toLowerCase(),
      movingDate: quoteData.movingDate,
      isDateConfirmed: true,
      departure: {
        id: quoteData.departureId, // 주소 ID 저장
        roadAddress: quoteData.departureAddr,
        detailAddress: quoteData.departureDetail || "",
        zonecode: "",
        jibunAddress: "",
        extraAddress: "",
      },
      arrival: {
        id: quoteData.arrivalId, // 주소 ID 저장
        roadAddress: quoteData.arrivalAddr,
        detailAddress: quoteData.arrivalDetail || "",
        zonecode: "",
        jibunAddress: "",
        extraAddress: "",
      },
    };
  };

  // 에러 모달 표시
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
          onClick: close,
        },
      ],
    });
  };

  // 답변 후 다음 질문 표시를 위한 타이머
  useEffect(() => {
    if (pendingAnswer) {
      const timer = setTimeout(() => {
        setShowNextQuestion(true);
        setPendingAnswer(null);
        // 다음 단계로 진행
        if (step === 1) {
          setStep(2);
        } else if (step === 2) {
          setStep(3);
        }
      }, 1500); // 1.5초 후 다음 질문 표시

      return () => clearTimeout(timer);
    }
  }, [pendingAnswer, step]);

  // 핸들러 함수들
  const handleSelectMovingType = useCallback((type: string) => {
    setForm((prev) => ({ ...prev, movingType: type }));
    setPendingAnswer(type);
    setShowNextQuestion(false);
  }, []);

  const handleDateChange = useCallback((date: string) => {
    setForm((prev) => ({ ...prev, movingDate: date }));
  }, []);

  const handleDateComplete = useCallback(() => {
    setForm((prev) => ({ ...prev, isDateConfirmed: true }));
    setPendingAnswer(form.movingDate);
    setShowNextQuestion(false);
  }, [form.movingDate]);

  const handleOpenAddressModal = useCallback(
    (type: TAddressType) => {
      open({
        title: t("quote.selectAddressTitle", { place: t(`quote.${type}`) }),
        children: (
          <AddressModal
            onComplete={(addr) => {
              const parsed = parseAddress(addr.roadAddress);
              setForm((prev) => ({
                ...prev,
                [type]: {
                  id: addr.id, // 주소 ID 저장
                  roadAddress: addr.roadAddress,
                  detailAddress: addr.detailAddress || "",
                  city: parsed.city,
                  district: parsed.district,
                  region: parsed.region,
                  zonecode: addr.zonecode,
                  jibunAddress: addr.jibunAddress,
                  extraAddress: addr.extraAddress,
                },
              }));
              close();
            }}
            onClose={close}
          />
        ),
        buttons: [],
      });
    },
    [open, close],
  );

  const handleConfirmQuote = useCallback(async () => {
    console.log("수정/확정 버튼 클릭됨", form, activeStatus); // 클릭 이벤트 확인용
    if (!isFormValid()) {
      return;
    }

    try {
      const response = await submitQuote(form);

      if (response.success) {
        window.location.reload();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("견적 저장에 실패했습니다:", error);
      showErrorModal(error instanceof Error ? error.message : "견적 저장에 실패했습니다.");
    }
  }, [form, isEditMode, router, open, close, t]);

  // 폼 유효성 검사
  const isFormValid = () => {
    return !!(form.movingType && form.movingDate && form.departure.roadAddress && form.arrival.roadAddress);
  };

  // 견적 요청 데이터 생성
  const createQuoteRequest = (): IFormState => {
    return {
      movingType: form.movingType,
      movingDate: form.movingDate,
      isDateConfirmed: form.isDateConfirmed,
      departure: {
        id: form.departure.id, // 주소 ID 저장
        roadAddress: form.departure.roadAddress,
        detailAddress: form.departure.detailAddress,
        zonecode: form.departure.zonecode || "",
        jibunAddress: form.departure.jibunAddress || "",
        extraAddress: form.departure.extraAddress || "",
      },
      arrival: {
        id: form.arrival.id, // 주소 ID 저장
        roadAddress: form.arrival.roadAddress,
        detailAddress: form.arrival.detailAddress,
        zonecode: form.arrival.zonecode || "",
        jibunAddress: form.arrival.jibunAddress || "",
        extraAddress: form.arrival.extraAddress || "",
      },
    };
  };

  // 견적 제출
  const submitQuote = async (form: IFormState) => {
    if (activeStatus === "PENDING") {
      return await estimateRequestApi.updateActive(form);
    } else {
      return await estimateRequestApi.create(form);
    }
  };

  // 견적 삭제 처리
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
          text: t("common.cancel"),
          onClick: close,
        },
        {
          text: t("common.delete"),
          onClick: async () => {
            try {
              const response = await estimateRequestApi.cancelActive();
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

  // 견적 확정 모달 표시
  const showConfirmModal = () => {
    open({
      title: t("quote.confirmQuoteTitle"),
      children: (
        <div className="p-6">
          <p className="mb-4 text-gray-700">{t("quote.confirmQuoteMessage")}</p>
        </div>
      ),
      buttons: [
        {
          variant: "outline",
          text: t("common.cancel"),
          onClick: close,
        },
        {
          text: t("quote.confirmQuote"),
          onClick: async () => {
            close();
            await handleConfirmQuote();
          },
        },
      ],
    });
  };

  // 답변 말풍선 렌더링
  const renderAnswerBubble = () => {
    if (!pendingAnswer) return null;

    let answerText = "";
    if (step === 1) {
      // getMovingTypeLabel 대신 t로 조합
      answerText = `${t(`quote.movingTypes.${pendingAnswer}`)} (${t(`quote.movingTypes.${pendingAnswer}Desc`)})`;
    } else if (step === 2) {
      answerText = formatDateByLanguage(pendingAnswer, language);
    }

    return (
      <div className="fade-in-up">
        <SpeechBubble type="answer" isLatest={true}>
          {answerText}
        </SpeechBubble>
      </div>
    );
  };

  // 단계별 렌더링 함수
  const renderStep = () => {
    if (!showNextQuestion) return null;

    switch (step) {
      case 1:
        return (
          <div className="fade-in-up">
            <MovingTypeSection value={form.movingType} onSelect={handleSelectMovingType} />
            <div className="mt-8">
              <Button
                variant="solid"
                width="w-full"
                height="h-[54px]"
                rounded="rounded-[16px]"
                onClick={handleConfirmQuote}
              >
                {t("quote.confirmQuote")}
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="fade-in-up">
            <SpeechBubble type="question">{t("quote.dateQuestion")}</SpeechBubble>
            <DateSection value={form.movingDate} onChange={handleDateChange} onComplete={handleDateComplete} />
            <div className="mt-8">
              <Button
                variant="solid"
                width="w-full"
                height="h-[54px]"
                rounded="rounded-[16px]"
                onClick={handleConfirmQuote}
              >
                {t("quote.confirmQuote")}
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="fade-in-up">
            <SpeechBubble type="question">{t("quote.addressQuestion")}</SpeechBubble>
            <SpeechBubble type="question">
              <div className="flex min-w-[279px] flex-col gap-2 px-6 py-5">
                <AddressSection
                  label="departure"
                  value={form.departure}
                  onClick={() => handleOpenAddressModal("departure")}
                />
                <AddressSection
                  label="arrival"
                  value={form.arrival}
                  onClick={() => handleOpenAddressModal("arrival")}
                />
                <Button
                  variant="solid"
                  width="w-full"
                  height="h-[54px]"
                  rounded="rounded-[16px]"
                  state={form.arrival.roadAddress ? "default" : "disabled"}
                  disabled={!form.arrival.roadAddress}
                  onClick={handleConfirmQuote}
                >
                  {t("quote.confirmQuote")}
                </Button>
              </div>
            </SpeechBubble>
          </div>
        );
      case 4:
        return (
          <div className="fade-in-up">
            <SpeechBubble type="answer" isLatest={true}>
              <div className="space-y-2">
                <div>
                  {t("quote.result.movingType")}:{" "}
                  {form.movingType
                    ? `${t(`quote.movingTypes.${form.movingType}`)} (${t(`quote.movingTypes.${form.movingType}Desc`)})`
                    : ""}
                </div>
                <div>
                  {t("quote.result.movingDate")}: {formatDateByLanguage(form.movingDate, language)}
                </div>
                <div>
                  {t("quote.result.departure")}: {form.departure.roadAddress} {form.departure.detailAddress}
                </div>
                <div>
                  {t("quote.result.arrival")}: {form.arrival.roadAddress} {form.arrival.detailAddress}
                </div>
              </div>
            </SpeechBubble>
            {isEditMode && (
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
                        setStep(1);
                        setShowNextQuestion(true);
                        setPendingAnswer(null);
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
            )}
            {!isEditMode && (
              <SpeechBubble type="question">
                <div className="flex min-w-[279px] flex-col gap-3 px-6 py-5">
                  <p className="text-black-400">위 내용으로 견적을 요청하시겠습니까?</p>
                  <Button
                    variant="solid"
                    width="w-full"
                    height="h-[54px]"
                    rounded="rounded-[16px]"
                    onClick={handleConfirmQuote}
                  >
                    {t("quote.confirmQuote")}
                  </Button>
                </div>
              </SpeechBubble>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // 이전 답변들 렌더링
  const renderPreviousAnswers = () => {
    const answers = [];

    // 이사 종류 답변: step 2(날짜 선택 질문)가 나온 후부터 수정 가능
    if (step > 1 && form.movingType) {
      answers.push(
        <div key="movingType" className="fade-in-up">
          <SpeechBubble
            type="answer"
            isLatest={false}
            onEdit={() => {
              setStep(1);
              setShowNextQuestion(true);
              setPendingAnswer(null);
            }}
          >
            {form.movingType
              ? `${t(`quote.movingTypes.${form.movingType}`)} (${t(`quote.movingTypes.${form.movingType}Desc`)})`
              : ""}
          </SpeechBubble>
        </div>,
      );
    }

    // 날짜 답변: step 3(주소 선택 질문)가 나온 후부터 수정 가능
    if (step > 2 && form.movingDate) {
      answers.push(
        <div key="movingDate" className="fade-in-up">
          <SpeechBubble
            type="answer"
            isLatest={false}
            onEdit={() => {
              setStep(2);
              setShowNextQuestion(true);
              setPendingAnswer(null);
            }}
          >
            {formatDateByLanguage(form.movingDate, language)}
          </SpeechBubble>
        </div>,
      );
    }

    // 주소 답변들: step 4에서 수정 가능
    if (step === 4 && form.departure.roadAddress) {
      answers.push(
        <div key="departure" className="fade-in-up">
          <SpeechBubble
            type="answer"
            isLatest={false}
            onEdit={() => {
              setStep(3);
              setShowNextQuestion(true);
              setPendingAnswer(null);
            }}
          >
            {t("quote.result.departure")}: {form.departure.roadAddress} {form.departure.detailAddress}
          </SpeechBubble>
        </div>,
      );
    }

    if (step === 4 && form.arrival.roadAddress) {
      answers.push(
        <div key="arrival" className="fade-in-up">
          <SpeechBubble
            type="answer"
            isLatest={false}
            onEdit={() => {
              setStep(3);
              setShowNextQuestion(true);
              setPendingAnswer(null);
            }}
          >
            {t("quote.result.arrival")}: {form.arrival.roadAddress} {form.arrival.detailAddress}
          </SpeechBubble>
        </div>,
      );
    }

    return answers;
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <style jsx>{fadeInUpAnimation}</style>

      {/* 상태바 영역 */}
      <div className="sticky top-[72px] z-10 border-b border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2lg text-black-400 leading-lg mb-4 font-semibold">
          {isEditMode ? t("quote.editTitle") : t("quote.title")}
        </h2>
        <ProgressBar value={progress} />
      </div>

      {/* 말풍선 영역 */}
      <div className="space-y-4 p-6">
        <div className="fade-in-up">
          <SpeechBubble type="question">{t("quote.intro")}</SpeechBubble>
        </div>
        <div className="fade-in-up">
          <SpeechBubble type="question">{t("quote.movingTypeQuestion")}</SpeechBubble>
        </div>

        {/* 이전 답변들 */}
        {renderPreviousAnswers()}

        {/* 현재 답변 말풍선 */}
        {renderAnswerBubble()}

        {/* 현재 단계 */}
        {renderStep()}
      </div>
    </div>
  );
};

export default EstimateRequestCreatePage;
