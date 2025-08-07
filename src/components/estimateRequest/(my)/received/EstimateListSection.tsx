"use client";
import { ICardListProps } from "@/types/customerEstimateRequest";
import React, { useState } from "react";
import { CardList } from "../CardList";
import down from "@/assets/icon/arrow/icon-down-md.svg";
import downLg from "@/assets/icon/arrow/icon-down-lg.svg";
import up from "@/assets/icon/arrow/icon-up-md.svg";
import upLg from "@/assets/icon/arrow/icon-up-lg.svg";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/common/button/Button";
import { useModal } from "@/components/common/modal/ModalContext";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const EstimateListSection = ({
  estimateList,
  estimateRequest,
}: {
  estimateList: ICardListProps[];
  estimateRequest: any;
}) => {
  const [option, setOption] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const t = useTranslations("estimateRequest");
  const { open, close } = useModal();
  const queryClient = useQueryClient();
  const locale = useLocale();

  // 이사완료 API 호출을 위한 mutation
  const completeEstimateMutation = useMutation({
    mutationFn: (estimateId: string) => customerEstimateRequestApi.completeEstimate(estimateId),
    onSuccess: () => {
      // 성공 시 모달 닫기
      close();

      // 캐시 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["pendingEstimateRequests", locale] });
      queryClient.invalidateQueries({ queryKey: ["receivedEstimateRequests", locale] });
    },
    onError: (error) => {
      console.error("이사완료 처리 실패:", error);
      // TODO: 에러 메시지 표시
    },
  });

  // ACCEPTED 상태의 estimateId 찾기
  const acceptedEstimateId = estimateList?.find((estimate) => estimate.estimate.status === "ACCEPTED")?.estimate.id;

  // 확정견적이 있는지 확인
  const hasConfirmedEstimate = estimateList?.some((estimate) => estimate.estimate.status === "ACCEPTED") ?? false;

  // 이사확정 API 호출 함수
  const handleCompleteEstimate = () => {
    if (!acceptedEstimateId) {
      console.error("확정된 견적이 없습니다.");
      return;
    }

    completeEstimateMutation.mutate(acceptedEstimateId);
  };

  // 버튼 상태 및 텍스트 결정
  const getButtonState = () => {
    if (estimateRequest?.status === "COMPLETED") {
      return {
        text: t("estimateCompleted"),
        disabled: true,
        state: "disabled" as const,
      };
    } else if (estimateRequest?.status === "APPROVED") {
      return {
        text: completeEstimateMutation.isPending ? t("processingMove") : t("confirmMove"),
        disabled: completeEstimateMutation.isPending,
        state: completeEstimateMutation.isPending ? ("disabled" as const) : ("default" as const),
      };
    } else {
      return {
        text: t("confirmMove"),
        disabled: true,
        state: "disabled" as const,
      };
    }
  };

  const buttonState = getButtonState();

  // 필터링된 리스트 생성
  const filteredList =
    option === "" || option === t("all")
      ? estimateList
      : option === t("confirmedEstimate")
        ? estimateList.filter((item) => item.estimate.status === "ACCEPTED")
        : estimateList; // 옵션이 더 있다면 else if 추가

  return (
    <div className="lg:border-border-light flex w-full flex-col items-center justify-center gap-4 lg:border-l lg:pl-15">
      {/* 목록 과 견적서 개수 */}
      <div className="flex w-full flex-row items-center justify-start gap-2">
        <h1 className="text-black-400 text-[16px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
          {t("estimateList")}
        </h1>
        <p className="text-primary-400 text-[16px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
          {filteredList.length}
        </p>
      </div>

      {/* 정렬 버튼과 이사확정 버튼 */}
      <div className="relative flex w-full flex-row items-center justify-between gap-4">
        <button
          className={`flex h-[36px] cursor-pointer flex-row items-center justify-between gap-[6px] rounded-[8px] border-1 py-2 pr-1 pl-3 lg:h-[50px] lg:pr-3 lg:pl-5 ${option === "" ? "border-border-light" : "border-primary-400 bg-primary-100"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <p
            className={`text-black-400 text-[14px] leading-[24px] font-medium lg:text-[16px] lg:leading-[26px] ${option === "" ? "text-black-400" : "text-primary-400"}`}
          >
            {option === "" ? t("all") : option}
          </p>

          <div className="relative flex h-[20px] w-[20px] flex-row items-center justify-center lg:hidden">
            <Image src={isOpen ? up : down} alt="dropdown" fill className="object-contain" />
          </div>

          <div className="relative hidden lg:block lg:h-[36px] lg:w-[36px] lg:flex-row lg:items-center lg:justify-center">
            <Image src={isOpen ? upLg : downLg} alt="dropdown" fill className="object-contain" />
          </div>
        </button>

        <Button
          variant="solid"
          state={buttonState.state}
          width="w-[110px]"
          height="h-[36px]"
          rounded="rounded-[8px]"
          disabled={buttonState.disabled}
          style={{ cursor: buttonState.disabled ? "not-allowed" : "pointer" }}
          onClick={() =>
            open({
              title: t("confirmMoveTitle"),
              children: (
                <div className="flex flex-col items-center justify-center">
                  <p>{t("confirmMoveQuestion")}</p>
                  <p>{t("confirmMoveInstruction")}</p>
                </div>
              ),
              type: "bottomSheet",
              buttons: [
                {
                  text: completeEstimateMutation.isPending ? t("processingMove") : t("confirmButton"),
                  onClick: handleCompleteEstimate,
                  disabled: completeEstimateMutation.isPending,
                },
              ],
            })
          }
        >
          {buttonState.text}
        </Button>

        {/*  드롭다운 메뉴  */}
        {isOpen && (
          <div className="absolute top-[110%] left-0 z-10 rounded-[12px] border border-gray-100 bg-white shadow-lg">
            <div
              className="flex h-10 w-27 cursor-pointer flex-row items-center justify-start px-[14px] py-2 hover:bg-gray-100 lg:h-15 lg:w-40"
              onClick={() => {
                setOption(t("all"));
                setIsOpen(false);
              }}
            >
              {t("all")}
            </div>
            <div
              className="flex h-10 w-27 cursor-pointer flex-row items-center justify-start px-[14px] py-2 hover:bg-gray-100 lg:h-15 lg:w-40"
              onClick={() => {
                setOption(t("confirmedEstimate"));
                setIsOpen(false);
              }}
            >
              {t("confirmedEstimate")}
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-stretch justify-center">
        {filteredList.map((item) => (
          <CardList key={item.estimate.id} {...item} hasConfirmedEstimate={hasConfirmedEstimate} usedAt="received" />
        ))}
      </div>
    </div>
  );
};
