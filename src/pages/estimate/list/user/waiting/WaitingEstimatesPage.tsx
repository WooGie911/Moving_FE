import { ListTab } from "@/components/estimate/list/ListTab";
import React from "react";
import { RequestQuote } from "./RequestQuote";

const UserWaitingEstimatesPage = () => {
  return (
    <>
      <ListTab userType="User" />
      <RequestQuote
        movingType="소형이사"
        requestDate="2025년 6월 24일"
        movingDate="2025년 7월 8일(화)"
        startPoint="서울시 중랑구"
        endPoint="경기도 수원시"
      />
      <div>아래는 작업중</div>
    </>
  );
};

export default UserWaitingEstimatesPage;
