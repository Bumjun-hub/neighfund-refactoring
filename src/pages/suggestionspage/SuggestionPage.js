import { useCallback, useEffect, useState } from 'react';
import './SuggestionPage.css';
import { useNavigate } from "react-router-dom";
import Section from "../../components/Section";
import SuggestionAPI from './SuggestionAPI';
import SuggestionPageHeader from './components/SuggestionPageHeader';
import SuggestionListSection from './components/SuggestionListSection';

const SuggestionPage = () => {
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [sortType, setSortType] = useState('최신순');
  const [suggestions, setSuggestions] = useState([]);
  // 제안 목록 조회: 로딩/실패/빈목록을 분리해서 사용자에게 명확히 안내
  const [fetchStatus, setFetchStatus] = useState('loading'); // loading | ready | error
  const navigate = useNavigate();

  const loadSuggestions = useCallback(async () => {
    setFetchStatus('loading');
    try {
      const data = await SuggestionAPI.getAllSuggestions();
      setSuggestions(Array.isArray(data) ? data : []);
      setFetchStatus('ready');
    } catch (err) {
      console.error("제안글 불러오기 실패:", err);
      setSuggestions([]);
      setFetchStatus('error');
    }
  }, []);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  const filtered = suggestions
    .filter((item) =>
      categoryFilter === '전체' ? true : item.category === categoryFilter
    )
    .sort((a, b) => {
      if (sortType === '공감순') return b.likes - a.likes;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const handleLike = async (id) => {
    try {
      const { liked, likeCount } = await SuggestionAPI.toggleLike(id);
      setSuggestions(prev =>
        prev.map(item => {
          if (item.id === id) {
            return { ...item, liked, likes: likeCount };
          }
          return item;
        })
      );
    } catch (err) {
      console.error("공감 실패:", err);
      alert("공감 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <Section>
      <div className="suggestion-wrapper">
        <SuggestionPageHeader
          sortType={sortType}
          categoryFilter={categoryFilter}
          onSortTypeChange={setSortType}
          onCategoryFilterChange={setCategoryFilter}
          onWrite={() => navigate('/suggestion/write')}
        />

        <SuggestionListSection
          fetchStatus={fetchStatus}
          filtered={filtered}
          onRetry={loadSuggestions}
          onEdit={(id) => navigate(`/suggestion/write/${id}`)}
          onLike={handleLike}
        />
      </div>
    </Section>
  );
};

export default SuggestionPage;
