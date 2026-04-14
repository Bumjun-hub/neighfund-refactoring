import React, { useEffect, useState } from 'react';
import './AdminPage.css';
import FundAdminTab from './FundAdminTab';
import CommunityAdminTab from './CommunityAdminTab';
import SurveyAdminTab from './SurveyAdminTab';
import OrderAdminTab from './OrderAdminTab';
import GatheringAdminTab from './GatheringAdminTab';
import { httpClient } from '../../api/httpClient';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('fund'); // 현재 탭
  const [unapprovedFunds, setUnapprovedFunds] = useState([]);
  const [approvedFunds, setApprovedFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundMode, setFundMode] = useState('unapproved'); // 승인 or 미승인

  const [communityPosts, setCommunityPosts] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [orders, setOrders] = useState([]);

  const [funds, setFunds] = useState([]); // 전체 펀딩 목록
  const [selectedFundId, setSelectedFundId] = useState("");

  const [gatherings, setGatherings] = useState([]);
  // 탭별 조회 상태: 빈 목록과 조회 실패를 구분하기 위해 공통 상태 사용
  const [tabStatus, setTabStatus] = useState({
    fund: 'loading',
    community: 'loading',
    survey: 'loading',
    orders: 'ready',
    gathering: 'loading',
  });
  const [tabError, setTabError] = useState({
    fund: '',
    community: '',
    survey: '',
    orders: '',
    gathering: '',
  });

  const setTabLoading = (tabKey) => {
    setTabStatus((prev) => ({ ...prev, [tabKey]: 'loading' }));
    setTabError((prev) => ({ ...prev, [tabKey]: '' }));
  };

  const setTabReady = (tabKey) => {
    setTabStatus((prev) => ({ ...prev, [tabKey]: 'ready' }));
    setTabError((prev) => ({ ...prev, [tabKey]: '' }));
  };

  const setTabFail = (tabKey, message) => {
    setTabStatus((prev) => ({ ...prev, [tabKey]: 'error' }));
    setTabError((prev) => ({ ...prev, [tabKey]: message }));
  };

  // 관리자 인증
  useEffect(() => {
    httpClient.get("/api/auth/roleinfo")
      .then(data => {
        if (data.roleName !== "ROLE_ADMIN") {
          alert("관리자만 접근 가능합니다.");
          window.location.href = "/";
        }
      })
      .catch(() => {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      });
  }, []);

  useEffect(() => {
    fetchFunds();
    fetchCommunityPosts();
    fetchSurveys();
    fetchFundTitles();
    fetchGatherings();
  }, []);

  // 펀딩명 바뀌면 주문 목록 새로고침
  useEffect(() => {
    if (activeTab === 'orders' && selectedFundId) {
      fetchOrdersByFund(selectedFundId);
    }
  }, [selectedFundId, activeTab]);

  const fetchFunds = async () => {
    setTabLoading('fund');
    try {
      const [pendingData, approvedData] = await Promise.all([
        httpClient.get('/api/fund/admin/unapproved'),
        httpClient.get('/api/fund/view'),
      ]);
      setUnapprovedFunds(Array.isArray(pendingData) ? pendingData : []);
      setApprovedFunds(Array.isArray(approvedData) ? approvedData : []);
      setTabReady('fund');
    } catch (err) {
      console.error(err);
      setUnapprovedFunds([]);
      setApprovedFunds([]);
      setTabFail('fund', '펀딩 목록을 불러오지 못했습니다.');
    }
  };

  const fetchCommunityPosts = async () => {
    setTabLoading('community');
    try {
      const data = await httpClient.get('/api/community/view');
      setCommunityPosts(Array.isArray(data) ? data : []);
      setTabReady('community');
    } catch (err) {
      console.error(err);
      setCommunityPosts([]);
      setTabFail('community', '제안 게시판 데이터를 불러오지 못했습니다.');
    }
  };

  const fetchSurveys = async () => {
    setTabLoading('survey');
    try {
      const data = await httpClient.get("/api/survey/admin/view");
      setSurveys(Array.isArray(data) ? data : []);
      setTabReady('survey');
    } catch (err) {
      console.error(err);
      setSurveys([]);
      setTabFail('survey', '설문 목록을 불러오지 못했습니다.');
    }
  };

  const fetchFundTitles = async () => {
    try {
      const data = await httpClient.get("/api/fund/titles");
      setFunds(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setFunds([]);
    }
  };

  const fetchOrders = async () => {
    setTabLoading('orders');
    try {
      const data = await httpClient.get('/api/orders/admin/order');
      setOrders(Array.isArray(data) ? data : []);
      setTabReady('orders');
    } catch (err) {
      console.error(err);
      setOrders([]);
      setTabFail('orders', '주문 목록을 불러오지 못했습니다.');
    }
  };

  const fetchOrdersByFund = async (fundId) => {
    setTabLoading('orders');
    try {
      const data = await httpClient.get(`/api/orders/admin/byFund/${fundId}`);
      setOrders(Array.isArray(data) ? data : []);
      setTabReady('orders');
    } catch (err) {
      console.error(err);
      setOrders([]);
      setTabFail('orders', '선택한 펀딩의 주문 목록을 불러오지 못했습니다.');
    }
  };

  const handleSelectFund = async (fund) => {
    setSelectedFund(null);
    const endpoint = fundMode === 'unapproved'
      ? `/api/fund/admin/unapproved/${fund.id}`
      : `/api/fund/view/${fund.id}`;
    const data = await httpClient.get(endpoint);
    setSelectedFund(data);
  };

  const handleApprove = async (fundId) => {
    await httpClient.put(`/api/fund/admin/approve/${fundId}`);
    alert('승인 완료!');
    await fetchFunds();
    setSelectedFund(null);
  };

  const handleCommunityStatusChange = async (id, newStatus) => {
    await httpClient.put(`/api/community/admin/edit/${id}`, { status: newStatus });
    fetchCommunityPosts();
  };

  const handleSurveyVisibleChange = async (id, newVisible) => {
    await httpClient.put(`/api/survey/admin/status/${id}?visible=${newVisible}`);
    fetchSurveys();
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    await httpClient.put(`/api/orders/admin/${orderId}/status?status=${newStatus}`);
    fetchOrders();
  };

  const handleGatheringDelete = async (id) => {
    if (!window.confirm("정말 이 소모임을 삭제할까요?")) return;
    await httpClient.delete(`/api/gatherings/free/delete/${id}`);
    alert('소모임이 삭제되었습니다!');
    // 삭제 후 소모임 목록 다시 불러오기
    fetchGatherings();
  };

  const fetchGatherings = async () => {
    setTabLoading('gathering');
    try {
      const data = await httpClient.get('/api/gatherings/free/list');
      setGatherings(Array.isArray(data) ? data : []);
      setTabReady('gathering');
    } catch (err) {
      console.error(err);
      setGatherings([]);
      setTabFail('gathering', '소모임 목록을 불러오지 못했습니다.');
    }
  };

  const getRetryHandler = () => {
    if (activeTab === 'fund') return fetchFunds;
    if (activeTab === 'community') return fetchCommunityPosts;
    if (activeTab === 'survey') return fetchSurveys;
    if (activeTab === 'orders') return selectedFundId ? () => fetchOrdersByFund(selectedFundId) : fetchOrders;
    if (activeTab === 'gathering') return fetchGatherings;
    return null;
  };

  const retryHandler = getRetryHandler();
  const isActiveTabLoading = tabStatus[activeTab] === 'loading';
  const isActiveTabError = tabStatus[activeTab] === 'error';


  return (
    <div className="fund-admin">
      <h2>🔧 관리자 페이지</h2>

      <div className="admin-tabs">
        <button className={activeTab === 'fund' ? 'active' : ''} onClick={() => setActiveTab('fund')}>💰 펀딩 관리</button>
        <button className={activeTab === 'community' ? 'active' : ''} onClick={() => setActiveTab('community')}>🗂 제안 게시판</button>
        <button className={activeTab === 'survey' ? 'active' : ''} onClick={() => setActiveTab('survey')}>📊 설문관리</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => { setActiveTab('orders'); fetchOrders(); }}>📦 주문 관리</button>
        <button className={activeTab === 'gathering' ? 'active' : ''} onClick={() => setActiveTab('gathering')}>👥 소모임 관리</button>
        {activeTab === 'orders' && (
          <select value={selectedFundId} onChange={(e) => setSelectedFundId(e.target.value)}>
            <option value="">펀딩 선택</option>
            {funds.map(fund => (
              <option key={fund.id} value={fund.id}>{fund.title}</option>
            ))}
          </select>
        )}
      </div>

      {isActiveTabLoading && (
        <div className="admin-status admin-status--loading" role="status">
          데이터를 불러오는 중입니다...
        </div>
      )}

      {isActiveTabError && (
        <div className="admin-status admin-status--error" role="alert">
          <p>{tabError[activeTab] || '데이터를 불러오지 못했습니다.'}</p>
          {retryHandler && (
            <button type="button" className="admin-retry-btn" onClick={retryHandler}>
              다시 시도
            </button>
          )}
        </div>
      )}

      {/* 탭별 렌더링 */}
      {activeTab === 'fund' && !isActiveTabLoading && !isActiveTabError && (
        <FundAdminTab
          fundMode={fundMode}
          setFundMode={setFundMode}
          selectedFund={selectedFund}
          setSelectedFund={setSelectedFund}
          handleSelectFund={handleSelectFund}
          handleApprove={handleApprove}
          unapprovedFunds={unapprovedFunds} // ✅ 추가
          approvedFunds={approvedFunds}     // ✅ 추가
        />

      )}

      {activeTab === 'community' && !isActiveTabLoading && !isActiveTabError && (
        <CommunityAdminTab
          communityPosts={communityPosts}
          handleCommunityStatusChange={handleCommunityStatusChange}
        />
      )}

      {activeTab === 'survey' && !isActiveTabLoading && !isActiveTabError && (
        <SurveyAdminTab
          surveys={surveys}
          handleSurveyVisibleChange={handleSurveyVisibleChange}
        />
      )}

      {activeTab === 'orders' && !isActiveTabLoading && !isActiveTabError && (
        <OrderAdminTab
          orders={orders}
          selectedFundId={selectedFundId} // ✅ 추가
          handleOrderStatusChange={handleOrderStatusChange}
        />
      )}
      {activeTab === 'gathering' && !isActiveTabLoading && !isActiveTabError && (
        <GatheringAdminTab
          gatherings={gatherings}
          onDelete={handleGatheringDelete}
        />
      )}
    </div>
  );
};

export default AdminPage;
