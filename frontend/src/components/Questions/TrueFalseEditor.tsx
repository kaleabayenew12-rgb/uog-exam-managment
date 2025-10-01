import React from 'react';
import { Question } from '../../types';

interface TrueFalseEditorProps {
  question: Partial<Question>;
  onChange: (question: Partial<Question>) => void;
}

export const TrueFalseEditor: React.FC<TrueFalseEditorProps> = ({ question, onChange }) => {
  const handleQuestionChange = (text: string) => {
    onChange({ ...question, text });
  };

  const handleCorrectChange = (correct: boolean) => {
    onChange({ ...question, correct });
  };

  const handleMarksChange = (marks: number) => {
    onChange({ ...question, marks });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Statement *
        </label>
        <textarea
          value={question.text || ''}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
          placeholder="Enter a statement that can be evaluated as true or false..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Marks *
        </label>
        <input
          type="number"
          min="1"
          value={question.marks || 1}
          onChange={(e) => handleMarksChange(parseInt(e.target.value))}
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Correct Answer *
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="answer"
              checked={question.correct === true}
              onChange={() => handleCorrectChange(true)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">True</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="answer"
              checked={question.correct === false}
              onChange={() => handleCorrectChange(false)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">False</span>
          </label>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Best Practice:</strong> Write clear, unambiguous statements that have a definitive true or false answer. 
          Avoid statements that could be interpreted in multiple ways.
        </p>
      </div>
    </div>
  );
};
