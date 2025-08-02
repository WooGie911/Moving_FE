import { useSwitchUserType } from "@/hooks/useSwitchUserType";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
interface IRoleToggleProps {
  disabled?: boolean;
}

export const RoleToggle = ({ disabled = false }: IRoleToggleProps) => {
  const { user } = useAuth();
  const { mutate, isPending } = useSwitchUserType();
  const [fakeUserType, setFakeUserType] = useState<"CUSTOMER" | "MOVER" | null>(null);
  const router = useRouter();
  const handleToggle = () => {
    if (!user || disabled) return;
    const current = user.userType;
    const target = current === "CUSTOMER" ? "MOVER" : "CUSTOMER";
    setFakeUserType(target);
    setTimeout(() => mutate(), 300);
  };

  const typeToShow = fakeUserType ?? user?.userType;

  return (
    <button
      onClick={handleToggle}
      disabled={isPending || disabled}
      className={`relative flex h-8 w-20 cursor-pointer items-center rounded-full p-1 transition-colors ${
        typeToShow === "MOVER" ? "bg-black" : "bg-orange-500"
      }`}
    >
      <motion.div
        className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm"
        animate={{ x: typeToShow === "MOVER" ? 48 : 0 }}
        initial={false}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {typeToShow === "MOVER" ? "🚚" : "👤"}
      </motion.div>
    </button>
  );
};
