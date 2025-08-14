import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { IAddressCardProps } from "@/types/estimateRequest";
import { useTranslations } from "next-intl";
import { ESTIMATE_REQUEST_CARD_STYLES } from "@/constant/estimateRequestStyles";

const ADDRESS_CARD_STYLES = ESTIMATE_REQUEST_CARD_STYLES.address;

const AddressCard: React.FC<IAddressCardProps> = ({ postalCode, roadAddress, jibunAddress, selected = false }) => {
  const t = useTranslations();

  const containerClass = `${ADDRESS_CARD_STYLES.container} ${
    selected ? ADDRESS_CARD_STYLES.selected : ADDRESS_CARD_STYLES.unselected
  }`;

  return (
    <div className={containerClass}>
      {/* 우편번호 */}
      <span className={ADDRESS_CARD_STYLES.postalCode}>{postalCode || t("estimateRequest.postalCode")}</span>

      {/* 도로명 주소 */}
      <div className={ADDRESS_CARD_STYLES.addressRow}>
        <div className={ADDRESS_CARD_STYLES.labelContainer}>
          <CircleTextLabel text={t("estimateRequest.roadNameLabel")} />
        </div>
        <span className={ADDRESS_CARD_STYLES.addressText}>
          {roadAddress || t("estimateRequest.roadAddressPlaceholder")}
        </span>
      </div>

      {/* 지번 주소 */}
      <div className={ADDRESS_CARD_STYLES.addressRow}>
        <div className={ADDRESS_CARD_STYLES.labelContainer}>
          <CircleTextLabel text={t("estimateRequest.jibunLabel")} />
        </div>
        <span className={ADDRESS_CARD_STYLES.addressText}>
          {jibunAddress || t("estimateRequest.jibunAddressPlaceholder")}
        </span>
      </div>
    </div>
  );
};

export default AddressCard;
