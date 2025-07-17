"use client";

import { Button } from "@/components/common/button/Button";
import { createTestNotification } from "@/lib/api/notification.api";

const notificationTestPage = () => {
  const handleActionCreate = () => {
    createTestNotification();
  };
  return (
    <div>
      {/* 테스트용 액션 생성 버튼 */}
      <Button onClick={handleActionCreate} variant="solid" rounded="rounded-xl" width="w-22" height="h-8">
        알림 생성
      </Button>
    </div>
  );
};

export default notificationTestPage;
