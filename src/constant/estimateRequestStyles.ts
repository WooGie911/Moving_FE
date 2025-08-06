// 견적요청 관련 공통 스타일 상수들

export const ESTIMATE_REQUEST_CARD_STYLES = {
  // MovingTypeCard 스타일
  movingType: {
    base: "w-full rounded-2xl border flex flex-row items-center gap-4 px-4 py-5 transition-colors duration-200 lg:px-6 lg:py-6",
    selected: "border-primary-400 bg-primary-50",
    unselected: "border-gray-200 bg-white",
    radioBase: "inline-block h-6 w-6 items-center justify-center rounded-full border-[1px] transition-colors",
    radioSelected: "border-primary-400 bg-primary-400",
    radioUnselected: "border-gray-300 bg-white",
    textContainer: "flex w-2/3 flex-col items-start",
    radioContainer: "mb-2",
    textArea: "text-left",
    title: "text-black-500 text-base leading-[26px] font-semibold",
    description: "text-[14px] leading-6 font-normal text-gray-500",
    imageContainer: "flex w-1/3 items-center justify-end",
  },

  // AddressCard 스타일
  address: {
    container:
      "flex min-w-65 flex-col items-start gap-4 rounded-2xl border px-4 pt-5 pb-6 shadow-[2px_2px_10px_0px_rgba(224,224,224,0.20)] transition-colors",
    selected: "border-primary-400 bg-primary-100",
    unselected: "border-border-light bg-white",
    postalCode: "text-black-250 text-[14px] leading-6 font-semibold md:text-base md:leading-[26px]",
    addressText: "text-black-250 text-[14px] leading-6 font-normal md:text-base",
    addressRow: "flex w-full items-center gap-2",
    labelContainer: "flex-shrink-0 w-16",
  },
} as const;

// 애니메이션 스타일 (CSS 문자열)
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
    animation: fadeInUp 0.5s ease-out;
  }
`;
