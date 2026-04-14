import React, { useCallback, useEffect, useRef, useState } from 'react';
import './FundPage.css';
import Section from '../../components/Section';
import { useNavigate } from 'react-router-dom';
import { getFundList, getRoleInfo, getSurveyList } from './fundApi';
import FundPageHeader from './components/FundPageHeader';
import FundSurveySection from './components/FundSurveySection';
import FundGridSection from './components/FundGridSection';

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
      const data = await getFundList();
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
    getRoleInfo()
      .then(data => {
        if (data.roleName === "ROLE_ADMIN") setIsAdmin(true);
      })
      .catch(err => console.error("권한 확인 실패", err));
  }, []);


  const loadSurveys = useCallback(async () => {
    setSurveysStatus('loading');
    try {
      const data = await getSurveyList();
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
        <FundPageHeader
          isAdmin={isAdmin}
          onWriteClick={handleWriteClick}
          onSurveyWriteClick={handleSurveyWriteClick}
        />

        <FundSurveySection
          surveysStatus={surveysStatus}
          surveys={surveys}
          setSurveys={setSurveys}
          onRetry={loadSurveys}
        />

        <FundGridSection
          fundsStatus={fundsStatus}
          funds={funds}
          visibleCount={visibleCount}
          onRetry={loadFunds}
        />

        <div ref={observerRef} style={{ height: 1 }}></div>
      </div>
    </Section>
  );
};

export default FundPage;
