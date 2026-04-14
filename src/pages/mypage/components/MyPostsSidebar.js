import React from 'react';
import { TAB, getProfileImageUrl } from './myPostsUtils';

const MyPostsSidebar = ({ userInfo, activeTab, onChangeTab }) => {
  return (
    <div className="mypage-sidebar">
      <div className="user-profile-box">
        {userInfo?.imageUrl ? (
          <img src={getProfileImageUrl(userInfo.imageUrl)} alt="프로필" className="profile-img" />
        ) : (
          <div className="profile-placeholder">{(userInfo?.username || 'U').charAt(0)}</div>
        )}
        <div className="profile-name">{userInfo?.username || '로그인 필요'}</div>
      </div>
      <div className="sidebar-menu">
        <button className={activeTab === TAB.WRITTEN ? 'active' : ''} onClick={() => onChangeTab(TAB.WRITTEN)}>
          내가 쓴 제안글
        </button>
        <button className={activeTab === TAB.LIKED ? 'active' : ''} onClick={() => onChangeTab(TAB.LIKED)}>
          공감/좋아요 누른 제안글
        </button>
        <button className={activeTab === TAB.FUND ? 'active' : ''} onClick={() => onChangeTab(TAB.FUND)}>
          참여 중인 펀딩
        </button>
        <button className={activeTab === TAB.GATHERING ? 'active' : ''} onClick={() => onChangeTab(TAB.GATHERING)}>
          참여 중인 소모임
        </button>
        <button className={activeTab === TAB.CLASS ? 'active' : ''} onClick={() => onChangeTab(TAB.CLASS)}>
          예약한 원데이클래스
        </button>
      </div>
    </div>
  );
};

export default MyPostsSidebar;
