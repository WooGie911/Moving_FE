"use client";

import React, { useEffect, useState } from "react";
import userApi from "@/lib/api/user.api";
import Image from "next/image";
import defaultHeader from "@/assets/img/etc/detailHeader.png";
import editIcon from "@/assets/icon/edit/icon-edit.png";
import editGrayIcon from "@/assets/icon/edit/icon-edit-gray.svg";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import Favorite from "@/components/common/button/Favorite";
import { getRegionTranslation, getServiceTypeTranslation } from "@/lib/utils/translationUtils";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import ReviewAvg from "@/components/searchMover/[id]/ReviewAvg";
import ReviewList from "@/components/searchMover/[id]/ReviewList";
import { IMoverInfo } from "@/types/mover.types";
import { IReview, IApiReview } from "@/types/review";
import findMoverApi from "@/lib/api/findMover.api";

// 프로필 상세 정보 타입 정의
type TMoverProfileDetail = {
  name: string;
  nickname: string;
  moverImage: string;
  career: number;
  shortIntro: string;
  detailIntro: string;
  serviceTypes: string[];
  currentAreas: string[];
  isVeteran: boolean;
  workedCount: number;
  averageRating: number;
  totalReviewCount: number;
  totalFavoriteCount: number;
};

// 기본 프로필 상세 정보
const DEFAULT_PROFILE_DETAIL: TMoverProfileDetail = {
  name: "",
  nickname: "",
  moverImage: "",
  career: 0,
  shortIntro: "",
  detailIntro: "",
  serviceTypes: [],
  currentAreas: [],
  isVeteran: false,
  workedCount: 0,
  averageRating: 0,
  totalReviewCount: 0,
  totalFavoriteCount: 0,
};

