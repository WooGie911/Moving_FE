// 견적 요청 관련 타입 정의

// 기본 주소 타입
export interface IAddress {
  roadAddress: string;
  detailAddress: string;
  zoneCode?: string;
  jibunAddress?: string;
  extraAddress?: string;
}

// 폼 상태 타입
export interface IFormState {
  movingType: "" | "small" | "home" | "office";
  movingDate: string;
  isDateConfirmed: boolean;
  departure: IAddress;
  arrival: IAddress;
}

// 백엔드 API 요청/응답 타입
export interface IEstimateRequestPayload {
  movingType: "SMALL" | "HOME" | "OFFICE";
  movingDate: string; // YYYY-MM-DD 형식
  departure: {
    roadAddress: string;
    detailAddress?: string;
    zoneCode?: string;
    jibunAddress?: string;
    extraAddress?: string;
  };
  arrival: {
    roadAddress: string;
    detailAddress?: string;
    zoneCode?: string;
    jibunAddress?: string;
    extraAddress?: string;
  };
  description?: string;
}

export interface IEstimateRequestResponse {
  id: number;
  userId: number;
  movingType: "SMALL" | "HOME" | "OFFICE";
  departureAddress: string;
  arrivalAddress: string;
  departureDetailAddress: string | null;
  arrivalDetailAddress: string | null;
  movingDate: string;
  status: "ACTIVE" | "PENDING" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

// 기본 타입들
export type TMovingType = "" | "small" | "home" | "office";
export type TAddressType = "departure" | "arrival";
export type TSpeechBubbleType = "question" | "answer";

// 컴포넌트 Props 타입들
export interface ISpeechBubbleProps {
  type: TSpeechBubbleType;
  children: React.ReactNode;
  isLatest?: boolean;
  onEdit?: () => void;
}

export interface IChooseAddressBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface IProgressBarProps {
  value: number; // 0~100
}

export interface IMovingTypeCardProps {
  selected: boolean;
  label: string;
  description: string;
  image: React.ReactNode;
  onClick: () => void;
}

export interface IAddressCardProps {
  zoneCode?: string;
  roadAddress?: string;
  jibunAddress?: string;
  selected?: boolean;
}

export interface IAddressModalProps {
  onComplete: (address: IDaumAddress) => void;
  onClose: () => void;
}

export interface IAddressSearchDaumProps {
  onComplete?: (address: IDaumAddress) => void;
}

export interface IMovingTypeSectionProps {
  value: string;
  onSelect: (type: TMovingType) => void;
}

export interface IDateSectionProps {
  value: string;
  onChange: (date: string) => void;
  onComplete: () => void;
  className?: string;
}

export interface IAddressSectionProps {
  label: string;
  value: IAddress;
  onClick: () => void;
}

// 날짜 관련 타입
export interface IDateObj {
  day: number;
  date: Date;
  isOtherMonth: boolean;
}

export interface ICalendarProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  className?: string;
}

// Daum 주소 검색 관련 타입
export interface IDaumAddress {
  zoneCode: string;
  roadAddress: string;
  jibunAddress: string;
  extraAddress: string;
  detailAddress?: string;
}

export interface IDaumAddressData {
  zoneCode: string;
  roadAddress: string;
  jibunAddress: string;
  bname?: string;
}

export interface IDaumPostcodeOptions {
  oncomplete: (data: IDaumAddressData) => void;
  onresize?: (size: { width: number; height: number }) => void;
  width?: string | number;
  height?: string | number;
  maxSuggestItems?: number;
}

export interface IDaumPostcodeInstance {
  open: () => void;
  embed: (element: HTMLElement) => void;
}

export interface IDaumPostcodeConstructor {
  new (options: IDaumPostcodeOptions): IDaumPostcodeInstance;
}

// 공통 컴포넌트 Props 타입들
export interface IEstimateRequestLayoutProps {
  title: string;
  progress: number;
  children: React.ReactNode;
}

export interface IEstimateRequestStepRendererProps {
  step: number;
  showNextQuestion: boolean;
  form: IFormState;
  t: (key: string) => string;
  locale: "ko" | "en" | "zh";
  isFormValid: () => boolean;
  onSelectMovingType: (type: "" | "small" | "home" | "office") => void;
  onDateChange: (date: string) => void;
  onDateComplete: () => void;
  onDepartureModal: () => void;
  onArrivalModal: () => void;
  onConfirmEstimateRequest: (form: IFormState) => void;
  customButtonText?: string;
  showConfirmModal?: (onConfirm: () => void) => void;
}
