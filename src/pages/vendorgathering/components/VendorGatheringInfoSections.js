import React from 'react';
import { Mail, Phone, User } from 'lucide-react';

const VendorGatheringInfoSections = ({ gathering }) => {
  return (
    <div className="vendor-detail-main">
      <section className="vendor-detail-section">
        <h2 className="vendor-detail-section-title">클래스 소개</h2>
        <p className="vendor-detail-description">{gathering.description}</p>
      </section>

      <section className="vendor-detail-section">
        <h2 className="vendor-detail-section-title">클래스 정보</h2>
        <div className="vendor-detail-info-box">
          <div className="vendor-detail-info-item">
            <span className="vendor-detail-info-label">상품명:</span>
            <span className="vendor-detail-info-value">{gathering.productName}</span>
          </div>
          <div className="vendor-detail-info-item">
            <span className="vendor-detail-info-label">카테고리:</span>
            <span className="vendor-detail-info-value">{gathering.categoryKorean}</span>
          </div>
          <div className="vendor-detail-info-item">
            <span className="vendor-detail-info-label">수업 시간:</span>
            <span className="vendor-detail-info-value">{gathering.duration}</span>
          </div>
          <div className="vendor-detail-info-item">
            <span className="vendor-detail-info-label">무료 주차:</span>
            <span className="vendor-detail-info-value">{gathering.freeParking === 'true' ? '가능' : '불가능'}</span>
          </div>
          <div className="vendor-detail-info-item">
            <span className="vendor-detail-info-label">최대 인원:</span>
            <span className="vendor-detail-info-value">{gathering.maxParticipants}명</span>
          </div>
        </div>
      </section>

      <section className="vendor-detail-section">
        <h2 className="vendor-detail-section-title">강사 정보</h2>
        <div className="vendor-detail-instructor">
          <div className="vendor-detail-instructor-header">
            <User className="vendor-detail-instructor-icon" />
            <div>
              <h3 className="vendor-detail-instructor-name">{gathering.instructor}</h3>
              <p className="vendor-detail-instructor-role">원데이클래스 강사</p>
            </div>
          </div>
          <div className="vendor-detail-instructor-contact">
            <div className="vendor-detail-contact-item">
              <Phone className="vendor-detail-contact-icon" />
              <span className="vendor-detail-contact-text">{gathering.instructorPhone}</span>
            </div>
            <div className="vendor-detail-contact-item">
              <Mail className="vendor-detail-contact-icon" />
              <span className="vendor-detail-contact-text">{gathering.instructorEmail}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorGatheringInfoSections;
