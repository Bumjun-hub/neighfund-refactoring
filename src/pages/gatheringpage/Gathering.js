import React, { useState, useEffect, useMemo, useCallback } from 'react';
import GatheringAPI from './GatheringAPI';
import GatheringSearchFilter from './GatheringSearchFilter'; // 새로 만든 컴포넌트
import './Gathering.css';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus } from '../../utils/authUtils';
import GatheringCreateButton from './components/GatheringCreateButton';
import GatheringColumn from './components/GatheringColumn';
import GatheringErrorState from './components/GatheringErrorState';
import GatheringResultStates from './components/GatheringResultStates';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';

const gatheringQueryClient = new QueryClient();

const GatheringContent = () => {
  const [hasMore, setHasMore] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태
  const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리 상태
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const gatheringsQuery = useQuery({
    queryKey: ['gathering', 'list'],
    queryFn: async () => {
      const data = await GatheringAPI.getGatheringList();
      return Array.isArray(data) ? data : [];
    },
    retry: false,
  });
  const gatherings = gatheringsQuery.data || [];
  const isLoading = gatheringsQuery.isLoading || gatheringsQuery.isFetching;
  const error = gatheringsQuery.isError
    ? '소모임 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
    : null;

  const handleCreateGathering = async () => {
    try {
        console.log('🔍 소모임 만들기 버튼 클릭 - 인증 체크 시작');
        
        // 인증 상태 확인
        const authResult = await checkAuthStatus();
        
        if (authResult.isAuthenticated) {
            console.log('✅ 인증 성공 - 소모임 만들기 페이지로 이동');
            window.location.href = '/GatheringCreate';
        } else {
            console.log('❌ 인증 실패 - 로그인 페이지로 이동');
            alert('로그인이 필요한 서비스입니다.');
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('💥 소모임 만들기 버튼 오류:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const filteredGatherings = useMemo(() => {
    let filtered = [...gatherings];

    if (searchKeyword && searchKeyword.trim()) {
      const searchTerm = searchKeyword.toLowerCase().trim();
      filtered = filtered.filter((gathering) =>
        gathering.title.toLowerCase().includes(searchTerm) ||
        gathering.content.toLowerCase().includes(searchTerm) ||
        gathering.dongName.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((gathering) => gathering.category === selectedCategory);
    }

    console.log(`🔍 필터 적용 완료: ${filtered.length}개 결과`);
    return filtered;
  }, [gatherings, searchKeyword, selectedCategory]);

  useEffect(() => {
    if (gatheringsQuery.isError) {
      setHasMore(false);
      return;
    }
    setHasMore(gatherings.length >= 10);
  }, [gatherings, gatheringsQuery.isError]);

  const loadMoreData = useCallback(() => {
    setHasMore(false);
  }, []);

  // 컴포넌트 마운트 시 스크롤 위치 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= 
          document.documentElement.offsetHeight - 1800) { 
        loadMoreData();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreData]);

  // 좋아요 기능 (현재는 로컬 상태만 업데이트)
  const handleLike = (id) => {
    queryClient.setQueryData(['gathering', 'list'], (prev = []) =>
      prev.map((gathering) =>
        gathering.id === id 
          ? { 
              ...gathering, 
              likes: gathering.liked ? gathering.likes - 1 : gathering.likes + 1,
              liked: !gathering.liked 
            }
          : gathering
      )
    );
    
    // TODO: 실제 좋아요 API 호출
    // await GatheringAPI.likeGathering(id);
  };

  // 소모임 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (gatheringId) => {
    navigate(`/gatherings/${gatheringId}`);
    console.log('소모임 상세 페이지로 이동:', gatheringId);
  };

  // 에러 상태 렌더링 (401 에러는 제외)
  if (error && gatherings.length === 0) {
    return <GatheringErrorState error={error} onRetry={gatheringsQuery.refetch} />;
  }

  // 표시할 데이터 결정 (필터링된 결과 사용)
  const displayGatherings = filteredGatherings;
  
  // 왼쪽 컬럼에 표시할 카드들 (짝수 인덱스)
  const leftColumnCards = displayGatherings.filter((_, index) => index % 2 === 0);
  
  // 오른쪽 컬럼에 표시할 카드들 (홀수 인덱스)
  const rightColumnCards = displayGatherings.filter((_, index) => index % 2 === 1);

  return (
    <div className="gathering-container">
      {/* 검색 및 필터 컴포넌트 추가 */}
      <GatheringSearchFilter
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        selectedCategory={selectedCategory}
        searchKeyword={searchKeyword}
      />
      <div className="gathering-grid">
        <GatheringColumn
          className="left-column"
          cards={leftColumnCards}
          onCardClick={handleCardClick}
          onLike={handleLike}
          renderHeader={() => <GatheringCreateButton onCreate={handleCreateGathering} />}
        />

        <GatheringColumn
          className="right-column"
          cards={rightColumnCards}
          onCardClick={handleCardClick}
          onLike={handleLike}
        />
      </div>

      <GatheringResultStates
        searchKeyword={searchKeyword}
        selectedCategory={selectedCategory}
        displayCount={displayGatherings.length}
        isLoading={isLoading}
        hasMore={hasMore}
        totalGatheringCount={gatherings.length}
        hasError={Boolean(error)}
      />
    </div>
  );
};

const Gathering = () => {
  return (
    <QueryClientProvider client={gatheringQueryClient}>
      <GatheringContent />
    </QueryClientProvider>
  );
};

export default Gathering;