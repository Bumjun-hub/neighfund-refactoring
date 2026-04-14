import React from 'react';
import { FUND_CATEGORY_MAP } from './fundInfoConstants';

const FundInfoTopSection = ({ fund }) => {
  return (
    <div className="fund-info-top">
      <img src={fund.fundImages?.[0]} alt={fund.title} className="fund-info-image" />
      <div className="fund-info-details">
        <span className="fund-tag">#{FUND_CATEGORY_MAP[fund.category] || fund.category}</span>

        <h3 className="fund-name">{fund.title}</h3>
        <p className="fund-subtext">{fund.subTitle}</p>

        <div className="fund-stats-box">
          <div className="fund-stat">
            <span>목표 금액</span>
            <strong>{fund.targetAmount?.toLocaleString()}원</strong>
          </div>
          <div className="fund-stat">
            <span>현재 금액</span>
            <strong>{fund.currentAmount?.toLocaleString()}원</strong>
          </div>
          <div className="fund-stat">
            <span>참여자 수</span>
            <strong>{fund.currentParticipants}명</strong>
          </div>
          <div className="fund-stat">
            <span>마감일</span>
            <strong>{fund.deadline?.split('T')[0]}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundInfoTopSection;
