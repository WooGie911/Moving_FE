"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { useTranslations, useLocale } from "next-intl";
import moverEstimateApi from "@/lib/api/moverEstimate.api";

import Image from "next/image";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import edit from "@/assets/icon/edit/icon-edit.png";
import arrow from "@/assets/icon/arrow/icon-arrow.png";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import { ICardListProps } from "@/types/moverEstimate";
import { LabelArea } from "./LabelArea";
import { Button } from "../common/button/Button";
import { useModal } from "../common/modal/ModalContext";
import { ModalChild } from "./received/ModalChild";

export const CardList = ({ data, isDesignated, usedAt, id, estimatePrice, estimateStatus }: ICardListProps) => {
  const { open, close, updateButtons } = useModal();
  const [isFormValid, setIsFormValid] = useState(false);
  const [currentModalType, setCurrentModalType] = useState<"rejected" | "sent" | null>(null);
  const [modalData, setModalData] = useState<{ price?: number; comment?: string }>({});
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const t = useTranslations("estimate");
  const locale = useLocale();

  // 데이터 검증
  if (!data) {
    console.error("CardList: data is undefined");
    return null;
  }

  // 다국어 날짜 포맷 함수
  const formatDateWithWeekday = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = [
      t("weekdays.sunday"),
      t("weekdays.monday"),
      t("weekdays.tuesday"),
      t("weekdays.wednesday"),
      t("weekdays.thursday"),
      t("weekdays.friday"),
      t("weekdays.saturday"),
    ][date.getDay()];

    // 언어별 날짜 형식
    const yearSuffix = t("dateFormat.year");
    const monthSuffix = t("dateFormat.month");
    const daySuffix = t("dateFormat.day");

    // 영어인 경우 MM/DD/YYYY 형식
    if (monthSuffix === "/" && yearSuffix === "" && daySuffix === "") {
      return `${month}/${day}/${year} (${weekday})`;
    }
    // 한국어, 중국어인 경우 YYYY년 MM월 DD일 형식
    else {
      return `${year}${yearSuffix} ${month}${monthSuffix} ${day}${daySuffix} (${weekday})`;
    }
  };
  // console.log("카드데이터", data);
  // 견적 생성 mutation
  const createEstimateMutation = useMutation({
    mutationFn: (data: { estimateRequestId: string; price: number; comment: string }) =>
      moverEstimateApi.createEstimate({
        estimateRequestId: data.estimateRequestId,
        price: data.price,
        comment: data.comment,
        moverId: user?.id || "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivedEstimateRequest"] });
      setCurrentModalType(null); // useEffect 비활성화
      // 성공 모달 표시
      open({
        title: t("createEstimateSuccessTitle"),
        children: <div className="py-4 text-center">{t("createEstimateSuccessMessage")}</div>,
        type: "bottomSheet",
        buttons: [{ text: t("close"), onClick: () => close() }],
      });
    },
    onError: (error) => {
      console.error("견적 생성 실패:", error);
      setCurrentModalType(null); // useEffect 비활성화
      // 실패 모달 표시 - 구체적인 에러 메시지 포함
      const errorMessage = error instanceof Error ? error.message : t("createEstimateFailMessage");
      open({
        title: t("createEstimateFailTitle"),
        children: <div className="py-4 text-center">{errorMessage}</div>,
        type: "bottomSheet",
        buttons: [{ text: t("close"), onClick: () => close() }],
      });
    },
  });

  // 견적 반려 mutation
  const rejectEstimateMutation = useMutation({
    mutationFn: (data: { estimateRequestId: string; comment: string }) =>
      moverEstimateApi.rejectEstimate({
        estimateRequestId: data.estimateRequestId,
        comment: data.comment,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivedEstimateRequest"] });
      setCurrentModalType(null); // useEffect 비활성화
      // 성공 모달 표시
      open({
        title: t("rejectEstimateSuccessTitle"),
        children: <div className="py-4 text-center">{t("rejectEstimateSuccessMessage")}</div>,
        type: "bottomSheet",
        buttons: [{ text: t("close"), onClick: () => close() }],
      });
    },
    onError: (error) => {
      console.error("견적 반려 실패:", error);
      console.error("에러 상세 정보:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      setCurrentModalType(null); // useEffect 비활성화
      // 실패 모달 표시 - 구체적인 에러 메시지 포함
      const errorMessage = error instanceof Error ? error.message : t("rejectEstimateFailMessage");
      open({
        title: t("rejectEstimateFailTitle"),
        children: <div className="py-4 text-center">{errorMessage}</div>,
        type: "bottomSheet",
        buttons: [{ text: t("close"), onClick: () => close() }],
      });
    },
  });

  const handleFormChange = (isValid: boolean, formData?: { price?: number; comment?: string }) => {
    setIsFormValid(isValid);
    if (formData) {
      setModalData(formData);
    }
  };

  // 폼 상태가 변경될 때마다 버튼 업데이트
  useEffect(() => {
    if (currentModalType) {
      const buttons = [
        {
          text: currentModalType === "rejected" ? t("reject") : t("sendEstimate"),
          onClick: () => {
            if (currentModalType === "rejected") {
              if (modalData.comment) {
                rejectEstimateMutation.mutate({
                  estimateRequestId: id,
                  comment: modalData.comment,
                });
              } else {
              }
            } else {
              if (modalData.price && modalData.comment) {
                createEstimateMutation.mutate({
                  estimateRequestId: id,
                  price: modalData.price,
                  comment: modalData.comment,
                });
              } else {
              }
            }
          },
          disabled: !isFormValid,
        },
      ];
      updateButtons(buttons);
    }
  }, [isFormValid, currentModalType, updateButtons, modalData, id, createEstimateMutation, rejectEstimateMutation]);

  const moveDate = data?.moveDate ? new Date(data.moveDate) : new Date();
  const isPastDate = moveDate < new Date();

  // 견적 개수 확인 (최대 5개) - REJECTED 상태 제외
  const estimateCount = data.estimates?.filter((estimate) => estimate?.status !== "REJECTED").length || 0;
  const isMaxEstimates = estimateCount >= 5;

  const openRejectModal = () => {
    setIsFormValid(false); // 모달이 열릴 때 초기화
    setCurrentModalType("rejected");

    open({
      title: t("rejectRequest"),
      children: (
        <ModalChild data={data} isDesignated={isDesignated} type={"rejected"} onFormChange={handleFormChange} />
      ),
      type: "bottomSheet",
      buttons: [
        {
          text: t("reject"),
          onClick: () => {
            // useEffect에서 처리됨
          },
          disabled: !isFormValid, // 폼 유효성에 따라 활성화/비활성화
        },
      ],
    });
  };

  const openSendEstimateModal = () => {
    setIsFormValid(false); // 모달이 열릴 때 초기화
    setCurrentModalType("sent");

    open({
      title: t("sendEstimateTitle"),
      children: <ModalChild data={data} isDesignated={isDesignated} type={"sent"} onFormChange={handleFormChange} />,
      type: "bottomSheet",
      buttons: [
        {
          text: t("sendEstimate"),
          onClick: () => {
            // useEffect에서 처리됨
          },
          disabled: !isFormValid, // 폼 유효성에 따라 활성화/비활성화
        },
      ],
    });
  };
  return (
    <div className="border-border-light relative flex w-full max-w-[327px] flex-col items-center justify-center gap-6 rounded-[20px] border-[0.5px] bg-[#ffffff] px-5 py-6 md:max-w-[600px] md:px-10 lg:max-w-[588px]">
      {isPastDate ||
        (estimateStatus === "AUTO_REJECTED" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-[20px] bg-black/50">
            <p className="text-[18px] leading-[26px] font-semibold text-white">{t("completedMoveMessage")}</p>
            <Link href={`/estimate/request/${id}`} className="cursor-pointer">
              <Button
                variant="outlined"
                state="default"
                width="w-[254px] lg:w-[233px]"
                height="h-[54px]"
                rounded="rounded-[12px]"
                className="bg-primary-100"
              >
                {t("viewEstimateDetail")}
              </Button>
            </Link>
          </div>
        ))}
      {usedAt === "rejected" && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-[20px] bg-black/50">
          <p className="text-[18px] leading-[26px] font-semibold text-white">{t("rejectedRequestMessage")}</p>
        </div>
      )}

      {/* type이 "sent"이고 과거 날짜가 아닐 때 혹은 반려된 요청일때 전체를 링크로 감쌈 */}
      {(usedAt === "sent" && !isPastDate) || usedAt === "rejected" ? (
        <Link
          href={usedAt === "sent" ? `/estimate/request/${id}` : `/estimate/rejected/${id}`}
          className="w-full cursor-pointer"
        >
          <div className="flex w-full flex-col items-center justify-center gap-6">
            {/* 라벨과 확정견적/견적서시간/부분 */}
            <div className="flex w-full flex-row items-center justify-between">
              <LabelArea
                movingType={(data.moveType || "SMALL").toLowerCase() as "small" | "home" | "office" | "document"}
                isDesignated={isDesignated}
                createdAt={new Date(data.createdAt || new Date())}
                usedAt={usedAt}
              />
              {estimateStatus === "ACCEPTED" && (
                <div className="flex w-full max-w-[100px] flex-row items-center justify-end gap-1">
                  <Image src={confirm} alt="confirm" width={16} height={16} />
                  <p className="text-primary-400 text-[16px] leading-[26px] font-bold">{t("confirmedEstimate")}</p>
                </div>
              )}
            </div>
            {/* 고객 이름 부분  나중에 프로필같은거 추가할수도?*/}
            <div className="border-border-light flex w-full flex-row items-center justify-start border-b-[0.5px] pb-4">
              <p className="text-black-400 text-[16px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
                {`${data.customer?.name || "고객"}${t("customerSuffix")}`}
              </p>
            </div>
            {/* 이사 정보  부분*/}
            <div className="flex w-full flex-col gap-1 md:flex-row md:justify-between md:pt-2">
              <div className="flex flex-row gap-3">
                <div className="flex flex-col justify-between">
                  <p className="text-[14px] leading-6 font-normal text-gray-500">{t("departure")}</p>
                  <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
                    {shortenRegionInAddress((data.fromAddress?.region || "") + " " + (data.fromAddress?.city || ""))}
                  </p>
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <Image src={arrow} alt="arrow" width={16} height={16} />
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-[14px] leading-6 font-normal text-gray-500">{t("arrival")}</p>
                  <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
                    {shortenRegionInAddress((data.toAddress?.region || "") + " " + (data.toAddress?.city || ""))}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <p className="text-[14px] leading-6 font-normal text-gray-500">{t("movingDate")}</p>
                <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
                  {formatDateWithWeekday(moveDate)}
                </p>
              </div>
            </div>
            {/* 견적금액 부분 - rejected 타입일 때는 숨김 */}
            {usedAt !== "rejected" && (
              <div className="border-border-light mt-2 flex w-full flex-row items-center justify-between border-t-[0.5px] pt-4">
                <p className="text-black-400 text-[16px] leading-[26px] font-medium">{t("estimateAmount")}</p>
                <p className="text-black-400 text-[24px] leading-[32px] font-bold">
                  {estimatePrice?.toLocaleString()}
                  {t("currency")}
                </p>
              </div>
            )}
          </div>
        </Link>
      ) : (
        <>
          {/* 라벨과 확정견적/견적서시간/부분 */}
          <div className="flex w-full flex-row items-center justify-between">
            <LabelArea
              movingType={(data.moveType || "SMALL").toLowerCase() as "small" | "home" | "office" | "document"}
              isDesignated={isDesignated}
              createdAt={new Date(data.createdAt || new Date())}
              usedAt={usedAt}
            />
            {estimateStatus === "ACCEPTED" && (
              <div className="flex w-full max-w-[100px] flex-row items-center justify-end gap-1">
                <Image src={confirm} alt="confirm" width={16} height={16} />
                <p className="text-primary-400 text-[16px] leading-[26px] font-bold">{t("confirmedEstimate")}</p>
              </div>
            )}
          </div>
          {/* 고객 이름 부분  나중에 프로필같은거 추가할수도?*/}
          <div className="border-border-light flex w-full flex-row items-center justify-start border-b-[0.5px] pb-4">
            <p className="text-black-400 text-[16px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
              {`${data.customer?.name || "고객"}${t("customerSuffix")}`}
            </p>
          </div>
          {/* 이사 정보  부분*/}
          <div className="flex w-full flex-col gap-1 md:flex-row md:justify-between md:pt-2">
            <div className="flex flex-row gap-3">
              <div className="flex flex-col justify-between">
                <p className="text-[14px] leading-6 font-normal text-gray-500">{t("departure")}</p>
                <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
                  {shortenRegionInAddress((data.fromAddress?.city || "") + " " + (data.fromAddress?.district || ""))}
                </p>
              </div>
              <div className="flex flex-col justify-end pb-1">
                <Image src={arrow} alt="arrow" width={16} height={16} />
              </div>
              <div className="flex flex-col justify-between">
                <p className="text-[14px] leading-6 font-normal text-gray-500">{t("arrival")}</p>
                <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
                  {shortenRegionInAddress((data.toAddress?.city || "") + " " + (data.toAddress?.district || ""))}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-[14px] leading-6 font-normal text-gray-500">{t("movingDate")}</p>
              <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
                {formatDateWithWeekday(moveDate)}
              </p>
            </div>
          </div>
          {/* 버튼 혹은 견적금액 부분 */}
          {usedAt === "received" ? (
            <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:pt-4">
              <Button
                variant="outlined"
                state="default"
                width="w-[254px] lg:w-[233px]"
                height="h-[54px]"
                rounded="rounded-[12px]"
                onClick={openRejectModal}
                className="hidden md:block"
              >
                {t("reject")}
              </Button>
              <Button
                variant="solid"
                state={isMaxEstimates ? "disabled" : "default"}
                width="w-[254px] lg:w-[233px]"
                height="h-[54px]"
                rounded="rounded-[12px]"
                onClick={isMaxEstimates ? undefined : openSendEstimateModal}
                disabled={isMaxEstimates}
              >
                <div className="flex flex-row items-center justify-center gap-2">
                  <p>{isMaxEstimates ? t("alreadyMaxEstimates") : t("sendEstimateTitle")}</p>
                  {!isMaxEstimates && <Image src={edit} alt="arrow" width={24} height={24} />}
                </div>
              </Button>
              <Button
                variant="outlined"
                state="default"
                width="w-[254px] lg:w-[233px]"
                height="h-[54px]"
                rounded="rounded-[12px]"
                onClick={openRejectModal}
                className="md:hidden"
              >
                {t("reject")}
              </Button>
            </div>
          ) : usedAt === "sent" ? (
            <div className="border-border-light mt-2 flex w-full flex-row items-center justify-between border-t-[0.5px] pt-4">
              <p className="text-black-400 text-[16px] leading-[26px] font-medium">{t("estimateAmount")}</p>
              <p className="text-black-400 text-[24px] leading-[32px] font-bold">
                {estimatePrice?.toLocaleString()}
                {t("currency")}
              </p>
            </div>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
};
