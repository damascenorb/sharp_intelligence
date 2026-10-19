import React from 'react';
import { PainAnalyzerAI } from './PainAnalyzerAI';

export const BusinessHealthCheck: React.FC<{ onGoToCalendarWithData: (data: any) => void }> = ({ onGoToCalendarWithData }) => {
  return (
    <div className="max-w-[1000px] mx-auto animate-fadeIn pb-12">
      <PainAnalyzerAI 
        onGoToCalendar={() => onGoToCalendarWithData({})} 
        initialMode="ai"
      />
    </div>
  );
};
