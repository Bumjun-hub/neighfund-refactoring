import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VendorGatheringDetail from './VendorGatheringDetail';
import './ClassListPage.css';
import { getVendorClassList } from './vendorGatheringApi';
import { getVendorCategoryInKorean } from './components/vendorGatheringDetailFormatters';
import ClassListStatusView from './components/ClassListStatusView';
import ClassListHeader from './components/ClassListHeader';
import ClassListFilters from './components/ClassListFilters';
import VendorClassCard from './components/VendorClassCard';

const ClassListPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  // 클래스 목록: 실패와 빈 목록을 구분하기 위한 에러 상태
  const [fetchError, setFetchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');

  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 classId 파라미터 확인
  const isDetailView = location.pathname.includes('/class/');
  const classIdFromUrl = isDetailView ? location.pathname.split('/class/')[1] : null;

  // 클래스 개설 페이지로 이동
  const handleCreateClass = () => {
    navigate('/classcreationpage');
  };

  // 관리자 페이지로 이동
  const handleGoToAdmin = () => {
    navigate('/VendorAdminPage');
  };

  // 승인된 원데이 클래스 목록 가져오기
  const fetchApprovedClasses = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await getVendorClassList();
      
      // confirmed가 true인 승인된 클래스만 필터링하고 한글 카테고리 추가
      const approvedClasses = Array.isArray(data) ? 
        data.filter(cls => cls.confirmed === true).map(cls => ({
          ...cls,
          categoryKorean: getVendorCategoryInKorean(cls.category)
        })) : [];
      
      setClasses(approvedClasses);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      setClasses([]);
      setFetchError('클래스 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 상세보기 열기 - URL 변경
  const handleCardClick = (classId) => {
    navigate(`/classlistpage/class/${classId}`);
  };

  // 상세보기에서 목록으로 돌아가기 - URL 변경
  const handleBackToList = () => {
    navigate('/classlistpage');
  };

  useEffect(() => {
    fetchApprovedClasses();
  }, []);

  // URL이 상세보기 경로일 때 VendorGatheringDetail 컴포넌트 렌더링
  if (isDetailView && classIdFromUrl) {
    return (
      <VendorGatheringDetail 
        gatheringId={parseInt(classIdFromUrl)}
        onBack={handleBackToList}
      />
    );
  }

  // 필터링된 클래스 목록
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = (cls.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || cls.category === categoryFilter;
    const matchesLocation = locationFilter === 'ALL' || (cls.dongName || '').includes(locationFilter);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // 카테고리 목록 추출 (영어 원본을 키로, 한글을 값으로 하는 고유 카테고리)
  const uniqueCategories = [...new Set(classes.map(cls => cls.category).filter(Boolean))];
  const categories = uniqueCategories.map(category => ({
    value: category,
    label: getVendorCategoryInKorean(category)
  }));

  const locations = [...new Set(classes.map(cls => cls.dongName).filter(Boolean))];

  if (loading) {
    return <ClassListStatusView type="loading" />;
  }

  if (fetchError && classes.length === 0) {
    return <ClassListStatusView type="error" message={fetchError} onRetry={fetchApprovedClasses} />;
  }

  return (
    <div className="class-list-page">
      <ClassListHeader onCreateClass={handleCreateClass} onGoToAdmin={handleGoToAdmin} />

      <ClassListFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        locationFilter={locationFilter}
        onLocationFilterChange={setLocationFilter}
        categories={categories}
        locations={locations}
      />

      {/* 클래스 목록 */}
      <div className="class-grid">
        {filteredClasses.length > 0 ? (
          filteredClasses.map(cls => (
            <VendorClassCard
              key={cls.id} 
              classData={cls} 
              onCardClick={() => handleCardClick(cls.id)}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>조건에 맞는 클래스가 없습니다.</p>
            <p>전체 클래스 수: {classes.length}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassListPage;