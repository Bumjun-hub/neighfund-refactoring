import React from 'react';

const FundRewardPanel = ({
  options,
  isClosed,
  myOrderOptionIds,
  selectedReward,
  onSelectReward,
  onParticipate,
}) => {
  return (
    <div className="fund-reward-right">
      <h3 style={{ marginBottom: '10px' }}>🎁 리워드</h3>
      {options?.map((opt, idx) => (
        <div className="fund-reward-item" key={idx}>
          <label>
            <input
              type="checkbox"
              disabled={isClosed || myOrderOptionIds.includes(opt.id)}
              checked={selectedReward?.id === opt.id}
              onChange={() => onSelectReward(opt)}
            />
            {isClosed && <p className="reward-closed-msg">⚠️ 마감된 펀딩입니다.</p>}
            <span className="reward-title">
              {opt.title} - {opt.amount?.toLocaleString()}원
            </span>
          </label>
          <p className="reward-desc">{opt.description}</p>
          <span className={`reward-quantity ${opt.quantity === 0 ? 'out-of-stock' : ''}`}>재고 {opt.quantity}개 남음!</span>
        </div>
      ))}
      <button className="fund-participate-btn" disabled={!selectedReward} onClick={onParticipate}>
        {isClosed ? '마감된 펀딩입니다' : '선택한 리워드로 펀딩 신청하기'}
      </button>
    </div>
  );
};

export default FundRewardPanel;
