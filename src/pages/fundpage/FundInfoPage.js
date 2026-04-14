import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import './FundInfoPage.css';
import './Modal.css';
import Section from '../../components/Section';
import { deleteFund, getFundDetail, getMyOrderList, getRoleInfo } from './fundApi';
import FundFetchStatusView from './components/FundFetchStatusView';
import FundInfoTopSection from './components/FundInfoTopSection';
import FundTabs from './components/FundTabs';
import FundTabContent from './components/FundTabContent';
import FundRewardPanel from './components/FundRewardPanel';
import FundParticipateModal from './components/FundParticipateModal';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const fundInfoQueryClient = new QueryClient();

const FundInfoPageContent = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('intro');
    const [selectedReward, setSelectedReward] = useState(null);
    const [showModal, setShowModal] = useState(false); //  모달 제어용
    const navigate = useNavigate();

    const fundQuery = useQuery({
        queryKey: ['fundInfo', 'detail', id],
        queryFn: async () => {
            if (!id) return null;
            const data = await getFundDetail(id);
            if (data == null || typeof data !== 'object') return null;
            return data;
        },
        retry: false,
    });

    const myOrdersQuery = useQuery({
        queryKey: ['fundInfo', 'myOrders'],
        queryFn: async () => {
            const data = await getMyOrderList();
            const list = Array.isArray(data) ? data : [];
            return list.map((order) => order.optionId);
        },
        retry: false,
    });

    const roleInfoQuery = useQuery({
        queryKey: ['fundInfo', 'roleInfo'],
        queryFn: getRoleInfo,
        retry: false,
    });

    const fund = fundQuery.data;
    const isAdmin = roleInfoQuery.data?.roleName === "ROLE_ADMIN";
    const myOrderOptionIds = myOrdersQuery.data || [];
    const ordersFetchError = myOrdersQuery.isError ? "신청한 리워드 정보를 불러오지 못했습니다." : null;
    const isClosed = fund && new Date(fund.deadline) < new Date();

    //  리워드 선택
    const handleSelectReward = (opt) => {
        if (myOrderOptionIds.includes(opt.id)) {
            alert("이미 신청한 리워드입니다.");
            return;
        }
        setSelectedReward((prev) => (prev?.id === opt.id ? null : opt));
    };

    // 참여 버튼 클릭 → 로그인 체크 후 모달 열기
    const handleParticipateClick = async () => {
        if (!selectedReward) {
            alert("리워드를 선택해주세요!");
            return;
        }

        try {
            await getRoleInfo();
            setShowModal(true); //  창 대신 모달 열기
        } catch (error) {
            if (error?.status === 401) {
                alert("로그인이 필요한 기능입니다.");
                window.location.href = "/login";
                return;
            }
            alert("서버 오류가 발생했습니다.");
            console.error("참여 버튼 오류:", error);
        }
    };


    // ✅ 삭제 처리 함수
    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const token = localStorage.getItem("accessToken");
            await deleteFund(id, token);

            alert("삭제가 완료되었습니다.");
            navigate("/funding"); // 목록 페이지로 이동
        } catch (err) {
            alert("삭제 중 오류가 발생했습니다.");
            console.error("❌ 삭제 오류:", err);
        }
    };


    if (fundQuery.isLoading || fundQuery.isFetching) {
        return <FundFetchStatusView status="loading" onRetry={fundQuery.refetch} />;
    }

    if (fundQuery.isError) {
        if (fundQuery.error?.status === 404) {
            return <FundFetchStatusView status="notFound" onRetry={fundQuery.refetch} />;
        }
        return <FundFetchStatusView status="error" onRetry={fundQuery.refetch} />;
    }

    if (!fund) {
        return <FundFetchStatusView status="notFound" onRetry={fundQuery.refetch} />;
    }

    return (
        <Section>
            <div className="fund-info-wrapper">
                <h2 className="fund-title">{fund.title}
                    {isAdmin && (
                        <button className="delete-btn" onClick={handleDelete}>
                            🗑️ 삭제
                        </button>
                    )}
                </h2>
                {ordersFetchError && (
                    <p className="fund-orders-warning" role="status">{ordersFetchError}</p>
                )}
                <FundInfoTopSection fund={fund} />

                <FundTabs activeTab={activeTab} onChangeTab={setActiveTab} />

                <div className="fund-info-layout">
                    <div className="fund-info-content">
                        <FundTabContent activeTab={activeTab} fund={fund} />
                    </div>

                    <FundRewardPanel
                        options={fund.options}
                        isClosed={isClosed}
                        myOrderOptionIds={myOrderOptionIds}
                        selectedReward={selectedReward}
                        onSelectReward={handleSelectReward}
                        onParticipate={handleParticipateClick}
                    />
                </div>
            </div>

            <FundParticipateModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                fund={fund}
                selectedReward={selectedReward}
            />
        </Section>
    );
};

const FundInfoPage = () => {
    return (
        <QueryClientProvider client={fundInfoQueryClient}>
            <FundInfoPageContent />
        </QueryClientProvider>
    );
};

export default FundInfoPage;
