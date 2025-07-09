"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TextInput } from "@/components/common/input/TextInput";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { Button } from "@/components/common/button/Button";
import { IEditBasicForm } from "@/types/dto/user.dto";
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
    if (data.newPassword !== data.newPasswordConfirm) {
      setError("newPasswordConfirm", { message: "새 비밀번호가 일치하지 않습니다." });
      return;
    }
    // TODO: 서버에 수정 요청
    console.log(data);
  };

  // 비밀번호 확인 실시간 체크
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
    <div className="flex min-h-screen w-full justify-center items-center bg-gray-50 px-2 sm:px-4">
      <div className="w-full max-w-[1200px] px-2 sm:px-6 md:px-10 pt-8 pb-10 bg-white rounded-[32px] flex flex-col justify-center items-end gap-10 sm:gap-16">
        <div className="self-stretch flex flex-col justify-start items-start gap-6 sm:gap-10">
          <div className="self-stretch flex flex-col justify-center items-start gap-6 sm:gap-8">
            <div className="w-44 justify-center text-neutral-800 text-2xl sm:text-3xl font-semibold leading-10">기본정보 수정</div>
          </div>
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-100" />
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="self-stretch flex flex-col sm:flex-row justify-between items-start gap-8">
              {/* 왼쪽: 이름/이메일/전화번호 */}
              <div className="w-full sm:w-[500px] flex flex-col justify-start items-start gap-8">
                {/* 이름 */}
                <div className="self-stretch flex flex-col justify-start items-start gap-2 sm:gap-4">
                  <div className="text-zinc-800 text-lg sm:text-xl font-semibold leading-loose">이름</div>
                  <TextInput
                    name="name"
                    rules={{ required: "이름은 필수입니다." }}
                    placeholder="이름을 입력해주세요"
                    inputClassName="h-14 sm:h-16 text-base sm:text-lg text-black"
                    wrapperClassName="self-stretch"
                  />
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-100" />
                {/* 이메일 */}
                <div className="self-stretch flex flex-col justify-start items-start gap-2 sm:gap-4">
                  <div className="text-zinc-800 text-lg sm:text-xl font-semibold leading-loose">이메일</div>
                  <TextInput
                    name="email"
                    inputClassName="h-12 sm:h-14 text-base sm:text-lg text-neutral-400"
                    wrapperClassName="w-full sm:w-[500px]"
                    placeholder="이메일을 입력해주세요"
                    // readOnly는 BaseInput에만 적용되므로, 필요시 TextInput 내부에서 지원하도록 수정 필요
                  />
                </div>
                {/* 전화번호 */}
                <div className="self-stretch flex flex-col justify-start items-start gap-2 sm:gap-4">
                  <div className="text-zinc-800 text-lg sm:text-xl font-semibold leading-loose">전화번호</div>
                  <TextInput
                    name="phone"
                    rules={{ required: "전화번호는 필수입니다." }}
                    placeholder="전화번호를 입력해주세요"
                    inputClassName="h-14 sm:h-16 text-base sm:text-lg text-black"
                    wrapperClassName="w-full sm:w-[500px]"
                  />
                </div>
              </div>
              {/* 오른쪽: 비밀번호 변경 */}
              <div className="w-full sm:w-[500px] flex flex-col justify-start items-start gap-8">
                {/* 현재 비밀번호 */}
                <div className="flex flex-col justify-start items-start gap-2 sm:gap-4">
                  <div className="text-zinc-800 text-lg sm:text-xl font-semibold leading-loose">현재 비밀번호</div>
                  <PasswordInput
                    name="currentPassword"
                    placeholder="현재 비밀번호를 입력해주세요"
                    inputClassName="h-12 sm:h-14 text-base sm:text-lg text-black"
                    wrapperClassName="w-full sm:w-[500px]"
                  />
                </div>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-100" />
                {/* 새 비밀번호 */}
                <div className="flex flex-col justify-start items-start gap-2 sm:gap-4">
                  <div className="text-zinc-800 text-lg sm:text-xl font-semibold leading-loose">새 비밀번호</div>
                  <PasswordInput
                    name="newPassword"
                    placeholder="새 비밀번호를 입력해주세요"
                    inputClassName="h-12 sm:h-14 text-base sm:text-lg text-black"
                    wrapperClassName="w-full sm:w-[500px]"
                  />
                </div>
                {/* 새 비밀번호 확인 */}
                <div className="flex flex-col justify-start items-start gap-2 sm:gap-4">
                  <div className="text-zinc-800 text-lg sm:text-xl font-semibold leading-loose">새 비밀번호 확인</div>
                  <PasswordInput
                    name="newPasswordConfirm"
                    placeholder="새 비밀번호를 다시 한번 입력해주세요"
                    inputClassName="h-12 sm:h-14 text-base sm:text-lg text-black"
                    wrapperClassName="w-full sm:w-[500px]"
                  />
                  {errors.newPasswordConfirm?.message && (
                    <span className="text-state-error text-sm mt-1">{errors.newPasswordConfirm.message}</span>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
        {/* 버튼 영역 */}
        <div className="w-full sm:w-[500px] flex justify-start items-start gap-3 sm:gap-5">
          <button
            type="button"
            className="flex-1 h-12 sm:h-14 px-4 sm:px-6 py-2 sm:py-4 rounded-2xl shadow-[4px_4px_10px_0px_rgba(195,217,242,0.20)] outline outline-1 outline-offset-[-1px] outline-stone-300 flex justify-center items-center"
            onClick={() => router.back()}
          >
            <div className="w-32 sm:w-72 text-center text-zinc-500 text-base sm:text-lg font-semibold">취소</div>
          </button>
          <Button
            variant="solid"
            state={isValid ? "default" : "disabled"}
            className="flex-1 h-12 sm:h-14 p-2 sm:p-4 rounded-2xl text-base sm:text-lg font-semibold"
            disabled={!isValid}
          >
            수정하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditPage; 