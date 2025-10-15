import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function RootRayout() {
  const navItems = [
    { path: "/", label: "홈페이지" },
    { path: "/create-content", label: "단순 텍스트 생성" },
    { path: "/chat", label: "채팅" },
    { path: "/stream-chat", label: "스트리밍 응답 채팅" },
  ];

  const activeNavItemClass = "bg-blue-50 text-blue-700 border border-blue-200";

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* 왼쪽 네비게이션바 */}
      <nav className="bg-white border-r border-gray-200 w-48 flex-shrink-0">
        <div className="flex flex-col gap-4 p-4">
          {navItems.map((item) => {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  ` px-4 py-3 text-sm  ${
                    isActive ? activeNavItemClass : "text-gray-600 "
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* 메인 컨텐츠 - 중앙 배치 */}
      <div className="flex-1 flex justify-center overflow-y-auto">
        <div className="w-full max-w-6xl h-full flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
