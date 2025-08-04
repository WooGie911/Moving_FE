// hooks/useSwitchUserType.ts
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import authApi from "@/lib/api/auth.api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const useSwitchUserType = () => {
  const router = useRouter();
  const { user, getUser } = useAuth();
  const t = useTranslations("gnb");

  return useMutation({
    mutationFn: async () => {
      const targetType = user?.userType === "CUSTOMER" ? "MOVER" : "CUSTOMER";
      const res = await authApi.switchUserType(targetType);
      return res;
    },
    onSuccess: async (res) => {
      // 토스트 메시지
      if (res.newUserType === "CUSTOMER") {
        toast.success(t("customerSuccessToast"));
      } else {
        toast.success(t("moverSuccessToast"));
      }

      // 유저 정보 다시 불러오기
      await getUser();

      if (res?.newUserType === "CUSTOMER") {
        router.replace("/searchMover");
      } else {
        router.replace("/estimate/received");
      }
    },
    onError: (err: Error) => {
      toast.error(err?.message || t("switchUserTypeError"));
    },
  });
};
