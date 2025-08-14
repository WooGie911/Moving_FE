import { IChooseAddressBtnProps } from "@/types/estimateRequest";

// 공통 스타일 변수
const CHOOSE_ADDRESS_BTN_STYLES = {
  base: "flex h-[54px] w-full items-center justify-between rounded-2xl border px-4 py-3 transition-colors focus:outline-none",
  default: "border-primary-300 bg-primary-100 cursor-pointer",
} as const;

const ChooseAddressBtn: React.FC<IChooseAddressBtnProps> = ({ children, onClick, className = "" }) => {
  const buttonClasses = `${CHOOSE_ADDRESS_BTN_STYLES.base} ${CHOOSE_ADDRESS_BTN_STYLES.default} ${className}`;

  return (
    <button type="button" onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  );
};

export default ChooseAddressBtn;
