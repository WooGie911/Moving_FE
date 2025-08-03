// hooks/useSwitchUserType.ts
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import authApi from "@/lib/api/auth.api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const useSwitchUserType = () => {
  const router = useRouter();
  const { user, getUser } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const targetType = user?.userType === "CUSTOMER" ? "MOVER" : "CUSTOMER";
      const res = await authApi.switchUserType(targetType);
      return res;
    },
    onSuccess: async (res) => {
      // 토스트 메시지
      toast.success(`${res.newUserType === "CUSTOMER" ? "일반 유저" : "기사님"}(으)로 전환되었습니다`);

      // 유저 정보 다시 불러오기
      await getUser();

      if (res?.newUserType === "CUSTOMER") {
        router.replace("/searchMover");
      } else {
        router.replace("/estimate/received");
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "전환에 실패했습니다");
    },
  });
};
