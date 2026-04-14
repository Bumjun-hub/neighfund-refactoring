import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gatheringApi from './GatheringAPI'; // 기존 API 경로 사용
import './GatheringInfo.css';
import GatheringInfoStateView from './components/GatheringInfoStateView';
import GatheringOwnerMenu from './components/GatheringOwnerMenu';
import GatheringInfoHeader from './components/GatheringInfoHeader';
import GatheringInfoStats from './components/GatheringInfoStats';
import GatheringTabMenu from './components/GatheringTabMenu';
import GatheringTabContent from './components/GatheringTabContent';
import GatheringInfoActions from './components/GatheringInfoActions';
import {
  formatGatheringDate,
  getGatheringCategoryColor,
  getGatheringCategoryText,
} from './components/gatheringInfoFormatters';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const gatheringInfoQueryClient = new QueryClient();

const GatheringInfoContent = () => {
  const { gatheringId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('intro');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const gatheringQuery = useQuery({
    queryKey: ['gatheringInfo', 'detail', gatheringId],
    queryFn: async () => {
      const data = await gatheringApi.getGatheringDetail(gatheringId);
      return data ?? null;
    },
    enabled: Boolean(gatheringId),
    retry: false,
  });

  const gathering = gatheringQuery.data;
  const isMember = gathering?.isMember || false;
  const members = Array.isArray(gathering?.members) ? gathering.members : [];

  const handleLike = async () => {
    // 좋아요 기능 구현 
  };

  const handleJoin = () => {
    // 참여하기 버튼 클릭시 GatheringJoin 페이지로 이동
    navigate(`/gatherings/${gatheringId}/join`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = () => {
    // 수정 페이지로 이동 - 기존 데이터를 state로 전달
    navigate('/GatheringCreate', {
      state: {
        isEdit: true,
        gatheringId: gatheringId,
        gatheringData: {
          title: gathering.title,
          category: gathering.category,
          dongName: gathering.dongName,
          content: gathering.content,
          titleImage: gathering.titleImage,
          type: 'FREE'
        }
      }
    });
    setIsMenuOpen(false);
  };

  // 외부 클릭 시 메뉴 닫기
useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  const handleDelete = async () => {
    if (window.confirm('정말로 이 소모임을 삭제하시겠습니까?')) {
      try {
        await gatheringApi.deleteGathering(gatheringId);
        alert('소모임이 삭제되었습니다.');
        navigate('/gathering'); 
      } catch (error) {
        console.error('Delete error:', error);
        alert('삭제하는데 실패했습니다. 다시 시도해주세요.');
      }
    }
    setIsMenuOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (gatheringQuery.isLoading || gatheringQuery.isFetching) {
    return <GatheringInfoStateView type="loading" />;
  }

  if (gatheringQuery.isError) {
    return <GatheringInfoStateView type="error" message="소모임 정보를 불러오는데 실패했습니다." />;
  }

  if (!gathering) {
    return <GatheringInfoStateView type="error" message="소모임 정보를 찾을 수 없습니다." />;
  }
  
  return (
    <div className="gathering-info-container">
      <div className="gathering-info-content">
        <GatheringOwnerMenu
          menuRef={menuRef}
          isMenuOpen={isMenuOpen}
          onToggleMenu={toggleMenu}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <GatheringInfoHeader
          gathering={gathering}
          categoryColor={getGatheringCategoryColor(gathering.category)}
          categoryText={getGatheringCategoryText(gathering.category)}
        />

        <div className="gathering-info-body">
          <GatheringInfoStats
            memberCount={gathering.memberCount}
            likes={gathering.likes}
            createdAt={formatGatheringDate(gathering.createdAt)}
          />

          <div className="gathering-tabs">
            <GatheringTabMenu
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              memberCount={members.length}
              isMember={isMember}
            />

            <GatheringTabContent
              activeTab={activeTab}
              gathering={gathering}
              members={members}
              isMember={isMember}
              gatheringId={gatheringId}
              onJoin={handleJoin}
              formatDate={formatGatheringDate}
            />
          </div>

          <GatheringInfoActions
            liked={gathering.liked}
            likes={gathering.likes}
            isMember={isMember}
            onLike={handleLike}
            onJoin={handleJoin}
          />

          <div className="update-info">
            {gathering.updatedAt && gathering.updatedAt !== gathering.createdAt && (
              <p className="last-updated">
                마지막 수정: {formatGatheringDate(gathering.updatedAt)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GatheringInfo = () => {
  return (
    <QueryClientProvider client={gatheringInfoQueryClient}>
      <GatheringInfoContent />
    </QueryClientProvider>
  );
};

export default GatheringInfo;