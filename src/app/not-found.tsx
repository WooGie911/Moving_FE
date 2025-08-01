"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import notFoundImage from "@/assets/img/mascot/notfound.png";

const NotFound = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-10">
      <div className="flex w-full max-w-6xl items-center justify-between">
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-4xl font-bold">404 ERROR</h1>
          <p className="text-lg">Sorry, the page you are looking for does not exist.</p>
          <button
            onClick={handleGoBack}
            className="w-fit rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            GO BACK
          </button>
        </div>
        <div className="ml-8 flex-shrink-0">
          <Image
            src={notFoundImage}
            alt="not found"
            width={300}
            height={300}
            className="h-[300px] w-[300px] object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
