"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TextInput } from "@/components/common/input/TextInput";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { Button } from "@/components/common/button/Button";
import { IEditBasicForm } from "@/types/user";
import { useRouter } from "next/navigation";

const user = {
  email: "codeit@email.com",
  name: "김코드",
  phone: "010-1234-5678",
};

const EditPage = () => {
  const router = useRouter();
  const form = useForm<IEditBasicForm>({
    mode: "onChange",
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
    clearErrors,
  } = form;

  const onSubmit = (data: IEditBasicForm) => {
    // TODO: 서버에 수정 요청
    console.log(data);
  };

  React.useEffect(() => {
    if (watch("newPassword") && watch("newPasswordConfirm")) {
      if (watch("newPassword") !== watch("newPasswordConfirm")) {
        setError("newPasswordConfirm", { message: "새 비밀번호가 일치하지 않습니다." });
      } else {
        clearErrors("newPasswordConfirm");
      }
    }
  }, [watch("newPassword"), watch("newPasswordConfirm")]);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="w-full max-w-[560px] lg:max-w-[1200px] mx-auto px-4 py-10 bg-white rounded-3xl flex flex-col gap-12">
        <div className="text-2xl font-bold mb-4 text-black !text-black">기본정보 수정</div>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            {/* 왼쪽: 이름, 이메일, 전화번호 */}
            <div className="flex flex-col gap-8">
              {/* 이름 */}
              <div className="flex flex-col gap-4">
                <div className="text-zinc-800 text-base lg:text-lg font-semibold leading-relaxed">이름</div>
                <TextInput
                  name="name"
                  rules={{ required: "이름은 필수입니다." }}
                  placeholder="이름을 입력해주세요"
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-200 text-base !text-black"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px]"
                />
              </div>
              {/* 이메일 */}
              <div className="flex flex-col gap-4">
                <div className="text-zinc-800 text-base lg:text-lg font-semibold leading-relaxed">이메일</div>
                <TextInput
                  name="email"
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base text-neutral-400 !text-black pointer-events-none bg-gray-100"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px]"
                  placeholder="이메일을 입력해주세요"
                />
              </div>
              {/* 전화번호 */}
              <div className="flex flex-col gap-4">
                <div className="text-zinc-800 text-base lg:text-lg font-semibold leading-relaxed">전화번호</div>
                <TextInput
                  name="phone"
                  rules={{ required: "전화번호는 필수입니다." }}
                  placeholder="전화번호를 입력해주세요"
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-[0.5px] outline-offset-[-0.5px] outline-neutral-200 text-base !text-black"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px]"
                />
              </div>
            </div>
            {/* 오른쪽: 비밀번호 관련 */}
            <div className="flex flex-col gap-8">
              {/* 현재 비밀번호 */}
              <div className="flex flex-col gap-4">
                <div className="text-zinc-800 text-base lg:text-lg font-semibold leading-relaxed">현재 비밀번호</div>
                <PasswordInput
                  name="currentPassword"
                  placeholder="현재 비밀번호를 입력해주세요"
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base !text-black placeholder-neutral-400 pr-16 lg:pr-16"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px] w-full relative px-0"
                />
              </div>
              {/* 새 비밀번호 */}
              <div className="flex flex-col gap-4">
                <div className="text-zinc-800 text-base lg:text-lg font-semibold leading-relaxed">새 비밀번호</div>
                <PasswordInput
                  name="newPassword"
                  placeholder="새 비밀번호를 입력해주세요"
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base !text-black placeholder-neutral-400 pr-16 lg:pr-16"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px] w-full relative px-0"
                />
              </div>
              {/* 새 비밀번호 확인 */}
              <div className="flex flex-col gap-4">
                <div className="text-zinc-800 text-base lg:text-lg font-semibold leading-relaxed">새 비밀번호 확인</div>
                <PasswordInput
                  name="newPasswordConfirm"
                  placeholder="새 비밀번호를 다시 한번 입력해주세요"
                  inputClassName="w-full lg:w-[500px] p-3.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-neutral-200 text-base !text-black placeholder-neutral-400 pr-16 lg:pr-16"
                  wrapperClassName="w-full max-w-[560px] sm:!w-full lg:max-w-none lg:w-[500px] w-full relative px-0"
                />
              </div>
            </div>
            {/* 버튼 영역: 반응형 정렬 및 사이즈 */}
            <div className="col-span-1 lg:col-span-2 flex flex-col-reverse lg:flex-row gap-3 lg:gap-4 mt-8 w-full lg:justify-end">
              <button
                type="button"
                className="w-full h-[54px] lg:w-[240px] lg:h-[60px] px-6 py-4 rounded-xl shadow-[4px_4px_10px_0px_rgba(195,217,242,0.20)] outline outline-1 outline-offset-[-1px] outline-stone-300 text-neutral-400 text-base font-semibold"
                onClick={() => router.back()}
              >
                취소
              </button>
              <Button
                variant="solid"
                state={isValid ? "default" : "disabled"}
                className="w-full h-[54px] lg:w-[240px] lg:h-[60px] p-4 rounded-xl text-white text-base font-semibold bg-[#F9502E] hover:bg-[#e04322]"
                disabled={!isValid}
              >
                수정하기
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
      {/* PasswordInput 아이콘 위치 오버라이드 */}
      <style jsx global>{`
        .relative [class*='absolute'][class*='right-'] {
          right: 1rem !important;
        }
        @media (min-width: 1024px) {
          .relative [class*='absolute'][class*='right-'] {
            right: 1.25rem !important; /* right-4 */
          }
        }
      `}</style>
    </div>
  );
};

export default EditPage; 