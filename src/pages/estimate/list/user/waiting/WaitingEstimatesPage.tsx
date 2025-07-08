import { ListTab } from "@/components/estimate/list/ListTab";
import React from "react";
import { RequestQuote } from "./RequestQuote";
import { CardList } from "../CardList";

type Profile = {
  id: number;
  userId: number;
  nickname: string;
  profileImage?: string | undefined | "";
  experience?: number; // 경력
  introduction: string;
  completedCount: number; // 완료된 이사 건수
  avgRating: number; // 평균 평점
  reviewCount: number; // 리뷰 총 개수
  favoriteCount: number; // 찜한 사용자 수
  description: string;
};

type Mover = {
  id: number;
  email: string;
  name: String;
  currentRole: "CUSTOMER" | "MOVER";
  profile: Profile;
};

const profile1 = {
  id: 1,
  userId: 1,
  nickname: "김코드",
  profileImage: "",
  experience: 10,
  introduction: "안녕하세요, 김코드입니다.",
  completedCount: 99,
  avgRating: 4.8,
  reviewCount: 46,
  favoriteCount: 33,
  description: "안녕하세요, 김코드입니다.",
};
const mover1 = {
  id: 1,
  email: "test@test.com",
  name: "김코드",
  currentRole: "MOVER" as const,
  profile: profile1,
};

const UserWaitingEstimatesPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <ListTab userType="User" />
        <RequestQuote
          movingType="소형이사"
          requestDate="2025년 6월 24일"
          movingDate="2025년 7월 8일(화)"
          startPoint="서울시 중랑구"
          endPoint="경기도 수원시"
        />
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
          <div className="flex w-full flex-col items-center justify-center gap-4 px-6 pt-[35px] md:px-18 md:pt-[42px] lg:mx-auto lg:grid lg:max-w-[1200px] lg:grid-cols-2 lg:items-start lg:gap-6">
            <CardList
              movingType="office"
              isDesignated={true}
              estimateId="1"
              estimateState="견적 대기"
              estimateTitle="사무실 이사전문 김코드"
              estimatePrice={170000}
              type="waiting"
              mover={mover1}
            />
            <CardList
              movingType="home"
              isDesignated={true}
              estimateId="1"
              estimateState="견적 대기"
              estimateTitle="예시 견적서 1"
              estimatePrice={170000}
              type="waiting"
              mover={mover1}
            />
            <CardList
              movingType="small"
              isDesignated={false}
              estimateId="1"
              estimateState="견적 대기"
              estimateTitle="예시 견적서 2"
              estimatePrice={100000}
              type="waiting"
              mover={mover1}
            />

            <CardList
              movingType="small"
              isDesignated={false}
              estimateId="1"
              estimateState="견적 대기"
              estimateTitle="예시 견적서 3"
              estimatePrice={100000}
              type="waiting"
              mover={mover1}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserWaitingEstimatesPage;
