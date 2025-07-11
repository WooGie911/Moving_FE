"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface IRouteGroup {
  title: string;
  routes: Array<{
    name: string;
    path: string;
  }>;
  allowedRoles?: ("guest" | "CUSTOMER" | "MOVER")[];
}

const routeGroups: IRouteGroup[] = [
  {
    title: "메인",
    routes: [
      { name: "홈", path: "/" },
      { name: "404", path: "/not-found" },
    ],
    allowedRoles: ["guest", "CUSTOMER", "MOVER"],
  },
  {
    title: "인증",
    routes: [
      { name: "유저 로그인", path: "/userSignin" },
      { name: "유저 회원가입", path: "/userSignup" },
      { name: "기사 로그인", path: "/moverSignin" },
      { name: "기사 회원가입", path: "/moverSignup" },
    ],
    allowedRoles: ["guest"],
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
      { name: "유저님 견적 요청 작성", path: "/quote/create" },
      { name: "유저님 대기 중인 견적 조회", path: "/quote/pending" },
      { name: "유저님 대기 중인 견적 조회 상세", path: "/quote/pending/1" },
      { name: "유저님 받았던 견적 조회", path: "/quote/received" },
      { name: "유저님 받았던 견적 조회 상세", path: "/quote/received/1" },
    ],
    allowedRoles: ["CUSTOMER"],
  },
  {
    title: "기사님 찾기",
    routes: [
      { name: "기사님 찾기", path: "/searchMover" },
      { name: "기사님 상세", path: "/searchMover/1" },
    ],
    allowedRoles: ["guest", "CUSTOMER"],
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

export const DevNavitgation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, user, login, logout } = useAuth();

  // 현재 유저 역할 결정
  const currentRole = isLoggedIn ? user?.userRole : "guest";

  // 현재 유저가 접근 가능한 라우트 그룹 필터링
  const filteredRouteGroups = routeGroups.filter((group) =>
    group.allowedRoles?.includes(currentRole as "guest" | "CUSTOMER" | "MOVER"),
  );

  useEffect(() => {
    const stored = localStorage.getItem("devNavVisible");
    setIsVisible(stored === "true");
  }, []);

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem("devNavVisible", newVisibility.toString());
  };

  // TODO : 현재 로그인 정보가 맞지 않음 서버에 해당 데이터 넣고 다시 테스트
  const handleLogin = () => {
    // 테스트용 로그인
    const mockCustomer = {
      email: "testCustomer@test.com",
      password: "1rhdiddl!",
    };
    login(mockCustomer.email, mockCustomer.password);
  };

  const handleMoverLogin = () => {
    // 테스트용 기사 로그인
    const mockMover = {
      email: "testMover@test.com",
      password: "1rhdiddl!",
    };
    login(mockMover.email, mockMover.password);
  };

  useEffect(() => {
    // TODO : 추후 삭제 예정
    console.log("현재 로그인 상태", isLoggedIn);
    console.log("현재 유저 역할", user?.userRole || "비회원");
    console.log("현재 유저 이메일", user?.userName || "비회원");
  }, [isLoggedIn, user]);

  // 개발 환경에서만 표시
  if (process.env.NODE_ENV === "production") return null;

  return (
    <>
      {/* 토글 버튼 */}
      <button
        onClick={toggleVisibility}
        className="bg-black-400 hover:bg-black-500 fixed right-20 bottom-4 z-50 rounded-full p-3 text-white shadow-lg transition-colors"
        aria-label="개발 네비게이션 토글"
      >
        {isVisible ? "🔧" : "⚡"}
      </button>

      {/* 네비게이션 바 */}
      {isVisible && (
        <div className="fixed right-0 bottom-0 left-0 z-40 max-h-80 overflow-y-auto border-t border-gray-200 bg-white shadow-lg">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-black-500 text-lg font-semibold">🚧 Dev Navigation</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{isLoggedIn ? `이름: ${user?.userName}` : "비회원"}</span>
                {isLoggedIn ? (
                  <button onClick={logout} className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600">
                    로그아웃
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={handleLogin}
                      className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                    >
                      유저 로그인
                    </button>
                    <button
                      onClick={handleMoverLogin}
                      className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
                    >
                      기사 로그인
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {filteredRouteGroups.map((group) => (
                <div key={group.title} className="space-y-2">
                  <h4 className="border-b border-gray-200 pb-1 text-sm font-medium text-gray-700">{group.title}</h4>
                  <div className="space-y-1">
                    {group.routes.map((route) => (
                      <Link
                        key={route.path}
                        href={route.path}
                        className={`block rounded px-2 py-1 text-xs transition-colors ${
                          pathname === route.path
                            ? "bg-primary-400 font-medium text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {route.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
