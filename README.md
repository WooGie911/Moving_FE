<div align="center">
  <img src="./public/readmeMain.png" alt="Docthru 메인 페이지" width="100%" />
</div>

# 투명하고 합리적인 이사! 무빙 보러가기 -> [무빙](https://www.gomoving.site/ko)

### Back-end 깃허브 [Back-end](https://github.com/WooGie911/Moving_BE)

# 📜 목차

1. [프로젝트 소개](#📝-프로젝트-소개)
2. [기능 구현 영상](#💻-기능-구현-영상)
3. [시스템 아키텍처](#🚧-시스템-아키텍쳐)
4. [기술 스택](#⚙️-기술-스택)
5. [주요 라이브러리](#📚-주요-라이브러리)
6. [팀 소개 및 문서](#👥-팀-소개-및-문서)
7. [개인별 주요 작업 내역](#📋-개인별-주요-작업-내역)
8. [프로젝트 구조](#📁-프로젝트-구조)
9. [주요 기능 상세](#🌟-주요-기능-상세)
10. [성능 최적화 전략](#🚀-성능-최적화-전략)
11. [트러블 슈팅](#💣-트러블-슈팅)

<br/>

# 📝 프로젝트 소개

- 기존 이사 과정의 번거로운 견적 요청과 가격 비교의 어려움을 해결합니다.
  고객이 이사 정보를 등록하면, 검증된 이사업체들이 경쟁적으로 견적을 제시합니다.
  고객은 다양한 견적과 조건을 한눈에 비교해 합리적인 선택이 가능하며, 리뷰를 통해 업체 신뢰도도 확인할 수 있습니다.
  이를 통해 투명하고 공정한 이사 준비와 비용 절감을 지원합니다.

<br/>

# 💻 기능 구현 영상

[![프로젝트 소개 영상 유튜브 썸네일](./public/thumbnail.png)](https://www.youtube.com/watch?v=aVZHjcHTIvc)

<br/>

# 🚧 시스템 아키텍쳐 (추후 변경 예정)

<div align="center">
  <img src="./public/architecture.png" alt="시스템 아키텍처" width="100%" />
</div><br/>

# ⚙️ 기술 스택

### ✅ Language

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

### ✅ Framework & Libraries

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=react-query&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

### ✅ Hosting & Deployment

![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=flat&logo=amazonec2&logoColor=white)
![Route 53](https://img.shields.io/badge/Route_53-8C4FFF?style=flat&logo=amazonroute53&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

### ✅ Storage & Database

![Amazon S3](https://img.shields.io/badge/Amazon_S3-569A31?style=flat&logo=amazons3&logoColor=white)
![Amazon RDS](https://img.shields.io/badge/Amazon_RDS-527FFF?style=flat&logo=amazonrds&logoColor=white)

### ✅ CI/CD

![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=githubactions&logoColor=white)

### ✅ Version Control

![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)

<br/>

# 📚 주요 라이브러리

<details>

<summary>데이터 패칭 / 캐싱</summary>

- **@tanstack/react-query**: 서버 상태 관리와 캐싱
- **@tanstack/react-query-devtools**: React Query 디버깅 도구
</details>

<details>
<summary>상태 관리</summary>

- **zustand**: 경량 클라이언트 상태 관리
</details>

<details>
<summary>국제화(i18n)</summary>

- **next-intl**: 서버/클라이언트 통합 국제화
</details>

<details>
<summary>인증 / 보안</summary>

- **jose**: JWT/JWE/JWS 등 JOSE 스펙 구현
</details>

<details>
<summary>폼</summary>

- **react-hook-form**: 퍼포먼스 중심의 폼 상태 관리
</details>

<details>
<summary>UI / UX 보조</summary>

- **react-toastify**: 토스트 알림
- **react-icons**: 아이콘 세트
- **react-intersection-observer**: 인터섹션 옵저버 훅(무한 스크롤 등)
- **react-simple-star-rating**: 별점 컴포넌트
</details>

<details>
<summary>콘텐츠 파싱 / 보안</summary>

- **dompurify**: XSS 방지용 HTML 정화
- **html-react-parser**: HTML 문자열 → React 노드 파싱
</details>

<details>
<summary>날짜 / 유틸</summary>

- **date-fns**: 날짜 유틸리티
- **lodash.throttle**: 스로틀링 유틸
- **nanoid**: 고유 ID 생성
- **clsx**: 조건부 클래스 문자열 생성
</details>

<details>
<summary>네트워킹 / 실시간</summary>

- **event-source-polyfill**: SSE 폴리필
</details>

<details>
<summary>모니터링</summary>

- **@sentry/nextjs**: Sentry 통합(서버/클라이언트 에러 추적)
</details>

<details>
<summary>개발 도구</summary>

- **eslint**, **eslint-config-next**, **@eslint/eslintrc**: 린팅 구성
- **prettier**, **prettier-plugin-tailwindcss**: 코드/클래스 정렬 포매팅
- **tailwindcss**, **@tailwindcss/postcss**: 스타일링 구성
- **typescript**, **@types/node**, **@types/react**, **@types/react-dom** 등: 타입 시스템
- **jest**, **@testing-library/react**, **@testing-library/jest-dom**, **@testing-library/user-event**: 단위/컴포넌트 테스트
- **cypress**: E2E 테스트
- **@next/bundle-analyzer**: 번들 사이즈 분석
- **@svgr/webpack**: SVG → React 컴포넌트 변환
- **concurrently**: 멀티 스크립트 병렬 실행
</details>

<br/>

# 👥 팀 소개 및 문서

## 팀원 소개

| 이름   | 역할           | GitHub                                           | 개인 개발 보고서                                                 |
| ------ | -------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| 김재욱 | 🍉 팀장        | [@WooGie911](https://github.com/WooGie911)       | [보고서](https://www.notion.so/2155da6dc98c812287d7d940549998e4) |
| 김승준 | 🍒 BE 담당자   | [@y10b](https://github.com/y10b)                 | [보고서](https://www.notion.so/2155da6dc98c81e19d89d0e8adf8d8ff) |
| 백지연 | 🍑 발표 담당자 | [@jyeon03](https://github.com/jyeon03)           | [보고서](https://www.notion.so/2155da6dc98c8111b5e1d87be8af392c) |
| 김수빈 | 🍇 부팀장      | [@subinkim9755](https://github.com/subinkim9755) | [보고서](https://www.notion.so/2155da6dc98c81a1b126fa5807952847) |
| 윤세준 | 🍎 문서 담당자 | [@YSJ0228](https://github.com/YSJ0228)           | [보고서](https://www.notion.so/2155da6dc98c8196b70deae13a63889d) |
| 박민규 | 🍈 FE 담당자   | [@gksktl111](https://github.com/gksktl111/)      | [보고서](https://www.notion.so/2155da6dc98c81e4bc88ead73004b379) |

## 팀 문서

### 📝 [팀 노션](https://admitted-turkey-c17.notion.site/Part4-Team1-Moving-2155da6dc98c80fa89c2f08319b1ef83?pvs=74)

### 📝 [API 문서](https://admitted-turkey-c17.notion.site/API-2155da6dc98c813891ead8eb7218d631)

<br/>

# 📋 개인별 주요 작업 내역 (작성 예정)

<details>
<summary>🍉 김재욱 (팀장)</summary>

## frontend

- **챌린지 카드 컴포넌트**
  - 챌린지 정보 카드 UI 구현
  - 반응형 디자인 적용 (모바일/태블릿/PC)
  - 카테고리/상태 chip 컴포넌트 개발

- **챌린지 상세 페이지**
  - 챌린지 상세 정보 조회 및 상태 관리
  - 작업물 작성/수정 플로우 구현
  - 랭킹 시스템 및 추천 작업물 UI 개발

- **사용자 관련 기능**
  - 사용자 정보 조회 및 관리
  - 나의 챌린지 목록 필터링 구현
  - 서버 액션 기반 인증 처리

## backend

- **유저 및 챌린지 API 구현**
  - 내 정보 조회 및 수정 API
  - 나의 챌린지 목록 조회 API (상태별 필터링)
  - 사용자 등급 관리 시스템 구현

</details>

<details>
<summary>🍒 김승준</summary>

## frontend

- **작업물 상세 페이지**
  - 작업물 수정 및 삭제 버튼 구현
  - 피드백 등록과 수정 및 삭제
  - `useInfiniteQuery`를 사용한 무한 스크롤 피드백 목록 구현
  - `useMutation`을 활용한 피드백 CRUD 및 캐시 자동 갱신

- **알림 모달**
  - 알림 내용 및 알림 일자 출력 구현
  - 읽지 않은 알림 불러오기 기능 구현
  - 알림을 클릭하여 읽음 처리 기능 구현

## backend

- **피드백 시스템**
  - 피드백 CRUD API 구현
  - 피드백 권한 검증 및 예외 처리
  - 마감된 챌린지 피드백 제한 로직

- **알림 시스템**
  - 실시간 알림 API 구현
  - 챌린지 관련 알림 (수정/삭제/상태 변경)
  - 작업물 관련 알림 (추가/수정/삭제)
  - 피드백 관련 알림 (추가/수정/삭제)
  - 본인 활동 제외 알림 로직 구현

- **챌린지 마감 관리**
  - UTC+9 기준 자정 마감 스케줄러 구현
  - 마감된 챌린지 수정/삭제 제한
  - 마감 후 작업물/피드백 생성 제한

</details>

<details>
<summary>🍑 백지연</summary>

### Frontend

- **어드민 챌린지 신청 관리 페이지**
  - 신청 목록 UI, API 연동, 조회, 검색, 정렬 기능
  - 신청 상세 UI, API 연동, 신청 승인, 페이지 이동 기능
- **인증 관련**
  - 유저 정보 조회, 회원가입, 로그아웃 기능
  - 회원가입 페이지 UI, API 연동, 유효성 검사
  - 구글 로그인 버튼 UI, 백엔드 API 연동
- **나의 챌린지 페이지**
  - 신청한 챌린지: 목록/상세 조회 UI, API 연동
  - 참여중/완료한 챌린지: 목록 조회 API 연동, 무한스크롤, 키워드 검색 기능

### Backend

- **어드민 챌린지 관리**
  - 챌린지 신청 승인/거절/삭제 API, 관리자 검증 미들웨어
  - 챌린지 신청 목록 조회 API 구현: 조회, 검색, 정렬 기능
- **구글 로그인**
  - passport 활용하여 google callback 엔드포인트 설정
- **나의 챌린지**
  - 신청한 챌린지 목록/상세 조회 API
  - 참여중/완료한 챌린지 목록 조회 API

</details>

<details>
<summary>🍇 김수빈</summary>

## frontend

- **관리자 작업물/피드백 관리**
  - 관리자 권한 사용자의 작업물 및 피드백 CRUD 기능 구현
  - 다른 사용자의 작업물과 피드백을 직접 수정/삭제할 수 있는 권한 관리

## backend

- **데이터베이스 및 스키마 관리**
  - Render 배포 환경의 PostgreSQL 데이터베이스 구축 및 관리
  - Express + Prisma ORM 기반의 데이터베이스 인터페이스 구현
  - 팀원 피드백 기반 스키마 지속적 개선 및 최적화
  - 목(Mock) 데이터 시딩을 위한 데이터 구조 설계 및 구현

- **백엔드 레포지토리 초기화**
  - Express 기본 설정 및 필수 라이브러리 구성
  - 데이터베이스 연결 및 환경 변수 설정
  - 프로젝트 요구사항에 맞는 폴더 구조 설계
  - 팀 개발을 위한 백엔드 기반 환경 구축

</details>

<details>
<summary>🍎 윤세준</summary>

## frontend

- **나의 챌린지 페이지 구현**
  - `MyChallenges`: 챌린지 검색 및 리스트 조회 컴포넌트
  - `MyApplicationsPage`: 신청한 챌린지 상태 조회 페이지
  - `AppliedChallenges`: 지원한 챌린지 리스트 컴포넌트
  - 챌린지 심사 과정 모니터링 기능

- **공통 컴포넌트**
  - `BtnText`: 재사용 가능한 버튼 컴포넌트 제작

## backend

- **챌린지 상세 조회 API**
  - 엔드포인트: GET /challenges/:id
  - 챌린지 ID 기반 상세 정보 조회
  - 제목, 설명, 생성일 등 챌린지 세부 정보 반환

- **챌린지 수정 API**
  - 엔드포인트: PUT /challenges/:id
  - 챌린지 정보 전체 수정 기능
  - 모든 필드 필수값 검증 로직 구현

</details>

<details>
<summary>🍊 박민규</summary>
 
 ## frontend 
- **챌린지 목록 조회**
  - 필터를 통해 챌린지의 분야, 문서타입, 진행 상태 별로 데이터를 조회
  - 검색어를 통해 데이터를 조회 (초성, 띄어쓰기 적용 가능)

- **챌린지 생성**
  - 챌린지 데이터 정보를 입력하여 챌린지를 생성할 수 있음
  - UX를 고려한 각 input에 에러 메세지 적용

## backkend

- **챌린지 조회 쿼리**
  - 다중 쿼리 스트링을 이용하여 중복되는 필터의 목록을 가져올 수 있음
  - 검색어를 initial로 분해하여 초성 검색 가능
  - 쿼리 전송 시 띄어쓰기와 관계없이 데이터를 불러올 수 있음

</details>

# 📁 프로젝트 구조

```
public/
├── img/                         # 정적 이미지(README, 로고 등)
├── favicon.ico
└── og-image.png

src/
├── app/                         # App Router 엔트리(서버/클라이언트 컴포넌트)
│   ├── [locale]/                # 다국어 라우팅 루트(next-intl)
│   │   ├── (auth)/              # 로그인/회원가입 등 인증 플로우
│   │   ├── estimate/            # 견적 관련 페이지
│   │   ├── estimateRequest/     # 견적 요청 관련 페이지
│   │   ├── favoriteMover/       # 즐겨찾기한 기사님
│   │   ├── moverMyPage/         # 기사님 마이페이지
│   │   ├── profile/             # 프로필(등록/수정)
│   │   ├── review/              # 리뷰 작성/조회
│   │   ├── searchMover/         # 기사님 검색/상세
│   │   ├── layout.tsx
│   │   └── providers.tsx
│   ├── error.tsx
│   ├── globals.css
│   └── layout.tsx
├── assets/                      # 개발용 에셋
├── components/                  # 도메인/공통 UI 컴포넌트
├── constant/                    # 상수 모음
├── hooks/                       # 커스텀 훅
├── i18n/                        # 국제화 라우팅/메시지 키
├── layout/                      # 레이아웃 관련 모듈(보조)
├── lib/                         # API/서버 액션/유틸 등 라이브러리 계층
│   ├── actions/                 # 서버 액션(쿠키 등 서버 전용 로직)
│   ├── api/                     # API 클라이언트(토큰 갱신 포함)
│   └── utils/                   # 공용 유틸 함수
├── messages/                    # 다국어 번역 메시지(ko/en/zh)
├── pageComponents/              # 페이지 조립용 컨테이너 컴포넌트
├── providers/                   # 전역 Provider(Auth/Query 등)
├── services/                    # 도메인 서비스(비즈니스 로직)
├── stores/                      # 전역 상태(zustand)
├── types/                       # 전역 타입 정의
├── utils/                       # 범용 유틸 함수
├── instrumentation-client.ts    # Sentry 등 클라이언트 계측 설정
├── instrumentation.ts           # Sentry 등 서버 계측 설정
└── middleware.ts                # Next 미들웨어(i18n/토큰 존재 등)
```

<br/>

# 🌟 주요 기능 상세 (초안)

<details>
<summary>1. 인증 시스템</summary>

- **유저 타입별 로그인/회원가입**
  - 일반 유저 / 기사님 별도 페이지 및 권한 부여
- **소셜 로그인/회원가입**
  - Google · Naver · Kakao 지원
  - 이메일 가입 시 이메일/전화번호/비밀번호 유효성 검사
- **로그아웃**: 세션/쿠키 해제
- **프로필 등록**
  - 이미지, 별명, 경력, 한 줄 소개, 상세 설명, 서비스·지역 선택
  - 등록 전 전용 기능 차단
- **프로필 수정**
  - 일반 유저: GNB 아바타 → 프로필 수정
  - 기사님: GNB 아바타 → 마이페이지 수정
  </details>

<details>
<summary>2. 견적 요청 </summary>

- **채팅형 이사 정보 입력**: 종류/날짜/출·도착지
- **주소 입력**: 카카오 우편번호 서비스 적용
- **프로그래스 바**로 단계 표시, 각 항목 **수정 가능**
- **요청 제한 규칙**
  - 이사일 경과 후 새 요청 가능
  - 활성 요청 1건만 유지
  - 견적 수: 일반 최대 5, 지정 추가 최대 3 (총 8)
  </details>

<details>
<summary>3. 기사님 찾기</summary>

- **검색/정렬/필터**
  - 별명 검색, 리뷰·평점·경력·확정 횟수 정렬
  - 지역/서비스 필터 + 초기화, **무한 스크롤**
- **상세 보기**: 소개/리뷰/평점
- **찜하기**: 로그인 필요, PC에선 좌측에 최대 3명 표시
- **소셜 공유**: 추천 메시지 + 상세 페이지 URL
- **지정 견적 요청**: 라벨로 강조 전달
</details>

<details>
<summary>4. 견적</summary>

- **받은 견적(일반 유저)**
  - 대기중 견적 리스트(지정 라벨/찜), 완료 이사 견적 히스토리
  - 견적 상세: 가격·기사님 정보 확인, 예약 확정/공유/찜
  - 마이페이지: 확정 이력 조회
- **받은 요청(기사님)**
  - 리스트: 서비스 지역 내 요청만 노출, 지정 요청 분리 강조
  - 필터: 이사 유형/지역/지정, 정렬: 빠른 순/최근 순
  - **견적 보내기 / 반려하기 / 반려 리스트 조회**
  </details>

<details>
<summary>5. 리뷰</summary>

- **작성**: 이사 완료 후 기사님 리뷰
- **조회**
  - 일반 유저: 작성 내역/작성 가능 목록(페이지네이션)
  - 기사님: 받은 리뷰/평점(페이지네이션)
  </details>

<details>
<summary>6. 알림</summary>

- **일반 유저**: 새 견적 / 확정 / 이사 당일 알림
- **기사님**: 새 요청 / 확정 / 이사 당일 알림
</details>

<details>
<summary>7. 다국어</summary>

- 한국어 · 영어 · 중국어 지원
</details>

<details>
<summary>8. 보안</summary>

- 비밀번호 해싱 저장, **HTTPS**
- **CORS**: 프론트 도메인만 허용
- **XSS 방지**: HTML 직접 렌더링 금지
- **CSRF 방지**: SameSite=Strict/Lax
- **SQL 인젝션 방지**: ORM 사용, Raw 시 검증
- **요청 제한**: express-rate-limit
- **프로덕션 에러 노출 차단**
</details>

<details>
<summary>9. 서비스 안정화</summary>

- **CDN**: 정적 리소스 캐싱/배포
- **Sentry**: 모니터링/에러 추적
- **테스트 코드 & 커버리지 측정**
</details>

<details>
<summary>10. 웹 접근성</summary>

- 시멘틱 태그(`<header> <nav> <main> …`)
- WAI-ARIA 속성(`aria-label`, `role` 등)
</details>

<br/>

# 🚀 성능 최적화 전략 (작성 예정)

<details>
<summary>1. 초기 로딩 최적화</summary>

- **코드 스플리팅**
  - 동적 임포트를 통한 컴포넌트 분할
  - 페이지 단위 코드 분할
  - 라이브러리 선택적 로딩

- **리소스 최적화**
  - `next/image`를 통한 이미지 자동 최적화
  - 폰트 최적화 (`next/font`)
  - 정적 자산 캐싱

</details>

<details>
<summary>2. 렌더링 성능</summary>

- **서버 사이드 최적화**
  - 정적 페이지 생성 (SSG)
  - 서버 컴포넌트 적극 활용

- **클라이언트 사이드 최적화**
  - `React.memo`를 통한 불필요한 리렌더링 방지
  - 이벤트 핸들러 최적화

</details>

<details>
<summary>3. 데이터 관리</summary>

- **캐싱 전략**
  - React Query 캐시 활용
  - 브라우저 캐시 정책

- **데이터 프리페칭**
  - 라우트 프리페칭
  - 데이터 프리로딩

</details>

<details>
<summary>4. 사용자 경험</summary>

- **로딩 상태 처리**
  - 스켈레톤 UI
  - 로딩 스피너

- **인터랙션 최적화**
  - 디바운싱 / 쓰로틀링
  - 지연 로딩
  - 무한 스크롤

</details>

<details>
<summary>5. 모니터링 및 분석</summary>

- **성능 메트릭스**
  - Core Web Vitals
  - Lighthouse 점수
  - 사용자 정의 메트릭

- **에러 추적**
  - 에러 바운더리
  - 에러 로깅
  - 성능 모니터링

</details>

<br/>

# 💣 트러블 슈팅 (작성 예정)

<details>
<summary>1. [챌린지] 다중 카테고리 필터링 쿼리 파라미터 처리</summary>

## ⚠️ 문제 상황

프론트엔드에서 필터 검색 시 다중 카테고리를 전달하는 방식으로  
`category=Next.js,Modern.js`처럼 **쉼표로 구분된 단일 쿼리 파라미터**를 사용할 경우,  
백엔드에서 해당 문자열을 직접 파싱하지 않으면 필터링이 제대로 동작하지 않는 문제가 발생했습니다.

## 🔍 해결 아이디어

- `category=Next.js,Modern.js` 형식은 `req.query.category`가 문자열로 전달되어
  백엔드에서 `.split(',')` 등의 **수동 파싱 로직이 필요**했습니다.
- 반면, `category=Next.js&category=Modern.js`처럼 **동일한 키를 여러 번 사용하는 방식**은
  Express, NestJS 등 대부분의 프레임워크에서 `req.query.category`를 **자동으로 배열로 파싱**합니다.

## 🔧 해결 방법

- 프론트엔드에서 다중 카테고리 쿼리를 `category=Next.js&category=Modern.js` 형식으로 전달하도록 변경
- 백엔드에서는 **별도의 문자열 파싱 없이 바로 배열 형태로 필터링 로직에 활용** 가능
- 이로 인해 **코드 복잡도 감소**, **가독성 및 유지 보수성 향상**

## 📚 배운 점

- RESTful API 설계 시, **쿼리 파라미터 표현 방식에 따라 백엔드 로직이 달라질 수 있음**
- 프레임워크의 **기본 동작 방식(동일 키 → 배열 처리)** 을 이해하고 활용하면  
  **불필요한 로직을 줄이고 더 간결한 코드 구현 가능**
- 프론트엔드와 백엔드 간 **데이터 포맷에 대한 명확한 협의와 일관성 유지가 필수**

</details>

<details>
<summary>2. [작업물] 임시 저장 시 사용자 피드백 부족</summary>

## 🔍 문제 상황

- 사용자는 `Ctrl/Cmd + S` 단축키로 **작업물을 임시 저장**할 수 있도록 설계했으나, 저장이 완료되었는지 여부를 **직관적으로 인지할 수 있는 시각적 피드백이 부족**
- 피드백이 없을경우 사용자는 **"정말 저장이 된 건가?"** 라는 불확실함을 경험함
- 노션의 저장 UI에서 영감을 얻어 구현

## ✅ 해결 방법

<div align="center">
  <img src="./public/images/workTrouble.png" alt="임시 저장 UI" width="100%" />
</div>

1. **로딩 스피너 기반 피드백 구현**

   ```typescript
   // useDraft 훅 내부 (임시 저장 중 로딩 피드백 처리)
   updateDraftState("isDrafting", true); // 스피너 표시 시작

   // 로컬스토리지 저장 로직 수행

   timeoutRef.current = setTimeout(() => {
     updateDraftState("isDrafting", false); // 800ms 뒤 스피너 종료
   }, 800);
   ```

2. **시각적 피드백 처리**
   - 임시 저장 동작 시점에 **로딩 스피너를 잠시 표시**하여 저장 진행 상태 전달
   - 로컬스토리지 저장의 즉각성을 고려한 인위적 대기 시간(`setTimeout`) 구현
   - 스피너는 최소 800ms 이상 유지되어 **저장 완료 과정을 시각적으로 인지 가능**하게 함

## 🎯 개선 효과

- 저장 동작에 대한 **즉각적이고 확실한 피드백** 제공
- 사용자는 로딩 스피너를 통해 **"지금 저장 중이구나" → "저장 완료" 흐름을 명확하게 인지**
- 빠르게 반복되는 작업 흐름에서도 **심리적 안정감과 시스템 신뢰성** 확보
</details>

<details>
<summary>3. [어드민] 유저 정보 조회 에러</summary>

## 🔍 문제 상황

<div align="center">
  <img src="./public/images/admiTrouble1.png" alt="에러 상황" width="100%" />
</div>

- 로그인 시 accessToken은 `HttpOnly` 쿠키로 저장되지만, 유저 정보 조회 요청 시 accessToken을 읽지 못해 인증 실패
- 클라이언트에서 `credentials: "include"` 로 쿠키를 자동 전송했지만, 여전히 유저 정보 조회 시 role, grade 등의 정보가 누락됨
- 백엔드에서 토큰 누락으로 인증 실패 처리되어 401 에러 발생

## ❓ 원인 분석

1. **쿠키 접근 제한**
   - `HttpOnly` 쿠키는 클라이언트(`document.cookie`)에서 직접 접근 불가
   - 기존 방식처럼 클라이언트에서 accessToken을 꺼내 `Authorization` 헤더로 전달할 수 없음

2. **토큰 전달 실패**
   - accessToken은 쿠키에 있지만 클라이언트가 읽을 수 없어 헤더에 넣지 못함
   - 백엔드는 토큰이 누락된 것으로 판단하여 인증 실패 처리

## ✅ 해결 방법

<div align="center">
  <img src="./public/images/admiTrouble2.png" alt="해결 방안" width="100%" />
</div>

1. **컴포넌트 계층 구조 재설계**
   - 서버 액션(`getUserAction`) → 서버 컴포넌트(`UserService`) → 클라이언트 컴포넌트(`AuthProvider`) 로직 분리
   - 각 계층의 역할과 책임을 명확히 구분

2. **서버 액션에서 토큰 처리**

   ```typescript
   const getUserAction = async () => {
     const cookies = headers().get("cookie");
     // 서버 액션에서 쿠키를 읽어 요청 헤더에 수동 삽입
     const response = await fetch(`${API_URL}/users/me`, {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
         Cookie: `accessToken=${accessToken}`,
       },
     });
     // ... 응답 처리
   };
   ```

3. **결과**
   - 서버 액션에서 안전하게 쿠키 접근 및 토큰 처리
   - 클라이언트는 서버 액션의 결과로 받은 유저 정보 사용
   - 보안성을 유지하면서도 정상적인 인증 플로우 구현
   </details>
