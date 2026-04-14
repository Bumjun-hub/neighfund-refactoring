import React, { useState } from 'react';
import {
  approveVendorGathering,
  deleteVendorGathering,
  rejectVendorGathering,
} from '../vendorGatheringApi';
import VendorEmptyState from './VendorEmptyState';

const GatheringManagementSection = ({ gatherings, onRefresh }) => {
  const [filter, setFilter] = useState('ALL');
  const [expandedRows, setExpandedRows] = useState(new Set());

  const handleApprove = async (id) => {
    try {
      await approveVendorGathering(id);
      alert('승인되었습니다.');
      onRefresh();
    } catch (error) {
      if (error?.status === 403) {
        alert('관리자 권한이 필요합니다.');
      } else {
        alert('승인 실패');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('정말 거절하시겠습니까?')) {
      try {
        await rejectVendorGathering(id);
        alert('거절되었습니다.');
        onRefresh();
      } catch (error) {
        if (error?.status === 403) {
          alert('관리자 권한이 필요합니다.');
        } else {
          alert('거절 실패');
        }
      }
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`'${title}' 클래스를 정말 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.`)) {
      try {
        const result = await deleteVendorGathering(id);
        if (result) {
          alert(result.message || '원데이클래스가 삭제되었습니다.');
        }
        onRefresh();
      } catch (error) {
        if (error?.status === 403) {
          alert('관리자 권한이 필요합니다.');
        } else if (error?.status === 404) {
          alert('해당 클래스를 찾을 수 없습니다.');
        } else if (error?.status === 409) {
          alert(`삭제할 수 없습니다: ${error?.data?.message || '이미 예약이 있거나 진행 중인 클래스입니다.'}`);
        } else {
          alert(`삭제 실패: ${error?.data?.message || error?.message || '서버 오류가 발생했습니다.'}`);
        }
        console.error('삭제 실패:', error);
      }
    }
  };

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredGatherings = Array.isArray(gatherings)
    ? gatherings.filter((g) => filter === 'ALL' || g.status === filter)
    : [];

  return (
    <div className="vendor-gathering-management">
      <div className="vendor-gathering-filter-section">
        <select
          className="vendor-gathering-filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">전체</option>
          <option value="PENDING">승인 대기</option>
          <option value="APPROVED">승인됨</option>
          <option value="REJECTED">거절됨</option>
        </select>
        <span className="vendor-gathering-count">총 {filteredGatherings.length}개</span>
      </div>

      <table className="vendor-admin-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>위치</th>
            <th>상태</th>
            <th>제출일</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {filteredGatherings.length > 0 ? (
            filteredGatherings.map((gathering) => (
              <React.Fragment key={gathering.id}>
                <tr
                  className="vendor-admin-table-row"
                  onClick={() => toggleRow(gathering.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{gathering.title}</td>
                  <td>{gathering.category}</td>
                  <td>{gathering.price?.toLocaleString()}원</td>
                  <td>{gathering.location}</td>
                  <td>
                    <span className={`vendor-status-badge vendor-status-${gathering.status?.toLowerCase()}`}>
                      {gathering.status === 'PENDING' ? '대기' : gathering.status === 'APPROVED' ? '승인' : '거절'}
                    </span>
                  </td>
                  <td>{new Date(gathering.submittedAt).toLocaleDateString()}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="vendor-action-buttons">
                      {gathering.status === 'PENDING' && (
                        <>
                          <button
                            className="vendor-btn vendor-btn-approve"
                            onClick={() => handleApprove(gathering.id)}
                            title="승인"
                          >
                            승인
                          </button>
                          <button
                            className="vendor-btn vendor-btn-reject"
                            onClick={() => handleReject(gathering.id)}
                            title="거절"
                          >
                            거절
                          </button>
                        </>
                      )}

                      <button
                        className="vendor-btn vendor-btn-delete"
                        onClick={() => handleDelete(gathering.id, gathering.title)}
                        title="삭제"
                        style={{ marginLeft: '4px' }}
                      >
                        🗑️ 삭제
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRows.has(gathering.id) && (
                  <tr className="vendor-detail-row">
                    <td colSpan="7">
                      <div className="vendor-detail-content">
                        <div className="vendor-detail-grid">
                          <div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">설명</div>
                              <div className="vendor-detail-value">{gathering.description}</div>
                            </div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">최대 참가자</div>
                              <div className="vendor-detail-value">{gathering.maxParticipants}명</div>
                            </div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">준비물</div>
                              <div className="vendor-detail-value">{gathering.materials}</div>
                            </div>
                          </div>
                          <div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">업체명</div>
                              <div className="vendor-detail-value">{gathering.vendorName}</div>
                            </div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">연락처</div>
                              <div className="vendor-detail-value">{gathering.vendorContact}</div>
                            </div>
                            <div className="vendor-detail-item">
                              <div className="vendor-detail-label">이메일</div>
                              <div className="vendor-detail-value">{gathering.vendorEmail}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <VendorEmptyState colSpan={7} message="데이터가 없습니다." />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GatheringManagementSection;
