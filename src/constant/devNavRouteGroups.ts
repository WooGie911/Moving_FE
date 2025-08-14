export interface IRouteGroup {
  title: string;
  routes: Array<{
    name: string;
    path: string;
  }>;
  allowedRoles?: ("GUEST" | "CUSTOMER" | "MOVER")[];
}

export const ROUTE_GROUPS: IRouteGroup[] = [
  {
    title: "홈",
    routes: [{ name: "홈", path: "/" }],
    allowedRoles: ["GUEST"],
  },
  {
    title: "404",
    routes: [{ name: "404", path: "/not-found" }],
    allowedRoles: ["GUEST", "CUSTOMER", "MOVER"],
  },
  {
    title: "인증",
    routes: [
      { name: "유저 로그인", path: "/userSignin" },
      { name: "유저 회원가입", path: "/userSignup" },
      { name: "기사 로그인", path: "/moverSignin" },
      { name: "기사 회원가입", path: "/moverSignup" },
    ],
    allowedRoles: ["GUEST"],
  },
  {
    title: "프로필",
    routes: [
      { name: "프로필 등록", path: "/profile/register" },
      { name: "프로필 수정", path: "/profile/edit" },
    ],
    allowedRoles: ["CUSTOMER", "MOVER"],
  },
  {
    title: "기사님 견적 받은 요청/ 내 견적 관리",
    routes: [
      { name: "기사님 받은 요청", path: "/estimate/received" },
      { name: "기사님 보낸 견적 조회", path: "/estimate/request" },
      { name: "기사님 보낸 견적 조회 상세", path: "/estimate/request/1" },
      { name: "기사님 반려 요청 조회", path: "/estimate/resolved" },
      { name: "기사님 반려 요청 상세", path: "/estimate/resolved/1" },
      { name: "기사님 반려 요청 조회", path: "/estimate/rejected" },
      { name: "기사님 반려 요청 상세", path: "/estimate/rejected/1" },
    ],
    allowedRoles: ["MOVER"],
  },
  {
    title: "유저님 내 견적 관리",
    routes: [
      { name: "유저님 견적 요청 작성", path: "/estimateRequest/create" },
      { name: "유저님 대기 중인 견적 조회", path: "/estimateRequest/pending" },
      { name: "유저님 대기 중인 견적 조회 상세", path: "/estimateRequest/pending/1" },
      { name: "유저님 받았던 견적 조회", path: "/estimateRequest/received" },
      { name: "유저님 받았던 견적 조회 상세", path: "/estimateRequest/received/1" },
    ],
    allowedRoles: ["CUSTOMER"],
  },
  {
    title: "기사님 찾기",
    routes: [
      { name: "기사님 찾기", path: "/searchMover" },
      { name: "기사님 상세", path: "/searchMover/1" },
    ],
    allowedRoles: ["GUEST", "CUSTOMER"],
  },
  {
    title: "찜한 기사님",
    routes: [{ name: "찜한 기사님", path: "/favoriteMover" }],
    allowedRoles: ["CUSTOMER"],
  },
  {
    title: "기사 마이페이지",
    routes: [
      { name: "기사 마이페이지", path: "/moverMyPage" },
      { name: "기사 정보 수정", path: "/moverMyPage/edit" },
    ],
    allowedRoles: ["MOVER"],
  },
  {
    title: "리뷰",
    routes: [
      { name: "작성 가능한 리뷰", path: "/review/writable" },
      { name: "작성한 리뷰", path: "/review/written" },
    ],
    allowedRoles: ["CUSTOMER"],
  },
];
