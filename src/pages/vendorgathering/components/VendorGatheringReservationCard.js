import React from 'react';
import { Calendar, Clock, CreditCard, Users } from 'lucide-react';

const VendorGatheringReservationCard = ({
  gathering,
  today,
  showReservationForm,
  onShowForm,
  selectedDate,
  onDateChange,
  availableSlots,
  selectedTime,
  onSelectTime,
  participantCount,
  onParticipantCountChange,
  paymentBank,
  onPaymentBankChange,
  paymentName,
  onPaymentNameChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="vendor-detail-reservation-sidebar">
      <div className="vendor-detail-reservation-card">
        <div className="vendor-detail-price-section">
          <div className="vendor-detail-price">{gathering.price.toLocaleString()}원</div>
          <div className="vendor-detail-price-unit">1인 기준</div>
        </div>

        {!showReservationForm ? (
          <button onClick={onShowForm} className="vendor-detail-reservation-btn">
            예약하기
          </button>
        ) : (
          <div className="vendor-detail-reservation-form">
            <h3 className="vendor-detail-form-title">예약 정보</h3>

            <div className="vendor-detail-form-group">
              <label className="vendor-detail-form-label">
                <Calendar className="vendor-detail-form-label-icon" />
                날짜 선택
              </label>
              <input
                type="date"
                value={selectedDate}
                min={today}
                onChange={(e) => onDateChange(e.target.value)}
                className="vendor-detail-form-input"
              />
            </div>

            {selectedDate && (
              <div className="vendor-detail-form-group">
                <label className="vendor-detail-form-label">
                  <Clock className="vendor-detail-form-label-icon" />
                  시간 선택
                </label>
                <div className="vendor-detail-time-grid">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => onSelectTime(slot.time)}
                      disabled={!slot.available}
                      className={`vendor-detail-time-slot ${
                        selectedTime === slot.time ? 'selected' : slot.available ? 'available' : 'unavailable'
                      }`}
                    >
                      {slot.time}
                      {slot.available && (
                        <div className="vendor-detail-time-info">
                          {slot.currentParticipants}/{gathering.maxParticipants}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="vendor-detail-form-group">
              <label className="vendor-detail-form-label">
                <Users className="vendor-detail-form-label-icon" />
                참가 인원
              </label>
              <select
                value={participantCount}
                onChange={(e) => onParticipantCountChange(parseInt(e.target.value, 10))}
                className="vendor-detail-form-select"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </select>
            </div>

            <div className="vendor-detail-form-group">
              <label className="vendor-detail-form-label">
                <CreditCard className="vendor-detail-form-label-icon" />
                입금 은행
              </label>
              <input
                type="text"
                value={paymentBank}
                onChange={(e) => onPaymentBankChange(e.target.value)}
                className="vendor-detail-form-input"
              />
            </div>

            <div className="vendor-detail-form-group">
              <label className="vendor-detail-form-label">입금자명</label>
              <input
                type="text"
                value={paymentName}
                onChange={(e) => onPaymentNameChange(e.target.value)}
                placeholder="입금자명을 입력하세요"
                className="vendor-detail-form-input"
              />
            </div>

            <div className="vendor-detail-total-box">
              <div className="vendor-detail-total">
                <span>총 금액</span>
                <span className="vendor-detail-total-amount">
                  {(gathering.price * participantCount).toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="vendor-detail-button-group">
              <button onClick={onCancel} className="vendor-detail-btn-secondary">
                취소
              </button>
              <button onClick={onSubmit} className="vendor-detail-btn-primary">
                예약 신청
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorGatheringReservationCard;
