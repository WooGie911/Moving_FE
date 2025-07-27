"use client";

import React, { useEffect, useState, useCallback } from "react";
import userApi from "@/lib/api/user.api";
import reviewApi from "@/lib/api/review.api";
import Image from "next/image";
import defaultHeader from "@/assets/img/etc/detailHeader.png";
import editIcon from "@/assets/icon/edit/icon-edit.png";
import editGrayIcon from "@/assets/icon/edit/icon-edit-gray.svg";
import chatIcon from "@/assets/icon/etc/icon-chat.png";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import Favorite from "@/components/common/button/Favorite";
import { regionLabelMap } from "@/lib/utils/regionMapping";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import ReviewAvg from "@/components/searchMover/[id]/ReviewAvg";
import ReviewList from "@/components/searchMover/[id]/ReviewList";
import { IMoverInfo, IReceivedReview } from "@/types/findMover";

interface IMoverInfoExtended extends IMoverInfo {
  moverImage?: string;
  isVeteran?: boolean;
  shortIntro?: string;
  detailIntro?: string;
  workedCount?: number;
  career?: number;
  totalFavoriteCount?: number;
  currentAreas?: string[];
}

const MoverMyPage = () => {
  const router = useRouter();
  const locale = useLocale();
  const [profile, setProfile] = useState<IMoverInfoExtended | null>(null);
  const [reviews, setReviews] = useState<IReceivedReview[]>([]);
  const [reviewStats, setReviewStats] = useState<{ averageRating: number; totalReviewCount: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await userApi.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
        } else {
          setError("프로필을 불러오는데 실패했습니다.");
        }
      } catch (err) {
        setError("프로필을 불러오는데 실패했습니다.");
        console.error("프로필 조회 오류:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // 리뷰 데이터를 받아서 평균 평점 계산에 사용
  const handleReviewsFetched = useCallback((fetchedReviews: IReceivedReview[]) => {
    setReviews(fetchedReviews);
  }, []);

  // 리뷰 통계 데이터 가져오기
  useEffect(() => {
    if (!profile?.id) return;

    const fetchReviewStats = async () => {
      try {
        const stats = await reviewApi.fetchMoverReviewStats(String(profile.id));
        setReviewStats({
          averageRating: stats.averageRating,
          totalReviewCount: stats.totalReviewCount
        });
      } catch (error) {
        console.error("리뷰 통계 조회 실패:", error);
        // API 실패 시 현재 리뷰 데이터로 계산
        if (reviews.length > 0) {
          setReviewStats({
            averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
            totalReviewCount: reviews.length
          });
        }
      }
    };

    fetchReviewStats();
  }, [profile?.id, reviews.length]);



  const getServiceName = (serviceType: string): string => {
    const serviceNameMap: { [key: string]: string } = {
      "SMALL": "소형이사",
      "HOME": "가정이사", 
      "OFFICE": "사무실이사"
    };
    return serviceNameMap[serviceType] || serviceType;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-lg text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-lg">프로필 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
                  {profile.moverImage ? (
                    <Image 
                      src={profile.moverImage}
                      alt="profile-image"
                      width={80}
                      height={85}
                      className="w-20 h-20 rounded-[20px] object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-[20px] bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">👤</span>
                    </div>
                  )}
                  <div className="inline-flex flex-col justify-end items-start gap-2">
                    <div className="inline-flex justify-start items-center gap-1">
                      {profile.isVeteran && (
                        <Image src={chatIcon} alt="veteran-icon" className="w-6 h-6" />
                      )}
                      <div className="justify-center text-zinc-800 text-2xl font-semibold leading-loose">{profile.nickname}</div>
                    </div>
                    <div className="inline-flex justify-start items-center gap-1">
                      <Favorite
                        isFavorited={true}
                        favoriteCount={profile.totalFavoriteCount || 0}
                        moverId={String(profile.id)}
                        favoritedColor="text-black"
                        unfavoritedColor="text-black"
                        textColor="text-zinc-500"
                        heartPosition="left"
                        onFavoriteChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="self-stretch justify-start text-zinc-800 text-lg font-semibold leading-relaxed">
                    {profile.shortIntro}
                  </div>
                  <div className="self-stretch justify-start text-zinc-500 text-base font-normal leading-relaxed">
                    {profile.detailIntro}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 w-full md:hidden">
                <button 
                  onClick={() => router.push(`/${locale}/profile/edit`)}
                  className="flex items-center justify-center gap-2 px-6 py-3 w-full h-16 bg-[#F9502E] text-white font-semibold rounded-2xl hover:bg-[#e04322] transition-colors shadow-md cursor-pointer"
                >
                  내 프로필 수정
                  <Image src={editIcon} alt="edit-icon" className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
                  className="self-stretch h-16 p-4 w-full rounded-2xl outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex justify-center items-center hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-start items-center gap-1.5">
                    <div className="text-center justify-center text-neutral-400 text-lg font-semibold leading-relaxed">기본 정보 수정</div>
                    <div className="w-6 h-6 relative overflow-hidden">
                      <Image src={editGrayIcon} alt="edit-icon" className="w-6 h-6" />
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="hidden md:flex lg:hidden flex-row gap-4 w-full">
                <button 
                  onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
                  className="flex-1 h-16 p-4 rounded-2xl outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex justify-center items-center hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-start items-center gap-1.5">
                    <div className="text-center justify-center text-neutral-400 text-lg font-semibold leading-relaxed">기본 정보 수정</div>
                    <div className="w-6 h-6 relative overflow-hidden">
                      <Image src={editGrayIcon} alt="edit-icon" className="w-6 h-6" />
                    </div>
                  </div>
                </button>
                <button 
                  onClick={() => router.push(`/${locale}/profile/edit`)}
                  className="flex items-center justify-center gap-2 px-6 py-3 flex-1 h-16 bg-[#F9502E] text-white font-semibold rounded-2xl hover:bg-[#e04322] transition-colors shadow-md cursor-pointer"
                >
                  내 프로필 수정
                  <Image src={editIcon} alt="edit-icon" className="w-6 h-6" />
                </button>
              </div>
              
              <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-100" />
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch justify-start text-neutral-800 text-xl font-semibold leading-loose">활동 현황</div>
                <div className="self-stretch h-28 px-40 bg-neutral-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-between items-center">
                  <div className="w-14 inline-flex flex-col justify-start items-center gap-1">
                    <div className="self-stretch text-center justify-start text-zinc-800 text-base font-normal leading-relaxed">진행</div>
                    <div className="self-stretch text-center justify-center text-red-500 text-xl font-bold leading-loose">{String(profile.workedCount || 0)}건</div>
                  </div>
                  <div className="w-24 inline-flex flex-col justify-start items-center gap-1">
                    <div className="text-center justify-start text-zinc-800 text-base font-normal leading-relaxed">리뷰</div>
                    <div className="inline-flex justify-start items-center gap-1.5">
                      <div className="justify-center text-red-500 text-xl font-bold leading-loose">
                        {reviewStats ? reviewStats.averageRating.toFixed(1) : "0.0"}
                      </div>
                    </div>
                  </div>
                  <div className="w-16 inline-flex flex-col justify-start items-center gap-1">
                    <div className="self-stretch text-center justify-start text-zinc-800 text-base font-normal leading-relaxed whitespace-nowrap">총 경력</div>
                    <div className="self-stretch text-center justify-center text-red-500 text-xl font-bold leading-loose">{String(profile.career)}년</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4">
              <div className="justify-start text-neutral-800 text-xl font-semibold leading-loose">제공 서비스</div>
              <div className="inline-flex items-start justify-start gap-1.5 lg:gap-3">
                {profile.serviceTypes && profile.serviceTypes.length > 0 ? (
                  profile.serviceTypes.map((serviceType: string, idx: number) => (
                    <CircleTextLabel
                      key={idx}
                      text={getServiceName(serviceType)}
                      clickAble={false}
                      hasBorder1={true}
                      hasBorder2={true}
                    />
                  ))
                ) : null}
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4">
              <div className="justify-start text-neutral-800 text-xl font-semibold leading-loose">서비스 가능 지역</div>
              <div className="flex flex-wrap items-start gap-1.5 lg:gap-3 max-w-full">
                {profile.currentAreas && profile.currentAreas.map((area: string, idx: number) => (
                  <CircleTextLabel
                    key={idx}
                    text={regionLabelMap[area] || area}
                    clickAble={false}
                    hasBorder1={true}
                    hasBorder2={false}
                  />
                ))}
              </div>
            </div>
            <div className="w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-100" />
            <div className="self-stretch flex flex-col justify-start items-start gap-10">
              <div className="w-full [&>div>div>div]:flex [&>div>div>div]:flex-col [&>div>div>div]:gap-6 [&>div>div>div]:md:flex-row [&>div>div>div]:md:items-start [&>div>div>div]:md:justify-between [&>div>div>div]:lg:flex-row [&>div>div>div]:lg:items-start [&>div>div>div]:lg:justify-between [&>div>div>div>*:last-child]:md:ml-auto [&>div>div>div>*:last-child]:lg:ml-auto [&>div>div>div>*:last-child]:w-full [&>div>div>div>*:last-child]:md:w-[284px] [&>div>div>div>*:last-child]:lg:w-[284px]">
                <ReviewAvg mover={profile} reviews={reviews} />
              </div>
              
              <div className="w-full">
                {profile?.id ? (
                  <ReviewList 
                    moverId={String(profile.id)} 
                    onReviewsFetched={handleReviewsFetched} 
                  />
                ) : (
                  <div className="w-full">
                    <p className="mb-[51px] text-xl font-semibold">리뷰</p>
                    <div className="flex flex-col items-center">
                      <p className="text-lg font-semibold">프로필 정보를 불러올 수 없습니다.</p>
                      <p className="text-md text-[#999999]">로그인 상태를 확인해주세요</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col gap-4 min-w-[200px] mt-16">
            <button 
              onClick={() => router.push(`/${locale}/profile/edit`)}
              className="flex items-center justify-center gap-2 px-6 py-3 lg:w-[283px] lg:h-16 bg-[#F9502E] text-white font-semibold rounded-2xl hover:bg-[#e04322] transition-colors shadow-md cursor-pointer"
            >
              내 프로필 수정
              <Image src={editIcon} alt="edit-icon" className="w-6 h-6" />
            </button>
            <button 
              onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
              className="self-stretch h-16 p-4 lg:w-[283px] rounded-2xl outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex justify-center items-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex justify-start items-center gap-1.5">
                <div className="text-center justify-center text-neutral-400 text-lg font-semibold leading-relaxed">기본 정보 수정</div>
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
