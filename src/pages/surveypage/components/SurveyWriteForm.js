import React from 'react';

const SurveyWriteForm = ({
  question,
  options,
  isSubmitting,
  onQuestionChange,
  onOptionChange,
  onRemoveOption,
  onAddOption,
  onSubmit,
}) => {
  return (
    <div className="survey-write-wrapper">
      <h2>설문조사 글쓰기</h2>
      <form onSubmit={onSubmit}>
        <label>질문</label>
        <input type="text" value={question} onChange={(e) => onQuestionChange(e.target.value)} required />

        <label>옵션</label>
        {options.map((opt, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <input
              type="text"
              value={opt}
              onChange={(e) => onOptionChange(i, e.target.value)}
              required
            />
            {options.length > 2 && (
              <button type="button" onClick={() => onRemoveOption(i)}>
                삭제
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={onAddOption} disabled={isSubmitting}>
          옵션 추가
        </button>

        <br />
        <br />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '등록 중...' : '등록'}
        </button>
      </form>
    </div>
  );
};

export default SurveyWriteForm;
