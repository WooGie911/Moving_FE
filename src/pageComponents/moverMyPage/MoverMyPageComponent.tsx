"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/common/button/Button";
import userApi from "@/lib/api/user.api";
import { useAuth } from "@/providers/AuthProvider";

const MoverMyPage = () => {
  const router = useRouter();
  const { getUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const locale = useLocale();

  useEffect(() => {
    async function fetchProfile() {
      const res = await userApi.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-8 rounded-3xl bg-white px-4 py-10 lg:max-w-[800px]">
        <div className="mb-4 text-2xl font-bold !text-black text-black">기사님 마이페이지</div>
        
        {profile && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* 프로필 정보 */}
            <div className="flex flex-col gap-6">
              <div className="text-xl font-semibold text-zinc-800">프로필 정보</div>
              
              {/* 프로필 이미지 */}
              <div className="flex items-center gap-4">
                {profile.moverImage && (
                  <img
                    src={profile.moverImage}
                    alt="프로필 이미지"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                )}
                <div className="flex flex-col gap-2">
                  <div className="text-lg font-medium">{profile.nickname}</div>
                  <div className="text-sm text-gray-600">경력 {profile.career}년</div>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">활동 지역:</span> {profile.currentAreas?.join(", ")}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">서비스 타입:</span> {profile.serviceTypes?.join(", ")}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">한줄 소개:</span> {profile.shortIntro}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">베테랑 여부:</span> {profile.isVeteran ? "예" : "아니오"}
                </div>
              </div>
            </div>

            {/* 수정 버튼들 */}
            <div className="flex flex-col gap-4">
              <div className="text-xl font-semibold text-zinc-800">설정</div>
              
              <Button
                variant="solid"
                className="h-[54px] w-full rounded-xl bg-[#F9502E] p-4 text-base font-semibold text-white hover:bg-[#e04322]"
                onClick={() => router.push(`/${locale}/moverMyPage/edit`)}
              >
                기본정보 수정
              </Button>
              
              <Button
                variant="outlined"
                className="h-[54px] w-full rounded-xl border-[#F9502E] p-4 text-base font-semibold text-[#F9502E] hover:bg-[#F9502E] hover:text-white"
                onClick={() => router.push(`/${locale}/profile/edit`)}
              >
                프로필 수정
              </Button>
            </div>
          </div>
        )}

        {/* 뒤로가기 버튼 */}
        <div className="mt-8">
          <button
            type="button"
            className="h-[54px] w-full rounded-xl px-6 py-4 text-base font-semibold text-neutral-400 shadow-[4px_4px_10px_0px_rgba(195,217,242,0.20)] outline outline-1 outline-offset-[-1px] outline-stone-300"
            onClick={() => router.back()}
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoverMyPage;
