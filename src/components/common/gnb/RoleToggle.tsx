import { useSwitchUserType } from "@/hooks/useSwitchUserType";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";
import clsx from "clsx";

interface IRoleToggleProps {
  disabled?: boolean;
}

export const RoleToggle = ({ disabled = false }: IRoleToggleProps) => {
  const { user } = useAuth();
  const { mutate, isPending } = useSwitchUserType();
  const [fakeUserType, setFakeUserType] = useState<"CUSTOMER" | "MOVER" | null>(null);
  const windowWidth = useWindowWidth();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleToggle = () => {
    if (!user || disabled) return;
    const current = user.userType;
    const target = current === "CUSTOMER" ? "MOVER" : "CUSTOMER";
    setFakeUserType(target);
    setTimeout(() => mutate(), 300);
  };

  const typeToShow = fakeUserType ?? user?.userType;

  const translateX = windowWidth === "desktop" ? 70 : 50;

  return (
    <button
      onClick={handleToggle}
      disabled={isPending || disabled}
      className={clsx(
        "relative flex h-8 w-20 items-center rounded-full p-2 transition-colors lg:w-25",
        disabled || isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        typeToShow === "MOVER" ? "bg-gray-600" : "bg-primary-400",
      )}
    >
      <div
        className="absolute top-1 left-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${typeToShow === "MOVER" ? translateX : 5}px)`,
        }}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm">
          {typeToShow === "MOVER" ? "🚚" : "👤"}
        </div>
      </div>
    </button>
  );
};
