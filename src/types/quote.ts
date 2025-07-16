// 견적 요청 관련 타입 정의
export interface IAddress {
  roadAddress: string;
  detailAddress: string;
}

export interface IFormState {
  movingType: string;
  movingDate: string;
  isDateConfirmed: boolean;
  departure: IAddress;
  arrival: IAddress;
}

// 백엔드 API 요청 타입
export interface ICreateQuoteRequest {
  movingType: "SMALL" | "HOME" | "OFFICE";
  departure: {
    zonecode?: string;
    roadAddress: string;
    jibunAddress?: string;
    extraAddress?: string;
    detailAddress?: string;
  };
  arrival: {
    zonecode?: string;
    roadAddress: string;
    jibunAddress?: string;
    extraAddress?: string;
    detailAddress?: string;
  };
  movingDate: string; // YYYY-MM-DD 형식
  isDateConfirmed: boolean;
  description?: string;
}

export interface ICreateQuoteResponse {
  id: number;
  userId: number;
  movingType: "SMALL" | "HOME" | "OFFICE";
  departureAddr: string;
  arrivalAddr: string;
  departureDetail: string | null;
  arrivalDetail: string | null;
  movingDate: Date;
  status: "ACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

export interface IActiveQuoteResponse {
  id: number;
  userId: number;
  movingType: "SMALL" | "HOME" | "OFFICE";
  departureAddr: string;
  arrivalAddr: string;
  departureDetail: string | null;
  arrivalDetail: string | null;
  movingDate: Date;
  status: "ACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

export type TMovingType = "small" | "home" | "office";
export type TAddressType = "departure" | "arrival";

// SpeechBubble 관련 타입
export type TSpeechBubbleType = "question" | "answer";

export interface ISpeechBubbleProps {
  type: TSpeechBubbleType;
  children: React.ReactNode;
  isLatest?: boolean; // 가장 최근 질문이 나온 후의 답변 여부
  onEdit?: () => void; // 수정하기 클릭 시 동작
}

// ChooseAddressBtn 관련 타입
export interface IChooseAddressBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// Calendar 관련 타입
export interface IDateObj {
  day: number;
  date: Date;
  isOtherMonth: boolean;
}

export interface ICalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
}

// ProgressBar 관련 타입
export interface IProgressBarProps {
  value: number; // 0~100 (진행률 %)
}

// MovingTypeCard 관련 타입
export interface IMovingTypeCardProps {
  selected: boolean;
  label: string;
  description: string;
  image: React.ReactNode;
  onClick: () => void;
}

// AddressCard 관련 타입
export interface IAddressCardProps {
  postalCode?: string;
  roadAddress?: string;
  jibunAddress?: string;
  selected?: boolean;
}

// AddressModal 관련 타입
export interface IAddressModalProps {
  onComplete: (address: IDaumAddress) => void;
  onClose: () => void;
}

// AddressSearchDaum 관련 타입
export interface IDaumAddress {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  extraAddress: string;
  detailAddress?: string;
}

export interface IAddressSearchDaumProps {
  onComplete?: (address: IDaumAddress) => void;
}

// 섹션 컴포넌트 관련 타입
export interface IMovingTypeSectionProps {
  value: string;
  onSelect: (type: TMovingType) => void;
}

export interface IDateSectionProps {
  value: string;
  onChange: (date: string) => void;
  onComplete: () => void;
}

export interface IAddressSectionProps {
  label: string;
  value: IAddress;
  onClick: () => void;
}

// Daum API 관련 타입
export interface IDaumPostcodeOptions {
  oncomplete: (data: IDaumAddressData) => void;
}

export interface IDaumPostcodeInstance {
  open: () => void;
}

export interface IDaumPostcodeConstructor {
  new (options: IDaumPostcodeOptions): IDaumPostcodeInstance;
}

export interface IDaumAddressData {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  bname?: string;
}
