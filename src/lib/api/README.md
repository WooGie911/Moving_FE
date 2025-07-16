# 프론트엔드 API 사용법

이 문서는 백엔드 API를 바탕으로 구현된 프론트엔드 API의 사용법을 설명합니다.

## 설치 및 설정

```typescript
// API 모듈들을 import
import { authApi, userApi, findMoverApi, customerQuoteApi, moverEstimateApi, reviewApi } from "@/lib/api";

// 타입들도 함께 import 가능
import type { ICreateQuoteRequest, IPendingQuoteResponse, ICreateEstimateRequest } from "@/lib/api";
```

## 인증 API (authApi)

### 로그인

```typescript
const loginData = {
  email: "test@test.com",
  password: "password123",
};

try {
  const response = await authApi.signIn(loginData);
  console.log("로그인 성공:", response);
} catch (error) {
  console.error("로그인 실패:", error);
}
```

### 회원가입

```typescript
const signupData = {
  name: "김철수",
  email: "test@test.com",
  phoneNumber: "01012345678",
  password: "password123",
  currentRole: "CUSTOMER", // 또는 "MOVER"
};

try {
  const response = await authApi.signUp(signupData);
  console.log("회원가입 성공:", response);
} catch (error) {
  console.error("회원가입 실패:", error);
}
```

### 로그아웃

```typescript
try {
  await authApi.logout();
  console.log("로그아웃 성공");
} catch (error) {
  console.error("로그아웃 실패:", error);
}
```

## 사용자 API (userApi)

### 사용자 정보 조회

```typescript
try {
  const userInfo = await userApi.getUser();
  console.log("사용자 정보:", userInfo);
} catch (error) {
  console.error("사용자 정보 조회 실패:", error);
}
```

## 기사님 검색 API (findMoverApi)

### 기사님 목록 조회

```typescript
const params = {
  region: "SEOUL",
  serviceTypeId: 1,
  search: "김기사",
  sort: "rating",
  cursor: 0,
  take: 10,
};

try {
  const movers = await findMoverApi.fetchMovers(params);
  console.log("기사님 목록:", movers);
} catch (error) {
  console.error("기사님 목록 조회 실패:", error);
}
```

### 찜한 기사님 조회

```typescript
try {
  const favoriteMovers = await findMoverApi.fetchFavoriteMovers();
  console.log("찜한 기사님:", favoriteMovers);
} catch (error) {
  console.error("찜한 기사님 조회 실패:", error);
}
```

## 고객 견적 API (customerQuoteApi)

### 견적 요청 생성

```typescript
const quoteData: ICreateQuoteRequest = {
  movingType: "HOME",
  departure: {
    roadAddress: "서울특별시 강남구 테헤란로 123",
    detailAddress: "101호",
  },
  arrival: {
    roadAddress: "서울특별시 서초구 서초대로 456",
    detailAddress: "202호",
  },
  movingDate: "2024-02-15",
  isDateConfirmed: true,
  description: "안전하고 신속한 이사 부탁드립니다.",
};

try {
  const response = await customerQuoteApi.createQuote(quoteData);
  console.log("견적 요청 생성 성공:", response);
} catch (error) {
  console.error("견적 요청 생성 실패:", error);
}
```

### 진행중인 견적 조회

```typescript
try {
  const pendingQuote = await customerQuoteApi.getPendingQuote();
  console.log("진행중인 견적:", pendingQuote);
} catch (error) {
  console.error("진행중인 견적 조회 실패:", error);
}
```

### 완료된 견적 목록 조회

```typescript
try {
  const receivedQuotes = await customerQuoteApi.getReceivedQuotes();
  console.log("완료된 견적 목록:", receivedQuotes);
} catch (error) {
  console.error("완료된 견적 조회 실패:", error);
}
```

### 견적 확정

```typescript
try {
  const result = await customerQuoteApi.confirmEstimate(estimateId);
  console.log("견적 확정 성공:", result);
} catch (error) {
  console.error("견적 확정 실패:", error);
}
```

### 지정 견적 요청

```typescript
const designateData = {
  message: "안전하고 신속한 이사 부탁드립니다.",
  moverId: 1,
};

try {
  const result = await customerQuoteApi.designateQuote(quoteId, designateData);
  console.log("지정 견적 요청 성공:", result);
} catch (error) {
  console.error("지정 견적 요청 실패:", error);
}
```

### 이용 내역 조회

```typescript
try {
  const history = await customerQuoteApi.getQuoteHistory();
  console.log("이용 내역:", history);
} catch (error) {
  console.error("이용 내역 조회 실패:", error);
}
```

## 기사님 견적 API (moverEstimateApi)

### 견적 생성

```typescript
const estimateData: ICreateEstimateRequest = {
  quoteId: 1,
  price: 150000,
  description: "안전하고 신속한 이사 서비스",
};

try {
  const response = await moverEstimateApi.createEstimate(estimateData);
  console.log("견적 생성 성공:", response);
} catch (error) {
  console.error("견적 생성 실패:", error);
}
```

### 서비스 가능 지역 견적 조회

```typescript
const params = {
  sortBy: "movingDate",
  customerName: "김고객",
  movingType: "SMALL",
};

try {
  const quotes = await moverEstimateApi.getRegionQuotes("SEOUL", params);
  console.log("서비스 가능 지역 견적:", quotes);
} catch (error) {
  console.error("서비스 가능 지역 견적 조회 실패:", error);
}
```

### 지정 견적 조회

```typescript
try {
  const designatedQuotes = await moverEstimateApi.getDesignatedQuotes();
  console.log("지정 견적:", designatedQuotes);
} catch (error) {
  console.error("지정 견적 조회 실패:", error);
}
```

### 견적 상세 조회

```typescript
try {
  const quoteDetail = await moverEstimateApi.getQuoteById(quoteId);
  console.log("견적 상세:", quoteDetail);
} catch (error) {
  console.error("견적 상세 조회 실패:", error);
}
```

### 내가 보낸 견적서 조회

```typescript
try {
  const myEstimates = await moverEstimateApi.getMyEstimates();
  console.log("내가 보낸 견적서:", myEstimates);
} catch (error) {
  console.error("내가 보낸 견적서 조회 실패:", error);
}
```

### 견적 상태 업데이트

```typescript
const statusData = {
  status: "ACCEPTED", // 또는 "REJECTED", "EXPIRED"
};

try {
  const result = await moverEstimateApi.updateEstimateStatus(estimateId, statusData);
  console.log("견적 상태 업데이트 성공:", result);
} catch (error) {
  console.error("견적 상태 업데이트 실패:", error);
}
```

## 리뷰 API (reviewApi)

### 리뷰 작성

```typescript
const reviewData = {
  rating: 5,
  content: "정말 만족스러운 서비스였습니다!",
};

try {
  const result = await reviewApi.postReview(reviewId, reviewData);
  console.log("리뷰 작성 성공:", result);
} catch (error) {
  console.error("리뷰 작성 실패:", error);
}
```

## 에러 처리

모든 API 함수는 에러가 발생할 경우 적절한 에러 메시지와 함께 Error를 throw합니다.

```typescript
try {
  const result = await someApi.someFunction();
  // 성공 처리
} catch (error) {
  if (error instanceof Error) {
    console.error("에러 메시지:", error.message);
    // 사용자에게 에러 메시지 표시
    alert(error.message);
  }
}
```

## 인증 토큰

모든 API 호출은 자동으로 localStorage에서 accessToken을 가져와서 Authorization 헤더에 포함시킵니다. 로그인 후에 토큰이 자동으로 저장되므로 별도의 토큰 관리가 필요하지 않습니다.
