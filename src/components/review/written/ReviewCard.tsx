import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import React from "react";
import Image from "next/image";
/* 기사님 icon */
import estimateIcon from "@/assets/icon/etc/icon-estimate.png";
import Profile from "@/assets/img/mascot/moverprofile-lg.png";
import StarFill from "@/assets/icon/star/icon-star.svg";
import Star from "@/assets/icon/star/icon-empty-star.svg";

// 공통 wrapper 스타일
const CardWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`rounded-[20px] border border-[#F2F2F2] shadow-[2px_2px_10px_0px_#DCDCDC33] ${className}`}>
      {children}
    </div>
  );
};

const ReviewCard = () => {
  return (
    <div className="relative w-full">
      {/* 모바일 디자인 */}
      <CardWrapper className="w-full px-5 py-6 transition-all duration-300 ease-in-out md:pointer-events-none md:absolute md:scale-0 md:opacity-0">
        <div>
          {/* chip 영역 */}
          <div className="flex gap-2">
            <MoveTypeLabel type="small" />
            <MoveTypeLabel type="document" />
          </div>
          {/* 기사님 정보 영역 */}
          <div className="mt-3 flex justify-between">
            <div className="flex flex-col items-start gap-2">
              <Image src={estimateIcon} alt="기사님 인증" width={16} height={18.2} />
              <div>
                <span className="text-black-300 text-base leading-[26px] font-semibold">김코드 기사님</span>
              </div>
            </div>
            <div className="relative h-[50px] w-[50px]">
              <Image src={Profile} alt="기사님 프로필" fill />
            </div>
          </div>
          <hr className="my-4 border-[#F2F2F2]" />
          {/* 사용자가 보낸 견적 정보 */}
          <div className="flex justify-between">
            <div className="flex flex-col items-start">
              <span className="text-xs leading-[18px] font-normal text-gray-500">출발지</span>
              <span className="text-black-100 text-sm leading-[22px] font-medium">서울시 중구</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs leading-[18px] font-normal text-gray-500">도착지</span>
              <span className="text-black-100 text-sm leading-[22px] font-medium">경기도 수원시</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs leading-[18px] font-normal text-gray-500">이사일</span>
              <span className="text-black-100 text-sm leading-[22px] font-medium">2024년 07월 01일</span>
            </div>
          </div>
          <hr className="my-4 border-[#F2F2F2]" />
          {/* 별점 영역 */}
          <div className="mb-3 flex">
            <Image src={StarFill} alt="별점" width={20} height={20} />
            <Image src={StarFill} alt="별점" width={20} height={20} />
            <Image src={StarFill} alt="별점" width={20} height={20} />
            <Image src={StarFill} alt="별점" width={20} height={20} />
            <Image src={StarFill} alt="별점" width={20} height={20} />
          </div>
          <span className="text-black-400 text-base leading-[26px] font-medium">
            처음 견적 받아봤는데, 엄청 친절하시고 꼼꼼하세요! 귀찮게 이것저것 물어봤는데 잘 알려주셨습니다. 원룸 이사는
            믿고 맡기세요! :) 곧 이사 앞두고 있는 지인분께 추천드릴 예정입니다!
          </span>
          <div className="mt-4 flex items-center justify-end gap-[6px]">
            <span className="text-xs leading-[18px] font-normal text-gray-300">작성일</span>
            <span className="text-xs leading-[18px] font-normal text-gray-300">2024년 07월 01일</span>
          </div>
        </div>
      </CardWrapper>

      {/* 태블릿 디자인 */}
      <CardWrapper className="inline-flex min-w-[588px] scale-0 flex-col items-end justify-end gap-5 bg-white p-10 opacity-0 shadow-[2px_2px_10px_0px_rgba(220,220,220,0.20)] outline outline-[0.50px] outline-offset-[-0.50px] outline-zinc-100 transition-all duration-300 ease-in-out md:pointer-events-auto md:scale-100 md:opacity-100">
        <div className="inline-flex items-start justify-start gap-5 self-stretch">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-zinc-800">
            <Image className="relative h-20 w-20" src={Profile} alt="기사님 프로필" fill />
          </div>
          <div className="inline-flex flex-1 flex-col items-start justify-start gap-2">
            <div className="flex flex-col items-start justify-center self-stretch">
              <div className="inline-flex items-center justify-start gap-1.5">
                <div className="relative flex h-5 w-4 items-center justify-center">
                  <Image src={estimateIcon} alt="기사님 인증" width={16} height={18.2} />
                </div>
                <div className="flex items-center justify-start gap-1">
                  <div className="text-2lg text-black-300 justify-center leading-relaxed font-bold">김코드</div>
                  <div className="text-2lg text-black-300 justify-center leading-relaxed font-bold">기사님</div>
                </div>
              </div>
              <div className="text-md leading-6 font-normal text-gray-500">
                이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다.
              </div>
            </div>

            <MoveTypeLabel type="small" />
          </div>
        </div>
        <div className="inline-flex items-start justify-between self-stretch">
          <div className="flex flex-1 items-center justify-start gap-5">
            <div className="inline-flex flex-col items-start justify-start">
              <div className="inline-flex items-center justify-start gap-1">
                <div className="justify-center text-center font-['Pretendard'] text-sm leading-normal font-normal text-zinc-500">
                  출발지
                </div>
              </div>
              <div className="justify-center font-['Pretendard'] text-sm leading-normal font-medium text-zinc-600">
                서울시 중구
              </div>
            </div>
            <div className="h-0 w-12 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-zinc-100"></div>
            <div className="inline-flex flex-col items-start justify-center">
              <div className="inline-flex items-center justify-start gap-1">
                <div className="justify-center text-center font-['Pretendard'] text-sm leading-normal font-normal text-zinc-500">
                  도착지
                </div>
              </div>
              <div className="justify-center font-['Pretendard'] text-sm leading-normal font-medium text-zinc-600">
                경기도 수원시
              </div>
            </div>
            <div className="h-0 w-12 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-zinc-100"></div>
            <div className="inline-flex flex-col items-start justify-center">
              <div className="inline-flex items-center justify-start gap-1">
                <div className="justify-center text-center font-['Pretendard'] text-sm leading-normal font-normal text-zinc-500">
                  이사일
                </div>
              </div>
              <div className="justify-center font-['Pretendard'] text-sm leading-normal font-medium text-zinc-600">
                2024년 07월 01일 (월)
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-3 self-stretch">
          <div className="inline-flex items-start justify-start">
            <div data-size="sm" data-state="Active" className="relative h-5 w-5 overflow-hidden">
              <Image src={StarFill} alt="별점" width={20} height={20} />
            </div>
            <div data-size="sm" data-state="Active" className="relative h-5 w-5 overflow-hidden">
              <Image src={StarFill} alt="별점" width={20} height={20} />
            </div>
            <div data-size="sm" data-state="Active" className="relative h-5 w-5 overflow-hidden">
              <Image src={StarFill} alt="별점" width={20} height={20} />
            </div>
            <div data-size="sm" data-state="Active" className="relative h-5 w-5 overflow-hidden">
              <Image src={StarFill} alt="별점" width={20} height={20} />
            </div>
            <div data-size="sm" data-state="Active" className="relative h-5 w-5 overflow-hidden">
              <Image src={StarFill} alt="별점" width={20} height={20} />
            </div>
          </div>
          <div className="text-2lg text-black-400 leading-[26px] font-medium">
            처음 견적 받아봤는데, 엄청 친절하시고 꼼꼼하세요! 귀찮게 이것저것 물어봤는데 잘 알려주셨습니다. 원룸 이사는
            믿고 맡기세요! :) 곧 이사 앞두고 있는 지인분께 추천드릴 예정입니다!
          </div>
        </div>
      </CardWrapper>
    </div>
  );
};

export default ReviewCard;
