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
        moveType={card.moveType as "SMALL" | "HOME" | "OFFICE"}
        isDesigned={card.isDesigned}
        moverIntroduction={card.moverIntroduction}
        fromAddress={card.fromAddress}
        toAddress={card.toAddress}
        moveDate={card.moveDate}
        price={card.price}
        onClickWrite={() => onClickWrite(card)}
      />
    ))}
  </div>
);

export default WritableMoverCardList;
