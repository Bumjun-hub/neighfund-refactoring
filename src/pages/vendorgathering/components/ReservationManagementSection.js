import React, { useState } from 'react';
import { updateVendorReservationStatus } from '../vendorGatheringApi';
import VendorEmptyState from './VendorEmptyState';
import {
  formatReservationDateTime,
  getReservationStatusColor,
  getReservationStatusText,
} from './vendorAdminFormatters';

const ReservationManagementSection = ({ reservations, onRefresh }) => {
  const [filter, setFilter] = useState('ALL');
  const [expandedRows, setExpandedRows] = useState(new Set());

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      console.log(`상태 변경 시도: 예약 ID ${reservationId}, 새 상태: ${newStatus}`);
      const message = await updateVendorReservationStatus(reservationId, newStatus);
      console.log('응답 메시지:', message);
      alert('상태가 변경되었습니다.');
      onRefresh();
    } catch (error) {
      if (error?.status === 403) {
        alert('관리자 권한이 필요합니다.');
      } else if (error?.status === 400) {
        alert(`잘못된 요청: ${error?.data?.message || error?.message}`);
      } else {
        alert(`상태 변경에 실패했습니다: ${error?.data?.message || error?.message}`);
        console.error('API 응답 에러:', error?.status, error?.message);
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

  const filteredReservations = (reservations || []).filter((r) => filter === 'ALL' || r.status === filter);

  return (
    <div className="vendor-reservation-management">
      <div className="vendor-reservation-filter-section">
        <div className="vendor-reservation-filter-controls">
          <select
            className="vendor-reservation-filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">전체</option>
            <option value="PENDING">결제 대기</option>
            <option value="PAID">결제 완료</option>
            <option value="CONFIRMED">예약 확정</option>
            <option value="COMPLETED">수강 완료</option>
            <option value="CANCELLED">취소됨</option>
            <option value="REFUNDED">환불됨</option>
          </select>
          <span className="vendor-reservation-count-badge">총 {filteredReservations.length}개</span>
        </div>
      </div>

      <div className="vendor-reservation-table-container">
        <table className="vendor-admin-table">
          <thead>
            <tr>
              <th>예약 ID</th>
              <th>클래스명</th>
              <th>수업 일시</th>
              <th>참가자 수</th>
              <th>입금자명</th>
              <th>입금 은행</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <React.Fragment key={reservation.reservationId}>
                  <tr
                    className={`vendor-admin-table-row ${
                      expandedRows.has(reservation.reservationId) ? 'vendor-expanded' : ''
                    }`}
                    onClick={() => toggleRow(reservation.reservationId)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <strong>#{reservation.reservationId}</strong>
                    </td>
                    <td>
                      <div className="vendor-class-info">
                        <div className="vendor-class-title">{reservation.classTitle || '클래스명 없음'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="vendor-datetime-info">
                        {formatReservationDateTime(reservation.date, reservation.startTime)}
                      </div>
                    </td>
                    <td className="vendor-participant-count">
                      <strong>{reservation.participantCount || 1}명</strong>
                    </td>
                    <td>
                      <div className="vendor-payment-info">
                        <div className="vendor-payment-name">{reservation.paymentName || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="vendor-bank-info">{reservation.paymentBank || 'N/A'}</div>
                    </td>
                    <td>
                      <span className="vendor-status-badge" style={{ backgroundColor: getReservationStatusColor(reservation.status) }}>
                        {getReservationStatusText(reservation.status)}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="vendor-action-buttons">
                        {reservation.status === 'PENDING' && (
                          <button
                            className="vendor-btn vendor-btn-approve"
                            onClick={() => handleStatusUpdate(reservation.reservationId, 'PAID')}
                            title="입금 확인"
                          >
                            입금 확인
                          </button>
                        )}
                        {reservation.status === 'PAID' && (
                          <button
                            className="vendor-btn vendor-btn-confirm"
                            onClick={() => handleStatusUpdate(reservation.reservationId, 'CONFIRMED')}
                            title="예약 확정"
                          >
                            예약 확정
                          </button>
                        )}
                        {reservation.status === 'CONFIRMED' && (
                          <button
                            className="vendor-btn vendor-btn-complete"
                            onClick={() => handleStatusUpdate(reservation.reservationId, 'COMPLETED')}
                            title="수강 완료"
                          >
                            수강 완료
                          </button>
                        )}
                        {(reservation.status === 'PENDING' || reservation.status === 'PAID') && (
                          <button
                            className="vendor-btn vendor-btn-cancel"
                            onClick={() => {
                              if (window.confirm('정말 취소하시겠습니까?')) {
                                handleStatusUpdate(reservation.reservationId, 'CANCELLED');
                              }
                            }}
                            title="예약 취소"
                          >
                            취소
                          </button>
                        )}
                        {reservation.status === 'CANCELLED' && (
                          <button
                            className="vendor-btn vendor-btn-refund"
                            onClick={() => {
                              if (window.confirm('환불 처리하시겠습니까?')) {
                                handleStatusUpdate(reservation.reservationId, 'REFUNDED');
                              }
                            }}
                            title="환불 처리"
                          >
                            환불
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {expandedRows.has(reservation.reservationId) && (
                    <tr className="vendor-detail-row">
                      <td colSpan="8">
                        <div className="vendor-detail-content">
                          <div className="vendor-detail-grid">
                            <div className="vendor-detail-section">
                              <h4>예약 상세 정보</h4>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">예약 ID:</span>
                                <span className="vendor-detail-value">#{reservation.reservationId}</span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">클래스명:</span>
                                <span className="vendor-detail-value">{reservation.classTitle}</span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">수업 날짜:</span>
                                <span className="vendor-detail-value">
                                  {reservation.date ? new Date(reservation.date).toLocaleDateString('ko-KR') : 'N/A'}
                                </span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">수업 시간:</span>
                                <span className="vendor-detail-value">{reservation.startTime || 'N/A'}</span>
                              </div>
                            </div>

                            <div className="vendor-detail-section">
                              <h4>결제 정보</h4>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">참가자 수:</span>
                                <span className="vendor-detail-value">{reservation.participantCount}명</span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">입금자명:</span>
                                <span className="vendor-detail-value">{reservation.paymentName || 'N/A'}</span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">입금 은행:</span>
                                <span className="vendor-detail-value">{reservation.paymentBank || 'N/A'}</span>
                              </div>
                              <div className="vendor-detail-item">
                                <span className="vendor-detail-label">현재 상태:</span>
                                <span className="vendor-detail-value">
                                  <span className="vendor-status-badge" style={{ backgroundColor: getReservationStatusColor(reservation.status) }}>
                                    {getReservationStatusText(reservation.status)}
                                  </span>
                                </span>
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
              <VendorEmptyState
                colSpan={8}
                message={
                  <div>
                    {reservations && reservations.length === 0 ? '예약 데이터가 없습니다.' : '조건에 맞는 예약이 없습니다.'}
                  </div>
                }
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationManagementSection;
