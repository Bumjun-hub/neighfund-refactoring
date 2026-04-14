import React from 'react';
import FundParticipatePage from '../../fundparticipantpage/FundParticipatePage';

const FundParticipateModal = ({ isOpen, onClose, fund, selectedReward }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <FundParticipatePage
          fundId={fund.id}
          optionId={selectedReward.id}
          rewardTitle={selectedReward.title}
          rewardAmount={selectedReward.amount}
        />
      </div>
    </div>
  );
};

export default FundParticipateModal;
