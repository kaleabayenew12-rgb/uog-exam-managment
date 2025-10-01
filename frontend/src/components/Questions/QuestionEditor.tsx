import React from 'react';
import { Question } from '../../types';
import { MCQEditor } from './MCQEditor';
import { TrueFalseEditor } from './TrueFalseEditor';
import { ShortAnswerEditor } from './ShortAnswerEditor';
import { FillBlankEditor } from './FillBlankEditor';
import { MatchingEditor } from './MatchingEditor';
import { EssayEditor } from './EssayEditor';
import { CodeEditor } from './CodeEditor';
import { DiagramEditor } from './DiagramEditor';
import { CombinedQuestionEditor } from './CombinedQuestionEditor';

interface QuestionEditorProps {
  question: Partial<Question>;
  onChange: (question: Partial<Question>) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onChange }) => {
  const getEditor = () => {
    switch (question.type) {
      case 'mcq':
        return <MCQEditor question={question} onChange={onChange} />;
      case 'tf':
        return <TrueFalseEditor question={question} onChange={onChange} />;
      case 'short':
        return <ShortAnswerEditor question={question} onChange={onChange} />;
      case 'fill':
        return <FillBlankEditor question={question} onChange={onChange} />;
      case 'matching':
        return <MatchingEditor question={question} onChange={onChange} />;
      case 'essay':
        return <EssayEditor question={question} onChange={onChange} />;
      case 'code':
        return <CodeEditor question={question} onChange={onChange} />;
      case 'diagram':
        return <DiagramEditor question={question} onChange={onChange} />;
      case 'diagram-mcq':
      case 'diagram-tf':
      case 'diagram-matching':
      case 'paragraph-mcq':
      case 'paragraph-tf':
      case 'paragraph-matching':
        return <CombinedQuestionEditor question={question} onChange={onChange} />;
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Please select a question type to begin editing.
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        {getEditor()}
      </div>
    </div>
  );
};
