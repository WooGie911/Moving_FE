"use client";

import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TextInput } from "@/components/common/input/TextInput";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { Button } from "@/components/common/button/Button";
import { IEditBasicForm } from "@/types/user";
import { useRouter } from "next/navigation";
import userApi from "@/lib/api/user.api";
import { useAuth } from "@/providers/AuthProvider";
import { validationRules } from "@/utils/validators";

const EditPage = () => {
  const router = useRouter();
  const { getUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<IEditBasicForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  // 유저 정보 불러와서 폼 초기값 세팅
  useEffect(() => {
    async function fetchUser() {
      const res = await userApi.getUser();
      if (res.success && res.data) {
        form.reset({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phoneNumber || "",
          currentPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
        });
      }
    }
    fetchUser();
  }, [form]);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = form;

  const allFilled = [
    watch("name"),
    watch("phone"),
    watch("currentPassword"),
    watch("newPassword"),
    watch("newPasswordConfirm"),
  ].every((v) => v && v.trim() !== "");

  const requiredFilled = [
    watch("name"),
    watch("phone"),
  ].every((v) => v && v.trim() !== "");

  const onSubmit = async (data: IEditBasicForm) => {
    try {
      setFormError(null);
      const req = {
        name: data.name,
        phoneNumber: data.phone,
        currentPassword: data.currentPassword || undefined,
        newPassword: data.newPassword || undefined,
      };
      const result = await userApi.updateMoverBasicInfo(req);
      if (result.success) {
        await getUser();
        alert("기본정보가 성공적으로 수정되었습니다.");
        router.push("/moverMyPage"); 
      } else {
        if (result.message?.includes("비밀번호")) {
          form.setError("currentPassword", { message: result.message });
        } else {
          setFormError(result.message || "수정에 실패했습니다.");
        }
      }
    } catch (e) {
      setFormError("오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-12 rounded-3xl bg-white px-4 py-10 lg:max-w-[1200px]">
        <div className="mb-4 text-2xl font-bold !text-black text-black">기본정보 수정</div>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">이름</div>
                <TextInput
                  name="name"
                  rules={validationRules.name}
                  placeholder="이름을 입력해주세요"
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-200 text-base !text-black"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px]"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">이메일</div>
                <TextInput
                  name="email"
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base text-neutral-400 !text-black pointer-events-none bg-gray-100"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px]"
                  placeholder="이메일을 입력해주세요"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">전화번호</div>
                <TextInput
                  name="phone"
                  rules={validationRules.phoneNumber}
                  placeholder="전화번호를 입력해주세요"
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-200 text-base !text-black"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">현재 비밀번호</div>
                <PasswordInput
                  name="currentPassword"
                  placeholder="현재 비밀번호를 입력해주세요"
                  rules={{
                    validate: (value) => {
                      if (watch("newPassword") || watch("newPasswordConfirm")) {
                        return value ? true : "현재 비밀번호를 입력해주세요";
                      }
                      return true;
                    },
                  }}
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base !text-black placeholder-neutral-400 pr-16 lg:pr-16"
                  errorClassName=""
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px] w-full relative px-0"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">새 비밀번호</div>
                <PasswordInput
                  name="newPassword"
                  placeholder="새 비밀번호를 입력해주세요"
                  rules={{
                    validate: (value) => {
                      if (watch("currentPassword") || watch("newPasswordConfirm")) {
                        if (!value) return "새 비밀번호를 입력해주세요";
                        return validationRules.password.validate(value);
                      }
                      return true;
                    },
                  }}
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base !text-black placeholder-neutral-400 pr-16 lg:pr-16"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px] w-full relative px-0"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-lg">새 비밀번호 확인</div>
                <PasswordInput
                  name="newPasswordConfirm"
                  placeholder="새 비밀번호를 다시 한번 입력해주세요"
                  rules={{
                    validate: (value) => {
                      if (watch("currentPassword") || watch("newPassword")) {
                        if (!value) return "새 비밀번호 확인을 입력해주세요";
                        if (value !== getValues("newPassword")) return "새 비밀번호가 일치하지 않습니다.";
                      }
                      return true;
                    },
                  }}
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base !text-black placeholder-neutral-400 pr-16 lg:pr-16"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px] w-full relative px-0"
                />
              </div>
            </div>
            <div className="col-span-1 mt-8 flex w-full flex-col-reverse gap-3 lg:col-span-2 lg:flex-row lg:justify-end lg:gap-4">
              <button
                type="button"
                className="h-[54px] w-full rounded-xl px-6 py-4 text-base font-semibold text-neutral-400 shadow-[4px_4px_10px_0px_rgba(195,217,242,0.20)] outline outline-1 outline-offset-[-1px] outline-stone-300 lg:h-[60px] lg:w-[240px]"
                onClick={() => router.back()}
              >
                취소
              </button>
              <Button
                variant="solid"
                state={requiredFilled ? "default" : "disabled"}
                className="h-[54px] w-full rounded-xl bg-[#F9502E] p-4 text-base font-semibold text-white hover:bg-[#e04322] lg:h-[60px] lg:w-[240px]"
                disabled={!requiredFilled}
                onClick={handleSubmit(onSubmit)}
              >
                수정하기
              </Button>
            </div>
            {formError && (
              <div className="col-span-1 lg:col-span-2 text-red-500 text-sm mt-2">{formError}</div>
            )}
          </form>
        </FormProvider>
      </div>
      <style jsx global>{`
        .relative [class*="absolute"][class*="right-"] {
          right: 1rem !important;
        }
        @media (min-width: 1024px) {
          .relative [class*="absolute"][class*="right-"] {
            right: 1.25rem !important; /* right-4 */
          }
        }
      `}</style>
    </div>
  );
};

export default EditPage;