const MoverMyPage = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("mover");
  const tShared = useTranslations();
  const [profile, setProfile] = useState<IMoverInfo | null>(null);
  const [profileDetail, setProfileDetail] = useState<TMoverProfileDetail>(DEFAULT_PROFILE_DETAIL);
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

        // 상세페이지와 동일한 방식으로 기사님 정보 가져오기
        const moverData = await findMoverApi.fetchMoverDetail(userId, locale);

        if (moverData) {
          setProfile(moverData);
        } else {
          setError("기사님 정보를 불러오는데 실패했습니다.");
        }

        // 프로필 상세 정보 가져오기 (currentAreas 포함)
        const profileRes = await userApi.getProfile(locale);
        if (profileRes.success && profileRes.data) {
          const profileData = profileRes.data as any;
          setProfileDetail({
            name: profileData.name || "",
            nickname: profileData.nickname || "",
            moverImage: profileData.moverImage || "",
            career: profileData.career || 0,
            shortIntro: profileData.shortIntro || "",
            detailIntro: profileData.detailIntro || "",
            serviceTypes: profileData.serviceTypes || [],
            currentAreas: profileData.currentAreas || [],
            isVeteran: profileData.isVeteran || false,
            workedCount: profileData.workedCount || 0,
            averageRating: profileData.averageRating || 0,
            totalReviewCount: profileData.totalReviewCount || 0,
            totalFavoriteCount: profileData.totalFavoriteCount || 0,
          });
        }
      } catch (err) {
        setError("기사님 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [locale]);

  // 전체 리뷰 데이터 가져오기 (ReviewAvg용)
  useEffect(() => {
    if (profile) {
      const fetchAllReviews = async () => {
        try {
          const response = await findMoverApi.getMoverReviews(profile.id, 1, 1000);

          const convertedReviews: IReview[] = response.data.items.map((apiReview: IApiReview) => ({
            id: apiReview.id,
            rating: apiReview.rating,
            content: apiReview.content,
            createdAt: apiReview.createdAt,
            userId: apiReview.customerId,
            moverId: apiReview.moverId,
            quoteId: apiReview.estimateRequestId,
            estimateId: apiReview.estimate?.id || "",
            status: "COMPLETED" as const,
            isPublic: true,
            user: {
              id: apiReview.customerId,
              name: apiReview.nickname,
            },
          }));
          setAllReviews(convertedReviews);
        } catch (error) {
          setAllReviews([]);
        }
      };

      fetchAllReviews();
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="bg-bg-primary flex min-h-screen w-full items-center justify-center">
        <div className="text-lg">{tShared("common.loading")}</div>
      </div>
    );
  }

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
    <div className="bg-bg-primary min-h-screen">
      <div className="hidden lg:block">
        <div className="relative w-full">
          <Image src={defaultHeader} alt="default-header" className="h-[180px] w-full" />
        </div>
      </div>

      <div className="lg:hidden">
        <div className="relative w-full">
          <Image src={defaultHeader} alt="default-header" className="h-[122px] w-full md:h-[157px]" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-8 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12 lg:flex-row lg:gap-24">
          <div className="flex w-full max-w-[821px] flex-col gap-10">
            <div className="flex flex-col items-start justify-start gap-8 self-stretch">
              <div className="flex flex-col items-start justify-start gap-4 self-stretch">
                <div className="inline-flex items-end justify-start gap-3 self-stretch">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt="profile-image"
                      width={80}
                      height={85}
                      className="h-20 w-20 rounded-[20px] object-cover"
                    />
                  ) : (
                    <div className="rounded-24 flex h-20 w-20 items-center justify-center bg-gray-200">
                      <span className="text-lg text-gray-500">👤</span>
                    </div>
                  )}
                  <div className="inline-flex flex-col items-start justify-end gap-2">
                    <div className="inline-flex items-center justify-start gap-1">
                      <div className="justify-center text-2xl leading-loose font-semibold text-gray-800">
                        {profile.nickname}
                      </div>
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
                  className="bg-primary-400 rounded-24 hover:bg-primary-500 flex h-16 w-full cursor-pointer items-center justify-center gap-2 px-6 py-3 font-semibold text-white shadow-md transition-colors"
                >
                  {t("myPage.editProfile")}
                  <Image src={editIcon} alt="edit-icon" className="h-6 w-6" />
                </button>
                <button
                  onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
                  className="rounded-24 hover:bg-bg-secondary inline-flex h-16 w-full cursor-pointer items-center justify-center self-stretch p-4 outline outline-1 outline-offset-[-1px] outline-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-start gap-1.5">
                    <div className="justify-center text-center text-lg leading-relaxed font-semibold text-neutral-400">
                      {t("myPage.editBasicInfo")}
                    </div>
                    <div className="relative h-6 w-6 overflow-hidden">
                      <Image src={editGrayIcon} alt="edit-icon" className="h-6 w-6" />
                    </div>
                  </div>
                </button>
              </div>

              <div className="hidden w-full flex-row gap-4 md:flex lg:hidden">
                <button
                  onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
                  className="rounded-24 hover:bg-bg-secondary inline-flex h-16 flex-1 cursor-pointer items-center justify-center p-4 outline outline-1 outline-offset-[-1px] outline-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-start gap-1.5">
                    <div className="justify-center text-center text-lg leading-relaxed font-semibold text-neutral-400">
                      {t("myPage.editBasicInfo")}
                    </div>
                    <div className="relative h-6 w-6 overflow-hidden">
                      <Image src={editGrayIcon} alt="edit-icon" className="h-6 w-6" />
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => router.push(`/${locale}/profile/edit`)}
                  className="bg-primary-400 rounded-24 hover:bg-primary-500 flex h-16 flex-1 cursor-pointer items-center justify-center gap-2 px-6 py-3 font-semibold text-white shadow-md transition-colors"
                >
                  {t("myPage.editProfile")}
                  <Image src={editIcon} alt="edit-icon" className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col items-start justify-start gap-4 self-stretch">
                <div className="justify-start self-stretch text-xl leading-loose font-semibold text-neutral-800">
                  {t("myPage.activityStatus")}
                </div>
                <div className="bg-bg-secondary rounded-24 inline-flex h-28 items-center justify-between self-stretch border border-gray-200 px-40">
                  <div className="inline-flex flex-1 flex-col items-center justify-start gap-1">
                    <div className="justify-start self-stretch text-center text-base leading-relaxed font-normal whitespace-nowrap text-gray-800">
                      {t("myPage.inProgress")}
                    </div>
                    <div className="text-primary-400 justify-center self-stretch text-center text-xl leading-loose font-bold">
                      {profile.completedCount} {tShared("shared.units.cases")}
                    </div>
                  </div>
                  <div className="inline-flex flex-1 flex-col items-center justify-start gap-1">
                    <div className="justify-start text-center text-base leading-relaxed font-normal whitespace-nowrap text-gray-800">
                      {t("myPage.reviews")}
                    </div>
                    <div className="inline-flex items-center justify-start gap-1.5">
                      <div className="text-primary-400 justify-center text-xl leading-loose font-bold">
                        {profile.avgRating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex flex-1 flex-col items-center justify-start gap-1">
                    <div className="justify-start self-stretch text-center text-base leading-relaxed font-normal whitespace-nowrap text-gray-800">
                      {t("myPage.totalExperience")}
                    </div>
                    <div className="text-primary-400 justify-center self-stretch text-center text-xl leading-loose font-bold">
                      {profile.experience} {tShared("shared.units.years")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-4">
              <div className="justify-start text-xl leading-loose font-semibold text-neutral-800">
                {t("myPage.providedServices")}
              </div>
              <div className="inline-flex items-start justify-start gap-1.5 lg:gap-3">
                {profile.serviceTypes.map((serviceType: any, idx: number) => (
                  <CircleTextLabel
                    key={idx}
                    text={getServiceTypeTranslation(serviceType.service?.name || serviceType, t)}
                    clickAble={false}
                    hasBorder1={true}
                    hasBorder2={true}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-4">
              <div className="justify-start text-xl leading-loose font-semibold text-neutral-800">
                {t("myPage.serviceAreas")}
              </div>
              <div className="flex max-w-full flex-wrap items-start gap-1.5 lg:gap-3">
                {(profileDetail.currentAreas.length > 0 ? profileDetail.currentAreas : profile.serviceRegions).map(
                  (region: any, idx: number) => (
                    <CircleTextLabel
                      key={idx}
                      text={getRegionTranslation(typeof region === "string" ? region : region.region, t)}
                      clickAble={false}
                      hasBorder1={true}
                      hasBorder2={false}
                    />
                  ),
                )}
              </div>
            </div>
            <div className="h-0 w-full outline outline-1 outline-offset-[-0.50px] outline-gray-200" />
            <div className="flex flex-col items-start justify-start gap-10 self-stretch">
              <div className="rounded-24 w-full bg-white p-6">
                <ReviewAvg mover={profile} reviews={allReviews} />
              </div>

              <div className="w-full">
                <ReviewList moverId={profile.id} />
              </div>
            </div>
          </div>

          <div className="mt-16 hidden min-w-[200px] flex-col gap-4 lg:flex">
            <button
              onClick={() => router.push(`/${locale}/profile/edit`)}
              className="bg-primary-400 rounded-24 hover:bg-primary-500 flex cursor-pointer items-center justify-center gap-2 px-6 py-3 font-semibold text-white shadow-md transition-colors lg:h-16 lg:w-[283px]"
            >
              {t("myPage.editProfile")}
              <Image src={editIcon} alt="edit-icon" className="h-6 w-6" />
            </button>
            <button
              onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
              className="rounded-24 hover:bg-bg-secondary inline-flex h-16 cursor-pointer items-center justify-center self-stretch p-4 outline outline-1 outline-offset-[-1px] outline-gray-200 transition-colors lg:w-[283px]"
            >
              <div className="flex items-center justify-start gap-1.5">
                <div className="justify-center text-center text-lg leading-relaxed font-semibold text-neutral-400">
                  {t("myPage.editBasicInfo")}
                </div>
                <div className="relative h-6 w-6 overflow-hidden">
                  <Image src={editGrayIcon} alt="edit-icon" className="h-6 w-6" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoverMyPage;
