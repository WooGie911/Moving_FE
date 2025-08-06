import { useMemo, useState } from "react";
import Image from "next/image";
import MovingTypeCard from "../card/MovingTypeCard";
import SpeechBubble from "../SpeechBubble";
import MovingTypeSmall from "@/assets/img/etc/smallMoving.webp";
import MovingTypeHome from "@/assets/img/etc/homeMoving.webp";
import MovingTypeOffice from "@/assets/img/etc/officeMoving.webp";
import { IMovingTypeSectionProps } from "@/types/estimateRequest";
import { useTranslations } from "next-intl";

// 스켈레톤 컴포넌트
const ImageSkeleton = () => <div className="relative h-30 w-30 animate-pulse rounded-lg bg-gray-200" />;

// 이사 타입 데이터
const MOVING_TYPES = [
  {
    type: "small",
    image: MovingTypeSmall,
  },
  {
    type: "home",
    image: MovingTypeHome,
  },
  {
    type: "office",
    image: MovingTypeOffice,
  },
] as const;

const MovingTypeSection: React.FC<IMovingTypeSectionProps> = ({ value, onSelect }) => {
  const t = useTranslations();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (type: string) => {
    setLoadedImages((prev) => new Set(prev).add(type));
  };

  // 이미지 컴포넌트들을 메모이제이션
  const movingTypeCards = useMemo(() => {
    return MOVING_TYPES.map(({ type, image }) => {
      const isLoaded = loadedImages.has(type);

      return {
        type,
        card: (
          <MovingTypeCard
            key={type}
            selected={value === type}
            label={t(`shared.movingTypes.${type}`)}
            description={t(`shared.movingTypes.${type}Desc`)}
            image={
              <div className="relative h-30 w-30">
                {!isLoaded && <ImageSkeleton />}
                <Image
                  src={image}
                  alt={t(`shared.movingTypes.${type}`)}
                  fill
                  className={`object-contain transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                  priority
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  unoptimized
                  onLoad={() => handleImageLoad(type)}
                />
              </div>
            }
            onClick={() => onSelect(type)}
          />
        ),
      };
    });
  }, [value, t, onSelect, loadedImages]);

  return (
    <SpeechBubble type="question">
      <div className="flex flex-col gap-4 lg:flex-row">{movingTypeCards.map(({ card }) => card)}</div>
    </SpeechBubble>
  );
};

export default MovingTypeSection;
