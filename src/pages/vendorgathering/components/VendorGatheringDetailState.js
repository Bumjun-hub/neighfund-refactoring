import React from 'react';
import { XCircle } from 'lucide-react';

const VendorGatheringDetailState = ({ type }) => {
  if (type === 'loading') {
    return (
      <div className="vendor-detail-loading">
        <div className="vendor-detail-loading-content">
          <div className="vendor-detail-loading-image"></div>
          <div className="vendor-detail-loading-text">
            <div className="vendor-detail-loading-line title"></div>
            <div className="vendor-detail-loading-line meta"></div>
            <div className="vendor-detail-loading-line description"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-detail-error">
      <XCircle className="vendor-detail-error-icon" />
      <p className="vendor-detail-error-text">클래스 정보를 불러올 수 없습니다.</p>
    </div>
  );
};

export default VendorGatheringDetailState;
