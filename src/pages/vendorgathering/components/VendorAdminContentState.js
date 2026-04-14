import React from 'react';

const VendorAdminContentState = ({ loading, errorMessage, onRetry, children }) => {
  if (loading) {
    return <div className="vendor-admin-loading">로딩 중...</div>;
  }

  if (errorMessage) {
    return (
      <div className="vendor-admin-status vendor-admin-status--error" role="alert">
        <p>{errorMessage}</p>
        <button type="button" className="vendor-admin-retry-btn" onClick={onRetry}>
          다시 시도
        </button>
      </div>
    );
  }

  return children;
};

export default VendorAdminContentState;
