import React from 'react';

const FundTabs = ({ activeTab, onChangeTab }) => {
  return (
    <div className="fund-tabs">
      <button className={activeTab === 'intro' ? 'active' : ''} onClick={() => onChangeTab('intro')}>
        소개
      </button>
      <button className={activeTab === 'budget' ? 'active' : ''} onClick={() => onChangeTab('budget')}>
        예산
      </button>
      <button className={activeTab === 'schedule' ? 'active' : ''} onClick={() => onChangeTab('schedule')}>
        일정
      </button>
    </div>
  );
};

export default FundTabs;
