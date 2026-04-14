import React from 'react';
import SurveyBox from '../../../components/SurveyBox';

const FundSurveySection = ({ surveysStatus, surveys, setSurveys, onRetry }) => {
  return (
    <div className="fund-surveys">
      {surveysStatus === 'loading' && (
        <p className="fund-page-status fund-page-status--loading">설문조사를 불러오는 중입니다...</p>
      )}
      {surveysStatus === 'error' && (
        <div className="fund-page-status fund-page-status--error" role="alert">
          <p>설문조사를 불러오지 못했습니다.</p>
          <button type="button" className="fund-page-retry-btn" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      )}
      {surveysStatus === 'ready' &&
        surveys.map((survey) => (
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
  );
};

export default FundSurveySection;
