import React from 'react';

const GatheringTabMenu = ({ activeTab, onChangeTab, memberCount, isMember }) => {
  return (
    <div className="tab-menu">
      <button className={`tab-button ${activeTab === 'intro' ? 'active' : ''}`} onClick={() => onChangeTab('intro')}>
        📝 소모임 소개
      </button>
      <button className={`tab-button ${activeTab === 'members' ? 'active' : ''}`} onClick={() => onChangeTab('members')}>
        👥 참여자 ({memberCount})
      </button>
      <button className={`tab-button ${activeTab === 'board' ? 'active' : ''}`} onClick={() => onChangeTab('board')}>
        💬 게시판
        {!isMember && <span className="member-only-indicator">🔒</span>}
      </button>
      <button className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => onChangeTab('photos')}>
        📷 사진첩
      </button>
    </div>
  );
};

export default GatheringTabMenu;
