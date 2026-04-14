import React, { useState } from 'react';
import './VendorAdminPage.css';
import {
  getVendorAdminGatherings,
  getVendorAdminReservations,
} from './vendorGatheringApi';
import VendorAdminHeader from './components/VendorAdminHeader';
import VendorAdminContentState from './components/VendorAdminContentState';
import GatheringManagementSection from './components/GatheringManagementSection';
import ReservationManagementSection from './components/ReservationManagementSection';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const vendorAdminQueryClient = new QueryClient();

const VendorAdminPageContent = () => {
  const [activeTab, setActiveTab] = useState('gatherings');

  const gatheringsQuery = useQuery({
    queryKey: ['vendorAdmin', 'gatherings'],
    queryFn: async () => {
      const data = await getVendorAdminGatherings();
      return Array.isArray(data) ? data : [];
    },
    enabled: activeTab === 'gatherings',
  });

  const reservationsQuery = useQuery({
    queryKey: ['vendorAdmin', 'reservations'],
    queryFn: async () => {
      const data = await getVendorAdminReservations();
      return Array.isArray(data) ? data : [];
    },
    enabled: activeTab === 'reservations',
  });

  const activeLoading =
    activeTab === 'gatherings'
      ? gatheringsQuery.isLoading || gatheringsQuery.isFetching
      : reservationsQuery.isLoading || reservationsQuery.isFetching;

  const activeError = (() => {
    const queryError = activeTab === 'gatherings' ? gatheringsQuery.error : reservationsQuery.error;
    if (!queryError) return '';
    if (queryError?.status === 403) return '관리자 권한이 필요합니다.';
    return activeTab === 'gatherings'
      ? '원데이클래스 목록을 불러오지 못했습니다.'
      : '예약 데이터를 불러오지 못했습니다.';
  })();

  const activeRetry =
    activeTab === 'gatherings' ? gatheringsQuery.refetch : reservationsQuery.refetch;

  return (
    <div className="vendor-admin-page">
      <VendorAdminHeader activeTab={activeTab} onChangeTab={setActiveTab} />

      <main className="vendor-admin-content">
        <VendorAdminContentState loading={activeLoading} errorMessage={activeError} onRetry={activeRetry}>
          <>
            {activeTab === 'gatherings' && (
              <GatheringManagementSection
                gatherings={gatheringsQuery.data || []}
                onRefresh={gatheringsQuery.refetch}
              />
            )}
            {activeTab === 'reservations' && (
              <ReservationManagementSection
                reservations={reservationsQuery.data || []}
                onRefresh={reservationsQuery.refetch}
              />
            )}
          </>
        </VendorAdminContentState>
      </main>
    </div>
  );
};

const VendorAdminPage = () => {
  return (
    <QueryClientProvider client={vendorAdminQueryClient}>
      <VendorAdminPageContent />
    </QueryClientProvider>
  );
};

export default VendorAdminPage;