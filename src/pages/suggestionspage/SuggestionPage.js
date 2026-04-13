import { useCallback, useEffect, useState } from 'react';
import './SuggestionPage.css';
import { useNavigate } from "react-router-dom";
import Section from "../../components/Section";
import SuggestionAPI from './SuggestionAPI';
import SuggestionCard from "../../components/SuggestionCard"; // 추가

const categoryMap = {
  EDUCATION: '교육', ENVIRONMENT: '환경', CULTURE: '문화', PET: '애완동물',
  SPORTS: '운동', FOOD: '음식', HOBBY: '취미', WELFARE: '복지', ETC: '기타',
};

const status = {
  FUNDED: '펀딩 완료', ON_HOLD: '보류 중', RECRUITING: '공감하기'
};

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
        <div className="suggestion-header">
          <div className="suggestion-title">
            <h2>제안</h2>
          </div>
          <div className="filters">
            <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
              <option value="최신순">최신순</option>
              <option value="공감순">공감순</option>
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="전체">전체</option>
              {Object.keys(categoryMap).map((key) => (
                <option key={key} value={key}>{categoryMap[key]}</option>
              ))}
            </select>
            <button
              className="suggestion-write-button"
              onClick={() => navigate('/suggestion/write')}
            >
              제안 글쓰기
            </button>
          </div>
        </div>
        <div className="suggestion-list">
          {fetchStatus === 'loading' && (
            <div className="suggestion-status suggestion-status--loading" role="status">
              제안글을 불러오는 중입니다...
            </div>
          )}

          {fetchStatus === 'error' && (
            <div className="suggestion-status suggestion-status--error" role="alert">
              <p>제안글을 불러오지 못했습니다.</p>
              <button type="button" className="suggestion-retry-btn" onClick={loadSuggestions}>
                다시 시도
              </button>
            </div>
          )}

          {fetchStatus === 'ready' && filtered.length === 0 && (
            <div className="suggestion-status">등록된 제안글이 없습니다.</div>
          )}

          {fetchStatus === 'ready' && filtered.map((item) => (
              <SuggestionCard
                key={item.id}
                post={item}
                size="large"
                onEdit={() => navigate(`/suggestion/write/${item.id}`)}
                onLike={() => handleLike(item.id)}
              />
            ))}
        </div>
      </div>
    </Section>
  );
};

export default SuggestionPage;
