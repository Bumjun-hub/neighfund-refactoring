import React from 'react';
import GatheringBoard from '../GatheringBoard';
import GatheringPhotos from '../GatheringPhotos';
import GatheringMembersList from './GatheringMembersList';

const GatheringTabContent = ({
  activeTab,
  gathering,
  members,
  isMember,
  gatheringId,
  onJoin,
  formatDate,
}) => {
  switch (activeTab) {
    case 'intro':
      return (
        <div className="tab-content">
          <div className="content-text">
            {gathering.content.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      );
    case 'members':
      return (
        <div className="tab-content">
          <div className="members-section">
            <h3>참여자 목록 ({members.length}명)</h3>
            <GatheringMembersList members={members} formatDate={formatDate} />
          </div>
        </div>
      );
    case 'board':
      return (
        <div className="tab-content">
          {isMember ? (
            <GatheringBoard gatheringId={gatheringId} isMember={isMember} />
          ) : (
            <div className="member-only-content">
              <div className="lock-icon">🔒</div>
              <p>소모임 멤버만 게시판을 볼 수 있습니다.</p>
              <button onClick={onJoin} className="join-button-inline">
                소모임 참여하기
              </button>
            </div>
          )}
        </div>
      );
    case 'photos':
      return (
        <div className="tab-content">
          <GatheringPhotos gatheringId={gatheringId} isMember={isMember} />
        </div>
      );
    default:
      return null;
  }
};

export default GatheringTabContent;
