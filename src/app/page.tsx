import { CircleTextLabel } from "@/components/common/Chips/CircleTextLabel";
import { MoveTypeLabel } from "@/components/common/Chips/MoveTypeLabel";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-4 text-red-500">
      <CircleTextLabel text="123" clickAble={true} />
      <CircleTextLabel text="123" clickAble={true} />
      <CircleTextLabel text="123" clickAble={true} />
      <CircleTextLabel text="123" clickAble={true} />
      <CircleTextLabel text="123" clickAble={true} />
      <MoveTypeLabel type="small" />

      <MoveTypeLabel type="home" />
      <MoveTypeLabel type="office" />
      <MoveTypeLabel type="document" />
    </div>
  );
};

export default HomePage;
