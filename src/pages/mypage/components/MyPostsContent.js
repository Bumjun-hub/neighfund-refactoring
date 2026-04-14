import React from 'react';
import SuggestionCard from '../../../components/SuggestionCard';
import GatheringCard from '../../../components/GatheringCard';
import { TAB, getReservationStatusText } from './myPostsUtils';

const MyPostsContent = ({
  activeTab,
  myCommunityPosts,
  likedPosts,
  participatedFunds,
  participatedGatherings,
  myReservations,
  onMoveFundDetail,
}) => {
  return (
    <div className="mypage-main-content">
      {activeTab === TAB.WRITTEN && (
        <div>
          <h3>내가 쓴 제안글</h3>
          <div className="card-list-flex">
            {myCommunityPosts.length === 0 ? (
              <div>작성한 글이 없습니다.</div>
            ) : (
              myCommunityPosts.map((post) => <SuggestionCard key={post.id} post={post} size="small" />)
            )}
          </div>
        </div>
      )}

      {activeTab === TAB.LIKED && (
        <div>
          <h3>공감/좋아요 누른 제안글</h3>
          <div className="card-list-flex">
            {likedPosts.length === 0 ? (
              <div>좋아요 누른 글이 없습니다.</div>
            ) : (
              likedPosts.map((post) => <SuggestionCard key={post.id} post={post} size="small" />)
            )}
          </div>
        </div>
      )}

      {activeTab === TAB.FUND && (
        <div>
          <h3>참여 중인 펀딩</h3>
          <div className="mini-card-list">
            {participatedFunds.length === 0 ? (
              <div>참여 중인 펀딩이 없습니다.</div>
            ) : (
              participatedFunds.map((order) => (
                <div
                  className="mini-card"
                  key={order.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onMoveFundDetail(order.fundId)}
                >
                  {order.fundImage && <img src={order.fundImage} alt="펀딩 이미지" />}
                  <div className="card-title">{order.fundTitle}</div>
                  <div className="card-option">{order.optionTitle}</div>
                  <div className="card-qty">{order.quantity}개</div>
                  {order.progressRate !== undefined && (
                    <div className="mini-progress-bar-wrapper">
                      <div className="mini-progress-bar-fill" style={{ width: `${order.progressRate}%` }} />
                    </div>
                  )}
                  <div className="card-meta">
                    <span>{order.progressRate ?? 0}% 달성</span>
                    {order.deadline && (
                      <span style={{ marginLeft: 8 }}>/ 마감: {new Date(order.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === TAB.GATHERING && (
        <div>
          <h3>참여 중인 소모임</h3>
          <div className="card-list-flex">
            {participatedGatherings.length === 0 ? (
              <div>참여 중인 소모임이 없습니다.</div>
            ) : (
              participatedGatherings.map((g) => <GatheringCard key={g.id} gathering={g} large />)
            )}
          </div>
        </div>
      )}

      {activeTab === TAB.CLASS && (
        <div>
          <h3>예약한 원데이클래스</h3>
          <div className="mini-card-list">
            {myReservations.length === 0 ? (
              <div>예약 내역이 없습니다.</div>
            ) : (
              myReservations.map((res, index) => (
                <div className="reservation-card" key={index}>
                  <div className="reservation-title">{res.classTitle || '클래스명 없음'}</div>

                  <div className="reservation-datetime">
                    <div className="reservation-date">📅 {res.date}</div>
                    <div className="reservation-time">
                      🕐 {res.startTime} - {res.endTime}
                    </div>
                  </div>

                  <div className="reservation-info">
                    <div className="reservation-participants">👥 {res.participantCount}명</div>
                    <div className={`reservation-status status-${res.status?.toLowerCase()}`}>
                      {getReservationStatusText(res.status)}
                    </div>
                  </div>

                  {res.status === 'PENDING' && res.paymentBank && (
                    <div className="payment-info">
                      <div className="payment-bank">🏦 {res.paymentBank}</div>
                      <div className="payment-name">💳 {res.paymentName}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPostsContent;
