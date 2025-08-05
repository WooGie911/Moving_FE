import { useSwitchUserType } from "@/hooks/useSwitchUserType";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import { useState } from "react";
interface IRoleToggleProps {
  disabled?: boolean;
}

export const RoleToggle = ({ disabled = false }: IRoleToggleProps) => {
  const { user } = useAuth();
  const { mutate, isPending } = useSwitchUserType();
  const [fakeUserType, setFakeUserType] = useState<"CUSTOMER" | "MOVER" | null>(null);
  const handleToggle = () => {
    if (!user || disabled) return;
    const current = user.userType;
    const target = current === "CUSTOMER" ? "MOVER" : "CUSTOMER";
    setFakeUserType(target);
    setTimeout(() => mutate(), 300);
  };

  const typeToShow = fakeUserType ?? user?.userType;

  const windowWidth = useWindowWidth();

  return (
    <button
      onClick={handleToggle}
      disabled={isPending || disabled}
      className={`relative flex h-8 w-20 cursor-pointer items-center rounded-full p-2 transition-colors lg:w-30 ${
        typeToShow === "MOVER" ? "bg-gray-600" : "bg-primary-400"
      }`}
    >
      {windowWidth === "desktop" ? (
        <motion.div
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm"
          animate={{ x: typeToShow === "MOVER" ? 80 : 0 }}
          initial={false}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 40,
          }}
        >
          {typeToShow === "MOVER" ? "🚚" : "👤"}
        </motion.div>
      ) : (
        <motion.div
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm"
          animate={{ x: typeToShow === "MOVER" ? 40 : 0 }}
          initial={false}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 40,
          }}
        >
          {typeToShow === "MOVER" ? "🚚" : "👤"}
        </motion.div>
      )}
    </button>
  );
};
