import React, { useCallback, useEffect, useRef, useState } from 'react';
import './FundPage.css';
import Section from '../../components/Section';
import FundCard from '../../components/FundCard';
import SurveyBox from '../../components/SurveyBox';
import { useNavigate } from 'react-router-dom';

const FundPage = () => {

  const navigate = useNavigate();

  const [funds, setFunds] = useState([]); // ✅ 기본값 빈 배열
  const [visibleCount, setVisibleCount] = useState(4);
  const [isAdmin, setIsAdmin] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [fundsStatus, setFundsStatus] = useState('loading'); // loading | ready | error
  const [surveysStatus, setSurveysStatus] = useState('loading'); // loading | ready | error

  const observerRef = useRef();


  const loadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };


  // 펀딩 작성 버튼 클릭
  const handleWriteClick = () => {
    navigate("/funding/create/terms");
  }


  // 설문조사 작성 버튼 클릭 
  const handleSurveyWriteClick = () => {
    navigate("/survey/write")
  }

  // 펀딩 목록 로드: 실패와 빈 목록을 구분할 수 있도록 상태 분리
  const loadFunds = useCallback(async () => {
    setFundsStatus('loading');
    try {
      const res = await fetch("/api/fund/view");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log("🔥 받아온 펀딩 목록:", data);
      if (Array.isArray(data)) {
        setFunds(data);
      } else {
        console.error("🚨 응답이 배열이 아닙니다:", data);
        setFunds([]);
      }
      setFundsStatus('ready');
    } catch (err) {
      console.error("❌ 펀딩 목록 불러오기 실패:", err);
      setFunds([]);
      setFundsStatus('error');
    }
  }, []);

  useEffect(() => {
    loadFunds();
  }, [loadFunds]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, []);

  useEffect(() => {
    fetch("/api/auth/roleinfo", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.roleName === "ROLE_ADMIN") setIsAdmin(true);
      })
      .catch(err => console.error("권한 확인 실패", err));
  }, []);


  const loadSurveys = useCallback(async () => {
    setSurveysStatus('loading');
    try {
      const res = await fetch("/api/survey/view", { credentials: 'include' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log("🧪 설문 목록:", data);
      setSurveys(Array.isArray(data) ? data : []);
      setSurveysStatus('ready');
    } catch (err) {
      console.error("설문조사 목록 불러오기 실패", err);
      setSurveys([]);
      setSurveysStatus('error');
    }
  }, []);

  useEffect(() => {
    loadSurveys();
  }, [loadSurveys]);

  return (
    <Section>
      <div className="fund-page-wrapper">
        <div className='fund-header'>
          <h2 className="fund-title">펀딩</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="write-btn" onClick={handleWriteClick}>+ 펀딩 글쓰기</button>
            {isAdmin && (
              <button className="write-btn" onClick={handleSurveyWriteClick}>+ 설문조사 글쓰기</button>
            )}
          </div>
        </div>
        {/* 설문조사 목록 */}
        <div className="fund-surveys">
          {surveysStatus === 'loading' && (
            <p className="fund-page-status fund-page-status--loading">설문조사를 불러오는 중입니다...</p>
          )}
          {surveysStatus === 'error' && (
            <div className="fund-page-status fund-page-status--error" role="alert">
              <p>설문조사를 불러오지 못했습니다.</p>
              <button type="button" className="fund-page-retry-btn" onClick={loadSurveys}>다시 시도</button>
            </div>
          )}
          {surveysStatus === 'ready' && surveys.map((survey) => (
              <SurveyBox
                key={survey.surveyId}
                question={survey.title}
                options={survey.options}
                surveyId={survey.surveyId}
                voted={survey.voted}
                totalCount={survey.totalCount}
                setSurveys={setSurveys}
                surveys={surveys}
              />
            ))}
        </div>

        {/* 펀딩 카드 목록  */}
        <div className="fund-grid">
          {fundsStatus === 'loading' && (
            <div className="fund-page-status fund-page-status--loading">펀딩 목록을 불러오는 중입니다...</div>
          )}
          {fundsStatus === 'error' && (
            <div className="fund-page-status fund-page-status--error" role="alert">
              <p>펀딩 목록을 불러오지 못했습니다.</p>
              <button type="button" className="fund-page-retry-btn" onClick={loadFunds}>다시 시도</button>
            </div>
          )}
          {fundsStatus === 'ready' && Array.isArray(funds) && funds.length === 0 && (
            <div className="fund-page-status">진행 중인 펀딩이 없습니다.</div>
          )}
          {fundsStatus === 'ready' && Array.isArray(funds) &&
            funds.slice(0, visibleCount).map((fund) => {
              console.log("펀딩 항목:", fund);
              return <FundCard key={fund.id} fund={fund} />;
            })}
        </div>

        {/* 무한 스크롤 */}
        <div ref={observerRef} style={{ height: 1 }}></div>
      </div>
    </Section>
  );
};

export default FundPage;
