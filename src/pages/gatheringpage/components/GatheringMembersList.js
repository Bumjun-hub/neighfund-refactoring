import React from 'react';

const GatheringMembersList = ({ members, formatDate }) => {
  if (!members || members.length === 0) {
    return <p className="no-members">아직 참여자가 없습니다.</p>;
  }

  return (
    <div className="members-list">
      {members.map((member, index) => {
        console.log(`👤 멤버 ${index + 1}:`, {
          nickname: member.nickname,
          imageUrl: member.imageUrl,
          role: member.role,
        });

        return (
          <div key={member.id || index} className={`member-item ${member.role === 'LEADER' ? 'leader' : ''}`}>
            <div className="member-avatar">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.nickname}
                  onLoad={() => console.log('✅ 이미지 로드 성공:', member.imageUrl)}
                  onError={(e) => {
                    console.log('❌ 이미지 로드 실패:', member.imageUrl);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="default-avatar" style={{ display: member.imageUrl ? 'none' : 'flex' }}>
                {member.nickname ? member.nickname.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
            <div className="member-info">
              <div className="member-name">
                {member.nickname || '알 수 없음'}
                {member.role === 'LEADER' && <span className="leader-badge">👑 리더</span>}
              </div>
              {member.introduction && <div className="member-introduction">{member.introduction}</div>}
              <div className="member-join-date">
                {member.joinedAt ? `${formatDate(member.joinedAt)} 참여` : '참여일 불명'}
              </div>
            </div>
            <div className="member-role">
              <span className={`role-badge ${(member.role || 'USER').toLowerCase()}`}>
                {member.role === 'LEADER' ? '리더' : '멤버'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GatheringMembersList;
