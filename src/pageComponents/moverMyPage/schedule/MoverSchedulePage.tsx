"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import CalendarWithSchedule from "@/components/moverMyPage/schedule/CalendarWithSchedule";

// 임시 일정 데이터 타입
interface Schedule {
  id: string;
  customerName: string;
  movingType: "소형이사" | "가정이사" | "원룸이사" | "사무실이사";
  time: string;
  status: "confirmed" | "pending" | "completed";
  fromAddress: string;
  toAddress: string;
}

// 임시 일정 데이터
const mockSchedules: Record<string, Schedule[]> = {
  "2025-08-15": [
    {
      id: "1",
      customerName: "김고객",
      movingType: "원룸이사",
      time: "09:00",
      status: "confirmed",
      fromAddress: "서울시 강남구",
      toAddress: "서울시 서초구",
    },
  ],
  "2025-08-16": [
    {
      id: "2",
      customerName: "이고객",
      movingType: "가정이사",
      time: "14:00",
      status: "pending",
      fromAddress: "서울시 마포구",
      toAddress: "경기도 고양시",
    },
    {
      id: "3",
      customerName: "박고객",
      movingType: "소형이사",
      time: "16:30",
      status: "confirmed",
      fromAddress: "서울시 용산구",
      toAddress: "서울시 성동구",
    },
  ],
  "2025-08-20": [
    {
      id: "4",
      customerName: "최고객",
      movingType: "사무실이사",
      time: "10:00",
      status: "completed",
      fromAddress: "서울시 중구",
      toAddress: "서울시 종로구",
    },
  ],
};

const MoverSchedulePage = () => {
  const t = useTranslations("schedule");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const getSchedulesForDate = (date: Date): Schedule[] => {
    const dateString = date.toISOString().split("T")[0];
    return mockSchedules[dateString] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">{t("title")}</h1>
        <p className="text-gray-600">{t("description")}</p>
      </div>

      {/* 캘린더와 상세 정보 컨테이너 */}
      <div className="grid h-full grid-cols-1 gap-6 xl:grid-cols-3">
        {/* 캘린더 영역 */}
        <div className="xl:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <CalendarWithSchedule
              value={selectedDate}
              onChange={setSelectedDate}
              getSchedulesForDate={getSchedulesForDate}
            />
          </div>
        </div>

        {/* 선택된 날짜의 상세 일정 */}
        <div className="xl:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {selectedDate ? (
                <>
                  {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 {t("scheduleFor")}
                </>
              ) : (
                t("selectDate")
              )}
            </h3>

            {selectedDate ? (
              <div className="space-y-4">
                {getSchedulesForDate(selectedDate).length > 0 ? (
                  getSchedulesForDate(selectedDate).map((schedule) => (
                    <div
                      key={schedule.id}
                      className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {schedule.customerName}
                          {t("customerSuffix")}
                        </h4>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            schedule.status === "confirmed"
                              ? "bg-primary-100 text-primary-500"
                              : schedule.status === "pending"
                                ? "bg-primary-200 text-primary-400"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {t(`status.${schedule.status}`)}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="w-16 font-medium">{t("time")}</span>
                          <span>{schedule.time}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-16 font-medium">{t("type")}</span>
                          <span className="bg-primary-100 text-primary-400 rounded px-2 py-1 text-xs">
                            {schedule.movingType}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-16 font-medium">{t("departure")}</span>
                          <span>{schedule.fromAddress}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="w-16 font-medium">{t("arrival")}</span>
                          <span>{schedule.toAddress}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button className="bg-primary-400 hover:bg-primary-500 flex-1 rounded px-3 py-2 text-sm font-medium text-white transition-colors">
                          {t("viewDetails")}
                        </button>
                        {schedule.status === "pending" && (
                          <button className="flex-1 rounded bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300">
                            {t("approve")}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <div className="mb-2">📅</div>
                    <p>{t("noSchedules")}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>{t("selectDateToView")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoverSchedulePage;
