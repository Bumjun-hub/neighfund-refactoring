import React, { useEffect, useState } from 'react';
import './SurveyBox.css';
import { authenticatedFetch } from '../utils/authUtils';

const SurveyBox = ({ question, options, surveyId, voted, showResult, totalCount, surveys, setSurveys }) => {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState([]);
  const [totalVotes, setTotalVotes] = useState(totalCount || 0);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState('');

  // 이미 투표한 경우 표시
  useEffect(() => {
    if (voted) {
      setSelected(options.findIndex(opt => opt.selected));
      const total = options.reduce((sum, opt) => sum + opt.voteCount, 0);
      const percentages = options.map(opt =>
        total === 0 ? 0 : Math.round((opt.voteCount / total) * 100)
      );
      setResult(percentages);
      setTotalVotes(total);
    }
  }, [voted, options]);

  const handleVote = async (optionIndex) => {
    if (isVoting || selected !== null || voted) return;
    setVoteError('');
    setIsVoting(true);
    try {
      const res = await authenticatedFetch(`/api/survey/${surveyId}/vote?optionId=${options[optionIndex].optionId}`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json(); // { options: [...], totalParticipants }

        setSelected(optionIndex);

        // 🔥 백엔드에서 온 options에서 percentage 꺼내기
        const percentages = data.options.map(opt => opt.percentage);

        setResult(percentages);
        setTotalVotes(data.totalParticipants);

        const updated = surveys.map(s => {
          if (s.surveyId !== surveyId) return s;

          const updatedOptions = data.options.map((opt, idx) => ({
            ...opt,
            selected: idx === optionIndex
          }));

          return {
            ...s,
            voted: true,
            totalCount: data.totalParticipants,
            options: updatedOptions
          };
        });

        setSurveys(updated);
      }
      else {
        const msg = await res.text();
        setVoteError('투표에 실패했습니다. 다시 시도해주세요.');
        alert('투표 실패: ' + msg);
      }

    } catch (err) {
      console.error("투표 요청 오류", err);
      setVoteError('투표 요청 중 오류가 발생했습니다.');
      alert("서버 오류 발생");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="survey-box">
      <p className="survey-question">{question}</p>
      <div className="survey-options">
        {options.map((option, index) => (
          <div
            key={index}
            className={`survey-option ${selected === index ? 'selected' : ''} ${isVoting ? 'survey-option-disabled' : ''}`}
            onClick={() => {
              if (selected === null && !voted) handleVote(index);
            }}
          >
            <span>{option.content}</span>
            {(voted || result.length > 0 || showResult) && result[index] !== undefined && (
              <div className="vote-bar-container">
                <div
                  className="vote-bar"
                  style={{ width: `${result[index]}%` }}
                ></div>
                <span className="vote-percent">{result[index]}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {voteError && (
        <p className="survey-vote-error" role="alert">{voteError}</p>
      )}
      {isVoting && (
        <p className="survey-voting-status" role="status">투표 처리 중...</p>
      )}
      {(voted || result.length > 0) && (
        <p style={{ fontSize: '13px', textAlign: 'right' }}>
          총 참여자 수: {totalVotes}명
        </p>
      )}
    </div>
  );
};

export default SurveyBox;
