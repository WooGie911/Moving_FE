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
    href: "/user/favorite",
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
      className="absolute top-full right-[-50px] z-50 mt-2 w-[205px] rounded-2xl border-2 border-[#F2F2F2] bg-white px-2 py-2.5 font-bold shadow-lg lg:right-0 lg:w-[248px]"
    >
      <nav className="flex flex-col items-start justify-start border-b border-[#F2F2F2]">
        <span className="w-full px-2 py-2 text-left text-lg">
          {userName} {userRole === "CUSTOMER" ? t("gnb.userSuffix.customer") : t("gnb.userSuffix.driver")}
        </span>
        <ul className="flex w-full flex-col">
          {userRole === "CUSTOMER"
            ? USER_ACTION_LIST.map((item, index) => (
                <Link href={item.href} key={index} onClick={closeProfileModal}>
                  <li className="text-md w-full px-2 py-3 text-left font-medium">{t(item.label)}</li>
                </Link>
              ))
            : MOVER_USER_ACTION_LIST.map((item, index) => (
                <Link href={item.href} key={index} onClick={closeProfileModal}>
                  <li className="text-md w-full px-2 py-3 text-left font-medium">{t(item.label)}</li>
                </Link>
              ))}
        </ul>
      </nav>
      <div className="flex flex-col items-center justify-between gap-2">
        <div className="group relative flex w-full items-center justify-between gap-2 px-2 py-3">
          <div
            className={`relative flex w-full items-center justify-between ${!hasBothProfiles ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <span className="text-md font-medium">간편 전환</span>
            <RoleToggle disabled={!hasBothProfiles} />
          </div>
          {/* {!hasBothProfiles && (
            <>
              <FaLock className="ml-1 text-gray-400" size={14} aria-label="Locked" />
              <div className="absolute -top-12 left-1/2 z-10 hidden w-[220px] -translate-x-1/2 rounded bg-gray-800 px-3 py-2 text-xs text-white group-hover:block">
                {t("gnb.roleToggleLockMessage")}
                <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-800" />
              </div>
            </>
          )} */}
        </div>

        <button
          className="w-full cursor-pointer px-3 py-3 text-xs text-gray-500 transition-colors hover:text-gray-700 lg:text-lg"
          onClick={() => logout()}
        >
          {t("gnb.logout")}
        </button>
      </div>
    </div>
  );
}

export default ProfileModal;
