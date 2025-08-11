"use client";

import React, { useEffect, useState } from "react";
import userApi from "@/lib/api/user.api";
import Image from "next/image";
import defaultHeader from "@/assets/img/etc/detail-header.webp";
import defaultProfileImage from "@/assets/img/mascot/moverprofile-lg.webp";
import editIcon from "@/assets/icon/edit/icon-edit-white.svg";
import editGrayIcon from "@/assets/icon/edit/icon-edit-gray.svg";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import Favorite from "@/components/common/button/Favorite";
import { getRegionTranslation } from "@/lib/utils/translationUtils";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import ReviewAvg from "@/components/searchMover/[id]/ReviewAvg";
import ReviewList from "@/components/searchMover/[id]/ReviewList";
import { IMoverInfo } from "@/types/mover.types";
import { IReview } from "@/types/review";
import findMoverApi from "@/lib/api/findMover.api";

const MoverMyPage = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("mover");
  const tRegions = useTranslations("regions");
  const tShared = useTranslations();
  const [profile, setProfile] = useState<IMoverInfo | null>(null);
  const [allReviews, setAllReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        setError("");

        // 먼저 현재 사용자 정보를 가져옴
        const userRes = await userApi.getUser();

        if (!userRes.success || !userRes.data) {
          setError("사용자 정보를 불러오는데 실패했습니다.");
          return;
        }

        const userId = userRes.data.id;

        // 기사님 정보 가져오기
        const moverData = await findMoverApi.fetchMoverDetail(userId, locale);

        if (moverData) {
          setProfile(moverData);
        } else {
          setError("기사님 정보를 불러오는데 실패했습니다.");
          return;
        }
      } catch (err) {
        setError("기사님 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [locale]);

  // 전체 리뷰 데이터 가져오기 (ReviewAvg용) - 완료된 리뷰만
  useEffect(() => {
    if (profile) {
      const fetchAllReviews = async () => {
        try {
          const response = await findMoverApi.getMoverReviews(profile.id, 1, 20, locale, "COMPLETED");
          setAllReviews(response.data.items as unknown as IReview[]);
        } catch (error) {
          setAllReviews([]);
        }
      };

      fetchAllReviews();
    }
  }, [profile, locale]);

  if (error !== "") {
    return (
      <div className="bg-bg-primary flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="text-state-error mb-4 text-lg">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-400 hover:bg-primary-500 rounded-lg px-4 py-2 text-white"
          >
            {tShared("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-bg-primary flex min-h-screen w-full items-center justify-center">
        <div className="text-lg">{t("myPage.profileNotFound")}</div>
      </div>
    );
  }

  return (
    <main className="bg-bg-primary min-h-screen" role="main" aria-label="기사님 마이페이지">
      <header>
        <div className="relative w-full h-[122px] md:h-[157px] lg:h-[180px]">
          <Image src={defaultHeader} alt="기사님 프로필 배너" fill priority sizes="100vw" className="object-cover" />
        </div>
      </header>

      {/* 스켈레톤 UI */}
      {isLoading ? (
        <div className="mx-auto max-w-6xl px-8 py-8">
          <div className="flex flex-col gap-8 md:flex-row md:gap-12 lg:flex-row lg:gap-24">
            <div className="flex w-full max-w-[821px] flex-col gap-10">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-[20px]" />
                <div className="flex flex-col gap-2">
                  <div className="w-32 h-8 bg-gray-200 animate-pulse rounded" />
                  <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-full h-4 bg-gray-200 animate-pulse rounded" />
                <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-8 py-8">
          <div className="flex flex-col gap-8 md:flex-row md:gap-12 lg:flex-row lg:gap-24">
            <div className="flex w-full max-w-[821px] flex-col gap-10">
              <section aria-label="프로필 정보" className="flex flex-col items-start justify-start gap-8 self-stretch">
                <div className="flex flex-col items-start justify-start gap-4 self-stretch">
                  <div className="inline-flex items-end justify-start gap-3 self-stretch">
                    {profile.profileImage ? (
                      <Image
                        src={profile.profileImage}
                        alt={`${profile.nickname} 기사님 프로필 사진`}
                        width={80}
                        height={85}
                        sizes="80px"
                        className="h-20 w-20 rounded-[20px] object-cover"
                      />
                    ) : (
                      <Image
                        src={defaultProfileImage}
                        alt={`${profile.nickname} 기사님 기본 프로필 사진`}
                        width={80}
                        height={85}
                        sizes="80px"
                        className="h-20 w-20 rounded-[20px] object-cover"
                      />
                    )}
                    <div className="inline-flex flex-col items-start justify-end gap-2">
                      <div className="inline-flex items-center justify-start gap-1">
                        <h1 className="justify-center text-2xl leading-loose font-semibold text-gray-800">
                          {profile.nickname}
                        </h1>
                      </div>
                      <div className="inline-flex items-center justify-start gap-1">
                        <Favorite
                          isFavorited={true}
                          favoriteCount={profile.favoriteCount || 0}
                          moverId={profile.id}
                          favoritedColor="text-black"
                          unfavoritedColor="text-black"
                          textColor="text-gray-500"
                          heartPosition="left"
                          onFavoriteChange={() => {}}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start gap-3 self-stretch">
                    <div className="justify-start self-stretch text-lg leading-relaxed font-semibold text-gray-800">
                      {profile.introduction}
                    </div>
                    <div className="justify-start self-stretch text-base leading-relaxed font-normal text-gray-500">
                      {profile.description}
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-4 md:hidden">
                  <button
                    onClick={() => router.push(`/${locale}/profile/edit`)}
                    className="bg-primary-400 rounded-16 hover:bg-primary-500 flex h-16 w-full cursor-pointer items-center justify-center gap-2 px-6 py-3 font-semibold text-white shadow-md transition-colors"
                    aria-label="프로필 수정하기"
                  >
                    {t("myPage.editProfile")}
                    <Image src={editIcon} alt="편집 아이콘" className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
                    className="rounded-16 hover:bg-bg-secondary inline-flex h-16 w-full cursor-pointer items-center justify-center self-stretch p-4 outline-1 outline-offset-[-1px] outline-gray-200 transition-colors"
                    aria-label="기본 정보 수정하기"
                  >
                    <div className="flex items-center justify-start gap-1.5">
                      <div className="justify-center text-center text-lg leading-relaxed font-semibold text-neutral-400">
                        {t("myPage.editBasicInfo")}
                      </div>
                      <div className="relative h-6 w-6 overflow-hidden">
                        <Image src={editGrayIcon} alt="편집 아이콘" className="h-6 w-6" />
                      </div>
                    </div>
                  </button>
                </div>

                <div className="hidden w-full flex-row gap-4 md:flex lg:hidden">
                  <button
                    onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
                    className="rounded-16 hover:bg-bg-secondary inline-flex h-16 flex-1 cursor-pointer items-center justify-center p-4 outline-1 outline-offset-[-1px] outline-gray-200 transition-colors"
                    aria-label="기본 정보 수정하기"
                  >
                    <div className="flex items-center justify-start gap-1.5">
                      <div className="justify-center text-center text-lg leading-relaxed font-semibold text-neutral-400">
                        {t("myPage.editBasicInfo")}
                      </div>
                      <div className="relative h-6 w-6 overflow-hidden">
                        <Image src={editGrayIcon} alt="편집 아이콘" className="h-6 w-6" />
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => router.push(`/${locale}/profile/edit`)}
                    className="bg-primary-400 rounded-16 hover:bg-primary-500 flex h-16 flex-1 cursor-pointer items-center justify-center gap-2 px-6 py-3 font-semibold text-white shadow-md transition-colors"
                    aria-label="프로필 수정하기"
                  >
                    {t("myPage.editProfile")}
                    <Image src={editIcon} alt="편집 아이콘" className="h-6 w-6" />
                  </button>
                </div>
              </section>

              <section aria-label="활동 현황" className="flex flex-col items-start justify-start gap-4 self-stretch">
                <h2 className="justify-start self-stretch text-xl leading-loose font-semibold text-neutral-800">
                  {t("myPage.activityStatus")}
                </h2>
                <div className="bg-bg-secondary rounded-24 inline-flex h-28 items-center justify-between self-stretch border border-gray-200 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40">
                  <div className="inline-flex flex-1 flex-col items-center justify-start gap-1">
                    <div className="justify-start self-stretch text-center text-sm leading-relaxed font-normal whitespace-nowrap text-gray-800 sm:text-base">
                      {t("myPage.inProgress")}
                    </div>
                    <div className="text-primary-400 justify-center self-stretch text-center text-lg leading-loose font-bold sm:text-xl">
                      {profile.completedCount} {tShared("shared.units.cases")}
                    </div>
                  </div>
                  <div className="inline-flex flex-1 flex-col items-center justify-start gap-1">
                    <div className="justify-start text-center text-sm leading-relaxed font-normal whitespace-nowrap text-gray-800 sm:text-base">
                      {t("myPage.reviews")}
                    </div>
                    <div className="inline-flex items-center justify-start gap-1.5">
                      <div className="text-primary-400 justify-center text-lg leading-loose font-bold sm:text-xl">
                        {(profile.averageRating || 0).toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex flex-1 flex-col items-center justify-start gap-1">
                    <div className="justify-start self-stretch text-center text-sm leading-relaxed font-normal whitespace-nowrap text-gray-800 sm:text-base">
                      {t("myPage.totalExperience")}
                    </div>
                    <div className="text-primary-400 justify-center self-stretch text-center text-lg leading-loose font-bold sm:text-xl">
                      {profile.experience} {tShared("shared.units.years")}
                    </div>
                  </div>
                </div>
              </section>

              <section aria-label="제공 서비스" className="flex flex-col items-start justify-start gap-4">
                <h2 className="justify-start text-xl leading-loose font-semibold text-neutral-800">
                  {t("myPage.providedServices")}
                </h2>
                <div className="inline-flex items-start justify-start gap-1.5 lg:gap-3">
                  {profile.serviceTypes.map((serviceType: any, idx: number) => {
                    const serviceName = serviceType.service?.name || serviceType;
                    const translatedText = tShared(`service.${serviceName}`);

                    return (
                      <CircleTextLabel
                        key={idx}
                        text={translatedText}
                        clickAble={false}
                        hasBorder1={true}
                        hasBorder2={true}
                      />
                    );
                  })}
                </div>
              </section>

              <section aria-label="서비스 지역" className="flex flex-col items-start justify-start gap-4">
                <h2 className="justify-start text-xl leading-loose font-semibold text-neutral-800">
                  {t("myPage.serviceAreas")}
                </h2>
                <div className="flex max-w-full flex-wrap items-start gap-1.5 lg:gap-3">
                  {profile.serviceRegions.map(
                    (region: any, idx: number) => (
                      <CircleTextLabel
                        key={idx}
                        text={getRegionTranslation(typeof region === "string" ? region : region.region, tRegions)}
                        clickAble={false}
                        hasBorder1={true}
                        hasBorder2={false}
                      />
                    ),
                  )}
                </div>
              </section>

              <div className="h-0 w-full outline-1 outline-offset-[-0.50px] outline-gray-200" />
              
              <section aria-label="리뷰 및 평가" className="flex flex-col items-start justify-start gap-10 self-stretch">
                <div className="rounded-24 w-full bg-white p-6">
                  <ReviewAvg mover={profile} reviews={allReviews} />
                </div>

                <div className="w-full">
                  <ReviewList moverId={profile.id} />
                </div>
              </section>
            </div>

            <aside aria-label="편집 메뉴" className="mt-16 hidden min-w-[200px] flex-col gap-4 lg:flex">
              <button
                onClick={() => router.push(`/${locale}/profile/edit`)}
                className="bg-primary-400 rounded-16 hover:bg-primary-500 flex cursor-pointer items-center justify-center gap-2 px-6 py-3 font-semibold text-white shadow-md transition-colors lg:h-16 lg:w-[283px]"
                aria-label="프로필 수정하기"
              >
                {t("myPage.editProfile")}
                <Image src={editIcon} alt="편집 아이콘" className="h-6 w-6" />
              </button>
              <button
                onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
                className="rounded-16 hover:bg-bg-secondary inline-flex h-16 cursor-pointer items-center justify-center self-stretch p-4 outline-1 outline-offset-[-1px] outline-gray-200 transition-colors lg:w-[283px]"
                aria-label="기본 정보 수정하기"
              >
                <div className="flex items-center justify-start gap-1.5">
                  <div className="justify-center text-center text-lg leading-relaxed font-semibold text-neutral-400">
                    {t("myPage.editBasicInfo")}
                  </div>
                  <div className="relative h-6 w-6 overflow-hidden">
                    <Image src={editGrayIcon} alt="편집 아이콘" className="h-6 w-6" />
                  </div>
                </div>
              </button>
            </aside>
          </div>
        </div>
      )}
    </main>
  );
};

export default MoverMyPage;