import CheckIcon from "@/assets/icon/checkbox/roundCheck.svg";
import Image from "next/image";
import { IMovingTypeCardProps } from "@/types/estimateRequest";
import { ESTIMATE_REQUEST_CARD_STYLES } from "@/constant/estimateRequestStyles";

const MOVING_TYPE_CARD_STYLES = ESTIMATE_REQUEST_CARD_STYLES.movingType;

const MovingTypeCard: React.FC<IMovingTypeCardProps> = ({ selected, label, description, image, onClick }) => {
  const cardClasses = [
    MOVING_TYPE_CARD_STYLES.base,
    selected ? MOVING_TYPE_CARD_STYLES.selected : MOVING_TYPE_CARD_STYLES.unselected,
  ].join(" ");

  const radioClasses = [
    MOVING_TYPE_CARD_STYLES.radioBase,
    selected ? MOVING_TYPE_CARD_STYLES.radioSelected : MOVING_TYPE_CARD_STYLES.radioUnselected,
  ].join(" ");

  return (
    <button type="button" onClick={onClick} className={cardClasses}>
      {/* 왼쪽 상단 라디오 버튼 */}
      <div className={MOVING_TYPE_CARD_STYLES.textContainer}>
        <div className={MOVING_TYPE_CARD_STYLES.radioContainer}>
          <span className={radioClasses}>
            {selected && <Image src={CheckIcon} alt="체크" width={24} height={24} />}
          </span>
        </div>

        {/* 텍스트 영역 */}
        <div className={MOVING_TYPE_CARD_STYLES.textArea}>
          <div className={MOVING_TYPE_CARD_STYLES.title}>{label}</div>
          <div className={MOVING_TYPE_CARD_STYLES.description}>{description}</div>
        </div>
      </div>

      {/* 이미지 */}
      <div className={MOVING_TYPE_CARD_STYLES.imageContainer}>{image}</div>
    </button>
  );
};

export default MovingTypeCard;
