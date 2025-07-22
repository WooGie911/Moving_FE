import { IWritableCardData } from "@/types/review";
import WritableMoverCard from "./WritableMoverCard";

interface IMoverCardListProps {
  cards: IWritableCardData[];
  onClickWrite: (card: IWritableCardData) => void;
}

const WritableMoverCardList = ({ cards, onClickWrite }: IMoverCardListProps) => (
  <div>
    {cards.map((card) => (
      <WritableMoverCard
        key={card.id}
        profileImage={card.profileImage}
        nickname={card.nickname}
        movingType={card.movingType}
        isDesigned={card.isDesigned}
        moverIntroduction={card.moverIntroduction}
        departureAddr={card.departureAddr}
        arrivalAddr={card.arrivalAddr}
        movingDate={card.movingDate}
        price={card.price}
        onClickWrite={() => onClickWrite(card)}
      />
    ))}
  </div>
);

export default WritableMoverCardList;
