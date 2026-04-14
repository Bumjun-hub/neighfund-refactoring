import React from 'react';

const VendorAdminHeader = ({ activeTab, onChangeTab }) => {
  return (
    <header className="vendor-admin-header">
      <h1>관리자 페이지</h1>
      <nav className="vendor-admin-nav">
        <button
          className={activeTab === 'gatherings' ? 'vendor-admin-nav-btn active' : 'vendor-admin-nav-btn'}
          onClick={() => onChangeTab('gatherings')}
        >
          원데이클래스 관리
        </button>
        <button
          className={activeTab === 'reservations' ? 'vendor-admin-nav-btn active' : 'vendor-admin-nav-btn'}
          onClick={() => onChangeTab('reservations')}
        >
          예약 관리
        </button>
      </nav>
    </header>
  );
};

export default VendorAdminHeader;
