import { Link } from "@/i18n/navigation";
import { TUserRole } from "@/types/user.types";
import { useTranslations } from "next-intl";
import { RoleToggle } from "./RoleToggle";
import { FaLock } from "react-icons/fa";

interface IProfileModalProps {
  userName: string;
  userRole: TUserRole;
  hasBothProfiles: boolean;
  logout: () => void;
  profileModalRef: React.RefObject<HTMLDivElement | null>;
  closeProfileModal: () => void;
}

const USER_ACTION_LIST = [
  {
    label: "gnb.userActions.editProfile",
    href: "/profile/edit",
  },
  {
    label: "gnb.userActions.favoriteDrivers",
    href: "/favoriteMover",
  },
];

const MOVER_USER_ACTION_LIST = [
  {
    label: "gnb.userActions.editProfile",
    href: "/profile/edit",
  },
  {
    label: "gnb.userActions.myPage",
    href: "/moverMyPage",
  },
];

function ProfileModal({
  userName,
  userRole,
  hasBothProfiles,
  logout,
  profileModalRef,
  closeProfileModal,
}: IProfileModalProps) {
  const t = useTranslations();

  return (
    <div
      ref={profileModalRef}
      className="absolute top-full right-[-50px] z-50 mt-2 w-[205px] rounded-2xl border-2 border-[#F2F2F2] bg-white py-2.5 font-bold shadow-lg lg:right-0 lg:w-[248px]"
    >
      <nav className="flex flex-col items-start justify-start border-b border-[#F2F2F2]">
        <span className="w-full p-3 text-left text-lg">
          {userName} {userRole === "CUSTOMER" ? t("gnb.userSuffix.customer") : t("gnb.userSuffix.driver")}
        </span>
        <ul className="flex w-full flex-col">
          {userRole === "CUSTOMER"
            ? USER_ACTION_LIST.map((item, index) => (
                <Link href={item.href} key={index} onClick={closeProfileModal}>
                  <li className="text-md w-full p-3 text-left font-medium transition-colors hover:bg-gray-100">
                    {t(item.label)}
                  </li>
                </Link>
              ))
            : MOVER_USER_ACTION_LIST.map((item, index) => (
                <Link href={item.href} key={index} onClick={closeProfileModal}>
                  <li className="text-md w-full px-2 py-3 text-left font-medium transition-colors hover:bg-gray-100">
                    {t(item.label)}
                  </li>
                </Link>
              ))}
        </ul>
      </nav>
      <div className="flex flex-col items-center justify-between gap-2">
        <div className="group relative flex w-full items-center justify-between gap-2 border-b border-[#F2F2F2] p-3">
          <div
            className={`relative flex w-full items-center justify-between ${
              !hasBothProfiles ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <span className="text-md font-medium">{t("gnb.roleToggleText")}</span>
            <RoleToggle disabled={!hasBothProfiles} />
          </div>

          {/* 🔒 아이콘은 프로필 미등록 시에만 표시 */}
          {!hasBothProfiles && <FaLock className="ml-1 text-gray-400" size={14} aria-label="Locked" />}

          {/* 💬 툴팁은 항상 출력하지만 메시지는 조건부 */}
          <div className="absolute -top-12 left-1/2 z-10 hidden w-full -translate-x-1/2 rounded bg-gray-800 px-4 py-2 text-[14px] text-white group-hover:block">
            {hasBothProfiles ? t("gnb.roleToggleAvailableMessage") : t("gnb.roleToggleLockMessage")}
          </div>
        </div>

        <button
          className="w-full cursor-pointer p-3 text-xs text-gray-500 transition-colors hover:text-gray-700 lg:text-lg"
          onClick={() => logout()}
        >
          {t("gnb.logout")}
        </button>
      </div>
    </div>
  );
}

export default ProfileModal;
