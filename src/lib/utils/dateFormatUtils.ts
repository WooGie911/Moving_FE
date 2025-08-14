// 날짜 포맷 관련 유틸리티 함수들

// 견적신청일 포맷을 위한 번역 키 반환
export const getRequestDateFormatKeys = () => {
  return {
    year: "dateFormat.year",
    month: "dateFormat.month",
    day: "dateFormat.day",
  };
};

// 이사일 포맷을 위한 번역 키 반환
export const getMovingDateFormatKeys = () => {
  return {
    year: "dateFormat.year",
    month: "dateFormat.month",
    day: "dateFormat.day",
    weekdays: {
      sunday: "weekdays.sunday",
      monday: "weekdays.monday",
      tuesday: "weekdays.tuesday",
      wednesday: "weekdays.wednesday",
      thursday: "weekdays.thursday",
      friday: "weekdays.friday",
      saturday: "weekdays.saturday",
    },
  };
};

// 날짜 포맷 함수들 (번역된 텍스트를 받아서 포맷)
export const formatRequestDate = (dateStr: string, yearSuffix: string, monthSuffix: string, daySuffix: string) => {
  const date = new Date(dateStr);
  // UTC 기준으로 날짜를 가져와서 시간대 변환 문제를 방지
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  // 영어인 경우 MM/DD/YYYY 형식
  if (monthSuffix === "/" && yearSuffix === "" && daySuffix === "") {
    return `${month}/${day}/${year}`;
  }
  // 한국어, 중국어인 경우 YYYY년 MM월 DD일 형식
  else {
    return `${year}${yearSuffix} ${month}${monthSuffix} ${day}${daySuffix}`;
  }
};

export const formatDateWithDay = (
  dateStr: Date,
  yearSuffix: string,
  monthSuffix: string,
  daySuffix: string,
  weekdays: string[],
) => {
  const date = new Date(dateStr);
  // UTC 기준으로 날짜를 가져와서 시간대 변환 문제를 방지
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const dayOfWeek = weekdays[date.getUTCDay()];

  // 영어인 경우 MM/DD/YYYY 형식
  if (monthSuffix === "/" && yearSuffix === "" && daySuffix === "") {
    return `${month}/${day}/${year} (${dayOfWeek})`;
  }
  // 한국어, 중국어인 경우 YYYY년 MM월 DD일 형식
  else {
    return `${year}${yearSuffix} ${month}${monthSuffix} ${day}${daySuffix} (${dayOfWeek})`;
  }
};
