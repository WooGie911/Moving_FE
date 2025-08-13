"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import defaultProfile from "@/assets/img/mascot/moverprofile-sm.webp";
import { IMoverInfoProps } from "@/types/customerEstimateRequest";
import veteran from "@/assets/icon/etc/icon-chat.svg";
import star from "@/assets/icon/star/icon-star-active.svg";
import Favorite from "@/components/common/button/Favorite";
import { useTranslations, useLocale } from "next-intl";
import deleteIcon from "@/assets/icon/menu/icon-delete.svg";
import Link from "next/link";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/components/common/modal/ModalContext";

export const MoverInfo = ({ mover, usedAt, estimateId, hasConfirmedEstimate }: IMoverInfoProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const t = useTranslations("customerEstimateRequest");
  const queryClient = useQueryClient();
  const { open, close } = useModal();
  const locale = useLocale();

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest(".dropdown-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // mover 상태 업데이트 함수 - React Query 캐시만 사용
  const handleMoverUpdate = async () => {
    // 견적 요청 관련 캐시 무효화
    queryClient.invalidateQueries({ queryKey: ["pendingEstimateRequests", locale] });
    queryClient.invalidateQueries({ queryKey: ["receivedEstimateRequests", locale] });
  };

  // 견적 반려 API 호출을 위한 mutation
  const rejectEstimateMutation = useMutation({
    mutationFn: (estimateId: string) => customerEstimateRequestApi.rejectEstimate(estimateId),
    onSuccess: () => {
      // 성공 시 모달 닫기
      close();

      // 캐시 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["pendingEstimateRequests", locale] });
      queryClient.invalidateQueries({ queryKey: ["receivedEstimateRequests", locale] });
      // 기사님 관련 페이지 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["MyRequestEstimates"] });
      queryClient.invalidateQueries({ queryKey: ["MyRejectedEstimates"] });
    },
    onError: (error) => {
      console.error("견적 반려 처리 실패:", error);
      // TODO: 에러 메시지 표시
    },
  });

  // 견적 반려 핸들러
  const handleRejectEstimate = () => {
    if (!estimateId) {
      console.error("견적 ID가 없습니다.");
      return;
    }

    rejectEstimateMutation.mutate(estimateId);
  };

  return (
    <article
      className={`flex w-full ${usedAt === "received" ? "border-border-light rounded-lg border-2 p-2" : ""}`}
      aria-label={t("aria.moverInfoContainer")}
    >
      <div
        className={`flex w-full flex-row items-center justify-center gap-2 py-3 ${usedAt === "pending" ? "border-border-light border-b-1" : ""} `}
      >
        {/* 좌측 프로필 이미지 */}
        {usedAt === "detail" ? (
          ""
        ) : (
          <div className="relative h-[50px] w-[50px] overflow-hidden rounded-[12px]">
            <Image
              src={mover.moverImage ? mover.moverImage : defaultProfile}
              alt={t("aria.moverProfileImage")}
              fill
              className="object-contain"
            />
          </div>
        )}
        {/* 프로필 이미지 외 모든 프로필 정보*/}

        <section className="border-border-light flex w-full flex-col items-start justify-center gap-1">
          {/* 기사님 별명과 찜 횟수 영역 */}
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-center gap-1">
              {mover.isVeteran || mover.workedCount! >= 10 ? (
                <Image src={veteran} alt={t("aria.veteranIcon")} width={20} height={20} className="object-contain" />
              ) : (
                ""
              )}
              <h3
                className={`text-black-300 text-[14px] leading-[24px] font-semibold md:leading-[26px] md:font-medium ${usedAt === "detail" ? "text-[16px] md:text-[18px]" : "text-[14px] md:text-[16px]"} `}
                aria-label={t("aria.moverNickname")}
              >{`${mover.nickname} ${t("driverSuffix")}`}</h3>
            </div>

            {usedAt === "detail" ? (
              <div className="flex flex-row items-center justify-center gap-1">
                <Favorite
                  isFavorited={mover.isFavorite}
                  heartPosition="right"
                  favoriteCount={mover.totalFavoriteCount}
                  moverId={mover.id}
                  onFavoriteChange={handleMoverUpdate}
                />
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center gap-1">
                <Favorite
                  isFavorited={mover.isFavorite}
                  favoriteCount={mover.totalFavoriteCount}
                  moverId={mover.id}
                  onFavoriteChange={handleMoverUpdate}
                />
              </div>
            )}
          </div>
          {/* 기사님 평점과 경력 확정건수 영역 */}
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex w-full flex-row items-center justify-start">
              <div className="flex flex-row items-center justify-center pl-[2px]">
                <Image src={star} alt={t("aria.moverRating")} width={16} height={16} className="object-contain" />
                <p
                  className="text-black-300 text-[14px] leading-[24px] font-semibold"
                  aria-label={t("aria.moverRating")}
                >
                  {mover.averageRating!.toFixed(1)}
                </p>
                <p
                  className="pl-1 text-[14px] leading-[24px] font-normal text-gray-500"
                  aria-label={t("aria.moverReviewCount")}
                >{`(${mover.totalReviewCount})`}</p>
              </div>
              <div className="border-border-light mx-2 h-[14px] w-[1px] border-1"></div>

              <div className="flex flex-row items-center justify-center gap-[3px]">
                <p className="text-[14px] leading-[24px] font-normal text-gray-500">{t("experience")}</p>
                <p
                  className="text-black-300 text-[14px] leading-[24px] font-semibold"
                  aria-label={t("aria.moverExperience")}
                >{`${mover.career}${t("years")}`}</p>
              </div>
              <div className="border-border-light mx-2 h-[14px] w-[1px] border-1"></div>

              <div className="flex flex-row items-center justify-center gap-[3px]">
                <p
                  className="text-black-300 text-[14px] leading-[24px] font-semibold"
                  aria-label={t("aria.moverWorkedCount")}
                >{`${mover.workedCount}${t("cases")}`}</p>
                <p className="text-[14px] leading-[24px] font-normal text-gray-500">{t("confirmed")}</p>
              </div>
            </div>
            {usedAt === "pending" && (
              <div className="dropdown-container relative h-4 w-4 cursor-pointer">
                <button
                  className="relative flex h-4 w-4 items-center justify-center"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label={t("aria.deleteIcon")}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <Image src={deleteIcon} alt={t("aria.deleteIcon")} fill className="object-contain" />
                </button>
                {/*  드롭다운 메뉴  */}
                {isOpen && (
                  <nav
                    className="absolute top-[140%] right-0 z-10 rounded-[12px] border border-gray-100 bg-white shadow-lg"
                    aria-label={t("aria.moverDropdownMenu")}
                    role="menu"
                  >
                    <Link href={`/searchMover/${mover.id}`}>
                      <button
                        className="flex h-10 w-35 cursor-pointer flex-row items-center justify-start px-[14px] py-2 hover:bg-gray-100 lg:h-15 lg:w-40"
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        aria-label={t("aria.viewMoverButton")}
                        role="menuitem"
                      >
                        {t("viewMover")}
                      </button>
                    </Link>
                    <button
                      className="flex h-10 w-35 cursor-pointer flex-row items-center justify-start px-[14px] py-2 hover:bg-gray-100 lg:h-15 lg:w-40"
                      onClick={() => {
                        setIsOpen(false);

                        if (hasConfirmedEstimate) {
                          // 확정견적이 있는 경우 다른 모달 표시
                          open({
                            title: t("rejectEstimateFailed"),
                            children: (
                              <div className="flex flex-col items-center justify-center">
                                <p>{t("rejectEstimateFailedMessage1")}</p>
                                <p>{t("rejectEstimateFailedMessage2")}</p>
                              </div>
                            ),
                            type: "bottomSheet",
                            buttons: [
                              {
                                text: t("close"),
                                onClick: () => {
                                  close();
                                },
                                disabled: rejectEstimateMutation.isPending,
                              },
                            ],
                          });
                        } else {
                          // 확정견적이 없는 경우 기존 모달 표시
                          open({
                            title: t("rejectEstimateTitle"),
                            children: (
                              <div className="flex flex-col items-center justify-center">
                                <p>{t("rejectEstimateConfirm")}</p>
                                <p>{t("rejectEstimateWarning")}</p>
                              </div>
                            ),
                            type: "bottomSheet",
                            buttons: [
                              {
                                text: rejectEstimateMutation.isPending ? t("processing") : t("rejectEstimate"),
                                onClick: handleRejectEstimate,
                                disabled: rejectEstimateMutation.isPending,
                              },
                            ],
                          });
                        }
                      }}
                      aria-label={t("aria.rejectEstimateButton")}
                      role="menuitem"
                    >
                      {t("rejectEstimate")}
                    </button>
                  </nav>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </article>
  );
};
