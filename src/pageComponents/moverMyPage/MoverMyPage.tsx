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
        const moverData = await findMoverApi.fetchMoverDetail(userId);
        
        if (moverData) {
          setProfile(moverData);
        } else {
          setError("기사님 정보를 불러오는데 실패했습니다.");
        }
        
        // 프로필 상세 정보 가져오기 (currentAreas 포함)
        const profileRes = await userApi.getProfile();
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
  }, []);

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
      <div className="flex min-h-screen w-full items-center justify-center bg-bg-primary">
        <div className="text-lg">{t("myPage.loading")}</div>
      </div>
    );
  }

  if (error !== "") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-bg-primary">
        <div className="text-center">
          <div className="text-lg text-state-error mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500"
          >
            {t("myPage.retry")}
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-bg-primary">
        <div className="text-lg">{t("myPage.profileNotFound")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
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

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row lg:flex-row gap-8 md:gap-12 lg:gap-24">
          <div className="w-full max-w-[821px] flex flex-col gap-10">
            <div className="self-stretch flex flex-col justify-start items-start gap-8">
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch inline-flex justify-start items-end gap-3">
                  {profile.profileImage ? (
                    <Image 
                      src={profile.profileImage}
                      alt="profile-image"
                      width={80}
                      height={85}
                      className="w-20 h-20 rounded-[20px] object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-24 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">👤</span>
                    </div>
                  )}
                  <div className="inline-flex flex-col justify-end items-start gap-2">
                    <div className="inline-flex justify-start items-center gap-1">
                      <div className="justify-center text-gray-800 text-2xl font-semibold leading-loose">{profile.nickname}</div>
                    </div>
                    <div className="inline-flex justify-start items-center gap-1">
                      <Favorite
                        isFavorited={true}
                        favoriteCount={profile.favoriteCount || 0}
                        moverId={profile.id}
                        favoritedColor="text-black"
                        unfavoritedColor="text-black"
                        textColor="text-gray-500"
                        heartPosition="left"
                        onFavoriteChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="self-stretch justify-start text-gray-800 text-lg font-semibold leading-relaxed">
                    {profile.introduction}
                  </div>
                  <div className="self-stretch justify-start text-gray-500 text-base font-normal leading-relaxed">
                    {profile.description}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 w-full md:hidden">
                <button 
                  onClick={() => router.push(`/${locale}/profile/edit`)}
                  className="flex items-center justify-center gap-2 px-6 py-3 w-full h-16 bg-primary-400 text-white font-semibold rounded-24 hover:bg-primary-500 transition-colors shadow-md cursor-pointer"
                >
                  {t("myPage.editProfile")}
                  <Image src={editIcon} alt="edit-icon" className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
                  className="self-stretch h-16 p-4 w-full rounded-24 outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                  <div className="flex justify-start items-center gap-1.5">
                    <div className="text-center justify-center text-neutral-400 text-lg font-semibold leading-relaxed">{t("myPage.editBasicInfo")}</div>
                    <div className="w-6 h-6 relative overflow-hidden">
                      <Image src={editGrayIcon} alt="edit-icon" className="w-6 h-6" />
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="hidden md:flex lg:hidden flex-row gap-4 w-full">
                <button 
                  onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
                  className="flex-1 h-16 p-4 rounded-24 outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center hover:bg-bg-secondary transition-colors cursor-pointer"
                >
                  <div className="flex justify-start items-center gap-1.5">
                    <div className="text-center justify-center text-neutral-400 text-lg font-semibold leading-relaxed">{t("myPage.editBasicInfo")}</div>
                    <div className="w-6 h-6 relative overflow-hidden">
                      <Image src={editGrayIcon} alt="edit-icon" className="w-6 h-6" />
                    </div>
                  </div>
                </button>
                <button 
                  onClick={() => router.push(`/${locale}/profile/edit`)}
                  className="flex items-center justify-center gap-2 px-6 py-3 flex-1 h-16 bg-primary-400 text-white font-semibold rounded-24 hover:bg-primary-500 transition-colors shadow-md cursor-pointer"
                >
                  {t("myPage.editProfile")}
                  <Image src={editIcon} alt="edit-icon" className="w-6 h-6" />
                </button>
              </div>
              
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch justify-start text-neutral-800 text-xl font-semibold leading-loose">{t("myPage.activityStatus")}</div>
                  <div className="self-stretch h-28 px-40 bg-bg-secondary rounded-24 border border-gray-200 inline-flex justify-between items-center">
                    <div className="flex-1 inline-flex flex-col justify-start items-center gap-1">
                      <div className="self-stretch text-center justify-start text-gray-800 text-base font-normal leading-relaxed whitespace-nowrap">{t("myPage.inProgress")}</div>
                      <div className="self-stretch text-center justify-center text-primary-400 text-xl font-bold leading-loose">{profile.completedCount} {t("cases")}</div>
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-start items-center gap-1">
                      <div className="text-center justify-start text-gray-800 text-base font-normal leading-relaxed whitespace-nowrap">{t("myPage.reviews")}</div>
                      <div className="inline-flex justify-start items-center gap-1.5">
                        <div className="justify-center text-primary-400 text-xl font-bold leading-loose">
                          {profile.avgRating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-start items-center gap-1">
                      <div className="self-stretch text-center justify-start text-gray-800 text-base font-normal leading-relaxed whitespace-nowrap">{t("myPage.totalExperience")}</div>
                      <div className="self-stretch text-center justify-center text-primary-400 text-xl font-bold leading-loose">{profile.experience} {t("years")}</div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4">
              <div className="justify-start text-neutral-800 text-xl font-semibold leading-loose">{t("myPage.providedServices")}</div>
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
            <div className="flex flex-col justify-start items-start gap-4">
              <div className="justify-start text-neutral-800 text-xl font-semibold leading-loose">{t("myPage.serviceAreas")}</div>
              <div className="flex flex-wrap items-start gap-1.5 lg:gap-3 max-w-full">
                {(profileDetail.currentAreas.length > 0 ? profileDetail.currentAreas : profile.serviceRegions).map((region: any, idx: number) => (
                  <CircleTextLabel
                    key={idx}
                    text={getRegionTranslation(typeof region === 'string' ? region : region.region, t)}
                    clickAble={false}
                    hasBorder1={true}
                    hasBorder2={false}
                  />
                ))}
              </div>
            </div>
            <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-200" />
            <div className="self-stretch flex flex-col justify-start items-start gap-10">
              <div className="w-full bg-white rounded-24 p-6">
                <ReviewAvg mover={profile} reviews={allReviews} />
              </div>
              
              <div className="w-full">
                <ReviewList 
                  moverId={profile.id} 
                />
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col gap-4 min-w-[200px] mt-16">
            <button 
              onClick={() => router.push(`/${locale}/profile/edit`)}
              className="flex items-center justify-center gap-2 px-6 py-3 lg:w-[283px] lg:h-16 bg-primary-400 text-white font-semibold rounded-24 hover:bg-primary-500 transition-colors shadow-md cursor-pointer"
            >
              {t("myPage.editProfile")}
              <Image src={editIcon} alt="edit-icon" className="w-6 h-6" />
            </button>
            <button 
              onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
              className="self-stretch h-16 p-4 lg:w-[283px] rounded-24 outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center hover:bg-bg-secondary transition-colors cursor-pointer"
            >
              <div className="flex justify-start items-center gap-1.5">
                <div className="text-center justify-center text-neutral-400 text-lg font-semibold leading-relaxed">{t("myPage.editBasicInfo")}</div>
                <div className="w-6 h-6 relative overflow-hidden">
                  <Image src={editGrayIcon} alt="edit-icon" className="w-6 h-6" />
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
