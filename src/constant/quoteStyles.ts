// 견적 요청 페이지 스타일 상수
export const addressBtnClass =
  "border-primary-400 text-primary-400 h-[54px] w-full items-center rounded-2xl border px-6 text-left text-base leading-[26px] font-semibold transition-colors focus:outline-none mb-2";

export const sectionLabelClass = "text-md text-black-400 mb-2 leading-6 font-medium";

export const addressSectionClass = "mb-4 lg:mb-5";

export const addressSectionLastClass = "mb-6 lg:mb-8";

// 애니메이션 스타일
export const fadeInUpAnimation = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }
`;
