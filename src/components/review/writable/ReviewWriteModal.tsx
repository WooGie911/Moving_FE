"use client";

import React from "react";
import StarRating from "./StarRating";
import { TextAreaInput } from "@/components/common/input/TextAreaInput";
import { IWritableCardData, IReviewForm } from "@/types/review";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import Image from "next/image";
import estimateIcon from "@/assets/icon/etc/icon-estimate.webp";
import arrowIcon from "@/assets/icon/arrow/icon-arrow.webp";
import { Button } from "@/components/common/button/Button";
import defaultProfile from "@/assets/img/mascot/moverprofile-lg.webp";
import { useTranslations, useLocale } from "next-intl";
import { formatDateByLanguage } from "@/utils/dateUtils";
import { shortenRegionName } from "@/utils/regionMapping";

interface IReviewWriteModalProps {
  card: IWritableCardData;
  onSubmit: (data: IReviewForm) => void;
  isSubmitting: boolean;
}

const ReviewWriteModal = ({ card, onSubmit, isSubmitting }: IReviewWriteModalProps) => {
  const t = useTranslations("review");
  const locale = useLocale();
  const methods = useForm<IReviewForm>();
  const { control, handleSubmit, formState } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full justify-center md:min-w-[375px] lg:w-[600px]">
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-5">
            <div className="flex">
              <MoveTypeLabel type={card.moveType.toLowerCase() as "small" | "home" | "office"} />
              {card.isDesigned && <MoveTypeLabel type="document" />}
            </div>

            <div className="flex flex-row items-start justify-between">
              {/* 텍스트 영역 */}
              <div>
                <div className="flex flex-col">
                  <Image src={estimateIcon} alt={t("verifiedDriver")} className="h-6 w-5" />
                  <div className="text-xl text-[16px] font-semibold lg:text-[18px]">
                    {card.mover.nickname} {t("driverSuffix")}
                  </div>
                </div>
              </div>

              {/* 프로필 이미지 */}
              <Image
                src={card.mover.profileImage || defaultProfile}
                alt="프로필"
                width={50}
                height={50}
                className="rounded-xl border border-gray-200 object-cover"
              />
            </div>

            <div className="flex flex-col border-t-1 border-b-1 border-gray-100 py-2 text-[16px] font-normal lg:text-[18px]">
              <div className="mb-2 flex w-full gap-10">
                <div className="flex gap-4">
                  <div>
                    <div className="text-gray-500">{t("departure")}</div>
                    <div className="text-black-500">
                      {locale === "ko" ? shortenRegionName(card.fromAddress.region) : card.fromAddress.region} {card.fromAddress.city}
                    </div>
                  </div>
                  <div>
                    <Image alt="화살표" width={13} height={10} src={arrowIcon} className="mt-8" />
                  </div>

                  <div>
                    <div className="text-gray-500">{t("arrival")}</div>
                    <div className="text-black-500">
                      {locale === "ko" ? shortenRegionName(card.toAddress.region) : card.toAddress.region} {card.toAddress.city}
                    </div>
                  </div>
                </div>

                <div className="border-gray-100">
                  <div className="text-gray-500">{t("moveDate")}</div>
                  <div className="text-black-500">
                    {formatDateByLanguage(card.moveDate, locale as "ko" | "en" | "zh")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Controller
              name="rating"
              control={control}
              defaultValue={0}
              rules={{ validate: (value) => value > 0 || t("selectRatingError") }}
              render={({ field }) => <StarRating rating={field.value} setRating={field.onChange} />}
            />
          </div>

          <div>
            <div className="flex flex-col items-start justify-center gap-3">
              <p className="text-black-300 text-[16px] font-semibold lg:text-[18px]">{t("writeDetailReview")}</p>
              <div className="w-full">
                <Controller
                  name="content"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: t("reviewRequired"),
                    minLength: { value: 10, message: t("reviewMinLength") },
                  }}
                  render={({ field }) => (
                    <TextAreaInput
                      {...field}
                      placeholder={t("reviewPlaceholder")}
                      textareaClassName="w-full border-gray-200 border-2"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="submit"
              variant="solid"
              disabled={!formState.isValid || isSubmitting}
              className="w-full p-4"
              rounded="rounded-xl"
            >
              {isSubmitting ? t("submitting") : t("registerReview")}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ReviewWriteModal;
