import React from 'react';
import GatheringCard from './GatheringCard';

const GatheringColumn = ({ className, cards, onCardClick, onLike, renderHeader }) => {
  return (
    <div className={className}>
      {renderHeader ? renderHeader() : null}
      {cards.map((gathering) => (
        <GatheringCard
          key={gathering.id}
          gathering={gathering}
          onCardClick={onCardClick}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default GatheringColumn;
