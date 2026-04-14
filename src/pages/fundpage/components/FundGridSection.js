import React from 'react';
import FundCard from '../../../components/FundCard';

const FundGridSection = ({ fundsStatus, funds, visibleCount, onRetry }) => {
  return (
    <div className="fund-grid">
      {fundsStatus === 'loading' && (
        <div className="fund-page-status fund-page-status--loading">펀딩 목록을 불러오는 중입니다...</div>
      )}
      {fundsStatus === 'error' && (
        <div className="fund-page-status fund-page-status--error" role="alert">
          <p>펀딩 목록을 불러오지 못했습니다.</p>
          <button type="button" className="fund-page-retry-btn" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      )}
      {fundsStatus === 'ready' && Array.isArray(funds) && funds.length === 0 && (
        <div className="fund-page-status">진행 중인 펀딩이 없습니다.</div>
      )}
      {fundsStatus === 'ready' &&
        Array.isArray(funds) &&
        funds.slice(0, visibleCount).map((fund) => {
          console.log('펀딩 항목:', fund);
          return <FundCard key={fund.id} fund={fund} />;
        })}
    </div>
  );
};

export default FundGridSection;
