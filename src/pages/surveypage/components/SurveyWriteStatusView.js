import React from 'react';
import Section from '../../../components/Section';

const SurveyWriteStatusView = ({ message }) => {
  return (
    <Section>
      <div className="survey-write-status">{message}</div>
    </Section>
  );
};

export default SurveyWriteStatusView;
