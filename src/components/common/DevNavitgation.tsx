"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface RouteGroup {
  title: string;
  routes: Array<{
    name: string;
    path: string;
  }>;
}

const routeGroups: RouteGroup[] = [
  {
    title: "메인",
    routes: [
      { name: "홈", path: "/" },
      { name: "404", path: "/not-found" },
    ],
  },
  {
    title: "인증",
    routes: [
      { name: "로그인", path: "/signin" },
      { name: "회원가입", path: "/signup" },
    ],
  },
  {
    title: "프로필",
    routes: [
      { name: "프로필 등록", path: "/profile/register" },
      { name: "프로필 수정", path: "/profile/edit" },
    ],
  },
  {
    title: "견적 (유저)",
    routes: [
      { name: "견적 등록", path: "/estimate/request" },
      { name: "대기중 견적", path: "/estimate/list/user/waiting" },
      { name: "대기중 상세", path: "/estimate/list/user/waiting/1" },
      { name: "받은 견적", path: "/estimate/list/user/received" },
      { name: "받은 상세", path: "/estimate/list/user/received/1" },
    ],
  },
  {
    title: "견적 (기사)",
    routes: [
      { name: "받은 요청", path: "/estimate/list/mover/received" },
      { name: "보낸 견적", path: "/estimate/list/mover/requested" },
      { name: "보낸 상세", path: "/estimate/list/mover/requested/1" },
      { name: "반려 견적", path: "/estimate/list/mover/rejected" },
      { name: "반려 상세", path: "/estimate/list/mover/rejected/1" },
    ],
  },
  {
    title: "기사님",
    routes: [
      { name: "기사님 찾기", path: "/searchMover" },
      { name: "기사님 상세", path: "/searchMover/1" },
      { name: "찜한 기사님", path: "/favoriteMover" },
    ],
  },
  {
    title: "리뷰",
    routes: [
      { name: "리뷰 목록", path: "/review" },
      { name: "작성한 리뷰", path: "/review/written" },
      { name: "작성 가능", path: "/review/writable" },
    ],
  },
];

export const DevNavitgation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("devNavVisible");
    setIsVisible(stored === "true");
  }, []);

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem("devNavVisible", newVisibility.toString());
  };

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
              <span className="text-sm text-gray-400">Current: {pathname}</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {routeGroups.map((group) => (
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
