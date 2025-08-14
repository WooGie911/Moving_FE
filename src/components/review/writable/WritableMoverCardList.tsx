import { IWritableCardData } from "@/types/review";
import WritableMoverCard from "./WritableMoverCard";

interface IWritableMoverCardListProps {
  cards: IWritableCardData[];
  onClickWrite: (card: IWritableCardData) => void;
}

const WritableMoverCardList = ({ cards, onClickWrite }: IWritableMoverCardListProps) => (
  <div>
    {cards.map((card) => (
      <WritableMoverCard
        key={card.reviewId}
        id={card.reviewId}
        profileImage={card.mover.profileImage}
        nickname={card.mover.nickname}
        shortIntro={card.mover.shortIntro}
        fromAddress={card.fromAddress}
        toAddress={card.toAddress}
        moveDate={card.moveDate}
        price={card.estimate.price}
        onClickWrite={() => onClickWrite(card)}
      />
    ))}
  </div>
);

export default WritableMoverCardList;
