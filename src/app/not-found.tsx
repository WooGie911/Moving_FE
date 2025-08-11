"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import notFoundImage from "@/assets/img/mascot/notfound.webp";

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
            className="bg-primary-400 hover:bg-primary-500 w-fit rounded-lg px-6 py-2 text-white transition-colors"
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
