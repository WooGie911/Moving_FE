"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTE_GROUPS } from "@/constant/devNavRouteGroups";
import { TUserRole } from "@/types/user.types";

export const DevNavitgation = () => {
  const pathname = usePathname();
  const { isLoggedIn, user, login, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // 현재 유저 역할 결정
  const currentRole = isLoggedIn ? user?.userType : "GUEST";

  // 현재 유저가 접근 가능한 라우트 그룹 필터링
  const filteredRouteGroups = ROUTE_GROUPS.filter((group) => group.allowedRoles?.includes(currentRole as TUserRole));

  useEffect(() => {
    const stored = localStorage.getItem("devNavVisible");
    setIsVisible(stored === "true");
  }, []);

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem("devNavVisible", newVisibility.toString());
  };

  // 테스트용 유저 로그인
  const handleLogin = () => {
    const mockCustomer = {
      email: "test3333@naver.com",
      password: "1rhdiddl!",
    };
    login(mockCustomer.email, mockCustomer.password, "CUSTOMER");
  };

  // 테스트용 기사 로그인
  const handleMoverLogin = () => {
    const mockMover = {
      email: "test3333@naver.com",
      password: "1rhdiddl!",
    };
    login(mockMover.email, mockMover.password, "MOVER");
  };

  // 개발 환경에서만 표시
  // TODO : 우선 발표를 위해 보여줌
  // if (process.env.NODE_ENV === "production") return null;

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
                <span className="text-sm text-gray-600">{isLoggedIn ? `이름: ${user?.name}` : "비회원"}</span>
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
