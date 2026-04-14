import React from 'react';
import Section from '../../../components/Section';

const FundFetchStatusView = ({ status, onRetry }) => {
  if (status === 'loading') {
    return (
      <Section>
        <div className="fund-fetch-status fund-fetch-status--loading" role="status">
          펀딩 정보를 불러오는 중입니다…
        </div>
      </Section>
    );
  }

  if (status === 'error') {
    return (
      <Section>
        <div className="fund-fetch-status fund-fetch-status--error" role="alert">
          <p>펀딩 정보를 불러오지 못했습니다.</p>
          <button type="button" className="fund-fetch-retry-btn" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="fund-fetch-status fund-fetch-status--not-found">해당 펀딩을 찾을 수 없습니다.</div>
    </Section>
  );
};

export default FundFetchStatusView;
